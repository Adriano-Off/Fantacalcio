#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "Strutture.h"
#include "Database.h"
#include "Calcolo.h"   
#include "Modifica.h"   // ← AGGIUNGI QUESTA RIGA
#include "cJSON.h"  // Aggiungi all'inizio del file



void salva_database(Giocatore rosa[]) {
    FILE *file = fopen(DB_FILE, "wb");
    if(file == NULL) {
        printf("Errore nel salvataggio!\n");
        return;
    }
    
    size_t scritti = fwrite(rosa, sizeof(Giocatore), TOT_GIOCATORI, file);
    fclose(file);
    
    if(scritti == TOT_GIOCATORI) {
        printf("Database salvato in %s\n", DB_FILE);
    } else {
        printf("Errore durante il salvataggio!\n");
    }
}

void carica_database(Giocatore rosa[]) {
    FILE *file = fopen(DB_FILE, "rb");
    if(file == NULL) {
        printf("Nessun database trovato. Inizializzazione con valori di default.\n");
        return;
    }
    
    size_t letti = fread(rosa, sizeof(Giocatore), TOT_GIOCATORI, file);
    fclose(file);
    
    if(letti == TOT_GIOCATORI) {
        printf("Database caricato da %s\n", DB_FILE);
    } else {
        printf("Errore durante il caricamento del database!\n");
    }

}
void importa_da_csv(Giocatore rosa[], const char *filename) {
    FILE *file = fopen(filename, "r");
    if(file == NULL) {
        printf("Errore: impossibile aprire il file %s\n", filename);
        return;
    }
    
    char linea[512];
    // Salta l'header
    if(fgets(linea, sizeof(linea), file) == NULL) {
        printf("Errore: file vuoto\n");
        fclose(file);
        return;
    }
    
    int indice = 0;
    int giocatori_importati = 0;
    
    while(fgets(linea, sizeof(linea), file) != NULL && indice < TOT_GIOCATORI) {
        Giocatore temp;
        char ruolo_char;
        int infortunato;
        char avversario[DIM];
        
        // Parsing della linea CSV con il campo Avversario
        int campi_letti = sscanf(linea, 
            "%[^;];%[^;];%c;%d;%d;%d;%d;%d;%lf;%lf;%lf;%lf;%f;%d;%[^\r\n]",
            temp.Nome,
            temp.Squadra,
            &ruolo_char,
            &temp.S.Goals,
            &temp.S.Assist,
            &temp.S.Minuti_giocati,
            &temp.S.Clean_sheet,
            &temp.S.Gol_subiti,
            &temp.S.Xgoals,
            &temp.S.Xassist,
            &temp.S.Media_voto,
            &temp.S.Media_fantavoto,
            &temp.PercentualeTitolarita,
            &infortunato,
            avversario
        );
        
        if(campi_letti != 15) {
            printf("Errore nel parsing della riga per %s (campi letti: %d)\n", 
                   temp.Nome, campi_letti);
            continue;
        }
        
        // Rimuovi spazi bianchi finali dall'avversario
        int len = strlen(avversario);
        while(len > 0 && (avversario[len-1] == ' ' || 
                          avversario[len-1] == '\r' || 
                          avversario[len-1] == '\n' ||
                          avversario[len-1] == '\t')) {
            avversario[len-1] = '\0';
            len--;
        }
        strcpy(temp.Avversario, avversario);
        
        // Converti il carattere ruolo nell'enum
        switch(ruolo_char) {
            case 'P':
                temp.Ruolo = PORTIERE;
                break;
            case 'D':
                temp.Ruolo = DIFENSORE;
                break;
            case 'C':
                temp.Ruolo = CENTROCAMPISTA;
                break;
            case 'A':
                temp.Ruolo = ATTACCANTE;
                break;
            default:
                printf("Ruolo non riconosciuto per %s: %c\n", temp.Nome, ruolo_char);
                continue;
        }
        
        // Imposta lo stato di infortunio
        temp.Infortunato = (infortunato != 0);
        
        // Cerca il giocatore nella rosa esistente per nome
        int trovato = 0;
        for(int i = 0; i < TOT_GIOCATORI; i++) {
            if(strcmp(rosa[i].Nome, temp.Nome) == 0) {
                // Aggiorna le statistiche e l'avversario del giocatore esistente
                rosa[i].S = temp.S;
                rosa[i].Infortunato = temp.Infortunato;
                rosa[i].PercentualeTitolarita = temp.PercentualeTitolarita;
                strcpy(rosa[i].Squadra, temp.Squadra);
                strcpy(rosa[i].Avversario, temp.Avversario);
                trovato = 1;
                giocatori_importati++;
                break;
            }
        }
        
        if(!trovato) {
            printf("Attenzione: giocatore %s non trovato nella rosa\n", temp.Nome);
        }
        
        indice++;
    }
    
    fclose(file);
    for(int i = 0; i < TOT_GIOCATORI; i++) {
        if(strlen(rosa[i].Avversario) > 0 && 
           strcmp(rosa[i].Avversario, "Da definire") != 0) {
            rosa[i].DifficoltaPartita = calcola_difficolta(rosa[i].Avversario);
        }
    }
    
    printf("Importazione completata: %d giocatori aggiornati da %s\n", 
           giocatori_importati, filename);
}


void importa_classifica_da_csv(const char *filename) {
    FILE *file = fopen(filename, "r");
    if(file == NULL) {
        printf("Errore: impossibile aprire il file %s\n", filename);
        return;
    }
    
    char linea[256];
    // Salta l'header
    if(fgets(linea, sizeof(linea), file) == NULL) {
        printf("Errore: file vuoto\n");
        fclose(file);
        return;
    }
    
    int squadre_importate = 0;
    
    while(fgets(linea, sizeof(linea), file) != NULL) {
        char nome_squadra[DIM];
        int punti;
        
        // Parsing della linea CSV (delimitatore punto e virgola)
        int campi_letti = sscanf(linea, "%[^;];%d", nome_squadra, &punti);
        
        if(campi_letti != 2) {
            continue;
        }
        
        // Rimuovi spazi bianchi, \r, \n, virgolette alla fine e all'inizio del nome
        int len = strlen(nome_squadra);
        while(len > 0 && (nome_squadra[len-1] == ' ' || 
                          nome_squadra[len-1] == '\r' || 
                          nome_squadra[len-1] == '\n' ||
                          nome_squadra[len-1] == '\t' ||
                          nome_squadra[len-1] == '"')) {
            nome_squadra[len-1] = '\0';
            len--;
        }
        
        // Rimuovi virgolette e spazi all'inizio
        char *inizio = nome_squadra;
        while(*inizio == ' ' || *inizio == '"' || *inizio == '\t') {
            inizio++;
        }
        
        // Sposta la stringa se necessario
        if(inizio != nome_squadra) {
            memmove(nome_squadra, inizio, strlen(inizio) + 1);
        }
        
        // Cerca la squadra nell'array classifica e aggiorna i punti
        int trovato = 0;
        for(int i = 0; i < NUM_SQUADRE; i++) {
            if(strcmp(classifica[i].nome, nome_squadra) == 0) {
                classifica[i].punti_classifica = punti;
                trovato = 1;
                squadre_importate++;
                break;
            }
        }
        
        if(!trovato) {
            printf("Attenzione: squadra '%s' non trovata nella classifica\n", nome_squadra);
        }
    }
    
    fclose(file);
    printf("Importazione completata: %d squadre aggiornate da %s\n", 
           squadre_importate+1, filename);
}

// NUOVO: Export JSON per interfaccia web
void esporta_json_rosa(Giocatore rosa[]) {
    FILE *file = fopen("www/rosa.json", "w");
    if(file == NULL) {
        printf("Errore nell'apertura di rosa.json!\n");
        return;
    }
    
    fprintf(file, "{\"players\":[\n");
    
    for(int i = 0; i < TOT_GIOCATORI; i++) {
        fprintf(file, "{");
        fprintf(file, "\"nome\":\"%s\",", rosa[i].Nome);
        fprintf(file, "\"ruolo\":%d,", rosa[i].Ruolo);
        fprintf(file, "\"squadra\":\"%s\",", rosa[i].Squadra);
        fprintf(file, "\"punteggio\":%.2f,", rosa[i].Punteggio);
        fprintf(file, "\"titolarita\":%.1f,", rosa[i].PercentualeTitolarita);
        fprintf(file, "\"avversario\":\"%s\",", rosa[i].Avversario);
        fprintf(file, "\"difficolta\":%d,", rosa[i].DifficoltaPartita);
        fprintf(file, "\"infortunato\":%s,", rosa[i].Infortunato ? "true" : "false");
        fprintf(file, "\"disponibile\":%s,", rosa[i].Disponibile ? "true" : "false");
        
        // BLOCCO STATISTICHE - AGGIUNGI QUESTO
        fprintf(file, "\"stats\":{");
        fprintf(file, "\"goals\":%d,", rosa[i].S.Goals);
        fprintf(file, "\"assist\":%d,", rosa[i].S.Assist);
        fprintf(file, "\"minuti\":%d,", rosa[i].S.Minuti_giocati);
        fprintf(file, "\"cleanSheet\":%d,", rosa[i].S.Clean_sheet);
        fprintf(file, "\"golSubiti\":%d,", rosa[i].S.Gol_subiti);
        fprintf(file, "\"xgoals\":%.2f,", rosa[i].S.Xgoals);
        fprintf(file, "\"xassist\":%.2f,", rosa[i].S.Xassist);
        fprintf(file, "\"mediaVoto\":%.2f,", rosa[i].S.Media_voto);
        fprintf(file, "\"mediaFantavoto\":%.2f", rosa[i].S.Media_fantavoto);
        fprintf(file, "}");
        
        fprintf(file, "}");
        if(i < TOT_GIOCATORI - 1) fprintf(file, ",\n");
        else fprintf(file, "\n");
    }
    
    fprintf(file, "]}\n");
    fclose(file);
    
    printf("✓ Rosa esportata in rosa.json (con statistiche)\n");
}

// NUOVO: Export formazione ottimale nel JSON
void esporta_formazione_json(Giocatore rosa[]) {
    // Calcola migliore formazione (usa la funzione esistente)
    Giocatore* portieri[TOT_GIOCATORI];
    Giocatore* difensori[TOT_GIOCATORI];
    Giocatore* centrocampisti[TOT_GIOCATORI];
    Giocatore* attaccanti[TOT_GIOCATORI];
    
    int num_p = 0, num_d = 0, num_c = 0, num_a = 0;
    
    // Separa per ruolo e ordina
    for(int i = 0; i < TOT_GIOCATORI; i++) {
        if(!rosa[i].Disponibile || rosa[i].Infortunato) continue;
        
        switch(rosa[i].Ruolo) {
            case PORTIERE: portieri[num_p++] = &rosa[i]; break;
            case DIFENSORE: difensori[num_d++] = &rosa[i]; break;
            case CENTROCAMPISTA: centrocampisti[num_c++] = &rosa[i]; break;
            case ATTACCANTE: attaccanti[num_a++] = &rosa[i]; break;
        }
    }
    
    // Ordina per punteggio decrescente
    // CORRETTO (usa queste righe):
ordina_giocatori_puntatori(portieri, num_p);
ordina_giocatori_puntatori(difensori, num_d);
ordina_giocatori_puntatori(centrocampisti, num_c);
ordina_giocatori_puntatori(attaccanti, num_a);

    
    // Prova moduli
    typedef struct {
        int dif, cen, att;
    } Modulo;
    
    Modulo moduli[] = {
        {3, 4, 3}, {3, 5, 2}, {4, 3, 3}, 
        {4, 4, 2}, {4, 5, 1}, {5, 3, 2}, {5, 4, 1}
    };
    
    double punteggio_migliore = -1;
    Modulo modulo_migliore = {4, 4, 2};
    
    for(int m = 0; m < 7; m++) {
        if(num_d < moduli[m].dif || num_c < moduli[m].cen || num_a < moduli[m].att) 
            continue;
        
        double punteggio = 0;
        if(num_p > 0) punteggio += portieri[0]->Punteggio;
        
        for(int i = 0; i < moduli[m].dif; i++) 
            punteggio += difensori[i]->Punteggio;
        for(int i = 0; i < moduli[m].cen; i++) 
            punteggio += centrocampisti[i]->Punteggio;
        for(int i = 0; i < moduli[m].att; i++) 
            punteggio += attaccanti[i]->Punteggio;
        
        if(punteggio > punteggio_migliore) {
            punteggio_migliore = punteggio;
            modulo_migliore = moduli[m];
        }
    }
    
    // Esporta in JSON
    FILE *file = fopen("www/formazione.json", "w");
    if(file == NULL) {
        printf("Errore nell'esportazione formazione JSON!\n");
        return;
    }
    
    fprintf(file, "{\"modulo\":{\"dif\":%d,\"cen\":%d,\"att\":%d},", 
            modulo_migliore.dif, modulo_migliore.cen, modulo_migliore.att);
    fprintf(file, "\"punteggioTotale\":%.2f,", punteggio_migliore);
    fprintf(file, "\"giocatori\":[");
    
    // Portiere
    if(num_p > 0) {
        fprintf(file, "\"%s\"", portieri[0]->Nome);
    }
    
    // Difensori
    for(int i = 0; i < modulo_migliore.dif && i < num_d; i++) {
        fprintf(file, ",\"%s\"", difensori[i]->Nome);
    }
    
    // Centrocampisti
    for(int i = 0; i < modulo_migliore.cen && i < num_c; i++) {
        fprintf(file, ",\"%s\"", centrocampisti[i]->Nome);
    }
    
    // Attaccanti
    for(int i = 0; i < modulo_migliore.att && i < num_a; i++) {
        fprintf(file, ",\"%s\"", attaccanti[i]->Nome);
    }
    
    fprintf(file, "]}");
    fclose(file);
    
    printf("✓ Formazione esportata in formazione.json (%d-%d-%d, Punteggio: %.2f)\n",
           modulo_migliore.dif, modulo_migliore.cen, modulo_migliore.att, punteggio_migliore);
}


void esporta_json_classifica() {
    FILE *file = fopen("www/classifica.json", "w");
    if(file == NULL) {
        printf("Errore nell'esportazione JSON!\n");
        return;
    }
    
    fprintf(file, "{\"teams\":[");
    
    for(int i = 0; i < NUM_SQUADRE; i++) {
        fprintf(file, 
            "{\"nome\":\"%s\",\"punti\":%d}",
            classifica[i].nome,
            classifica[i].punti_classifica
        );
        
        if(i < NUM_SQUADRE - 1) {
            fprintf(file, ",");
        }
    }
    
    fprintf(file, "]}");
    fclose(file);
    printf("✓ Classifica esportata in classifica.json\n");
}

// Aggiungi questa funzione in Database.c dopo esporta_json_rosa()

void importa_json_modifiche(Giocatore rosa[]) {
    FILE *file = fopen("www/rosa.json", "r");
    if(file == NULL) {
        printf("❌ File rosa.json non trovato!\n");
        return;
    }
    
    // Leggi il file
    fseek(file, 0, SEEK_END);
    long fileSize = ftell(file);
    fseek(file, 0, SEEK_SET);
    
    char *jsonContent = malloc(fileSize + 1);
    fread(jsonContent, 1, fileSize, file);
    jsonContent[fileSize] = '\0';
    fclose(file);
    
    // Parse JSON
    cJSON *root = cJSON_Parse(jsonContent);
    free(jsonContent);
    
    if(root == NULL) {
        printf("❌ Errore nel parsing JSON!\n");
        return;
    }
    
    cJSON *players = cJSON_GetObjectItem(root, "players");
    if(!cJSON_IsArray(players)) {
        printf("❌ Formato JSON non valido!\n");
        cJSON_Delete(root);
        return;
    }
    
    int updated = 0;
    
    // Itera sui giocatori
    cJSON *player = NULL;
    cJSON_ArrayForEach(player, players) {
        // Leggi nome
        cJSON *nome = cJSON_GetObjectItem(player, "nome");
        if(!cJSON_IsString(nome)) continue;
        
        // Trova il giocatore nella rosa
        int foundIndex = -1;
        for(int i = 0; i < TOT_GIOCATORI; i++) {
            if(strcmp(rosa[i].Nome, nome->valuestring) == 0) {
                foundIndex = i;
                break;
            }
        }
        
        if(foundIndex == -1) continue;
        
        // Aggiorna campi base
        cJSON *titolarita = cJSON_GetObjectItem(player, "titolarita");
        if(cJSON_IsNumber(titolarita)) {
            rosa[foundIndex].PercentualeTitolarita = titolarita->valuedouble;
        }
        
        cJSON *disponibile = cJSON_GetObjectItem(player, "disponibile");
        if(cJSON_IsBool(disponibile)) {
            rosa[foundIndex].Disponibile = cJSON_IsTrue(disponibile);
        }
        
        cJSON *infortunato = cJSON_GetObjectItem(player, "infortunato");
        if(cJSON_IsBool(infortunato)) {
            rosa[foundIndex].Infortunato = cJSON_IsTrue(infortunato);
        }
        
        // Aggiorna statistiche
        cJSON *stats = cJSON_GetObjectItem(player, "stats");
        if(cJSON_IsObject(stats)) {
            cJSON *goals = cJSON_GetObjectItem(stats, "goals");
            if(cJSON_IsNumber(goals)) {
                rosa[foundIndex].S.Goals = goals->valueint;
            }
            
            cJSON *assist = cJSON_GetObjectItem(stats, "assist");
            if(cJSON_IsNumber(assist)) {
                rosa[foundIndex].S.Assist = assist->valueint;
            }
            
            cJSON *minuti = cJSON_GetObjectItem(stats, "minuti");
            if(cJSON_IsNumber(minuti)) {
                rosa[foundIndex].S.Minuti_giocati = minuti->valueint;
            }
            
            cJSON *cleanSheet = cJSON_GetObjectItem(stats, "cleanSheet");
            if(cJSON_IsNumber(cleanSheet)) {
                rosa[foundIndex].S.Clean_sheet = cleanSheet->valueint;
            }
            
            cJSON *golSubiti = cJSON_GetObjectItem(stats, "golSubiti");
            if(cJSON_IsNumber(golSubiti)) {
                rosa[foundIndex].S.Gol_subiti = golSubiti->valueint;
            }
            
            cJSON *mediaVoto = cJSON_GetObjectItem(stats, "mediaVoto");
            if(cJSON_IsNumber(mediaVoto)) {
                rosa[foundIndex].S.Media_voto = mediaVoto->valuedouble;
            }
            
            cJSON *mediaFantavoto = cJSON_GetObjectItem(stats, "mediaFantavoto");
            if(cJSON_IsNumber(mediaFantavoto)) {
                rosa[foundIndex].S.Media_fantavoto = mediaFantavoto->valuedouble;
            }
        }
        
        printf("✓ Aggiornato: %s (Goals: %d, Assist: %d)\n", 
               nome->valuestring, rosa[foundIndex].S.Goals, rosa[foundIndex].S.Assist);
        updated++;
    }
    
    cJSON_Delete(root);
    
    printf("\n✓ Importati %d giocatori\n", updated);
    
    // Salva automaticamente
    printf("💾 Salvataggio automatico...\n");
    salva_database(rosa);
    printf("✓ Database salvato!\n\n");
}