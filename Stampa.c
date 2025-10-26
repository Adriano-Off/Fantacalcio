#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "Strutture.h"
#include "Stampa.h"
#include "Calcolo.h"    
#include "Modifica.h"  


void stampa_statistiche_giocatore(Giocatore *g) {
    int forza_squadra = calcola_forza_squadra(g->Squadra);
    
    printf("\n=== STATISTICHE %s ===\n", g->Nome);
    printf("Ruolo: %s\n", Ruoli[g->Ruolo]);
    printf("Squadra: %s (Forza: %d/20)\n", g->Squadra, forza_squadra); 
    printf("Punteggio: %.2lf\n", g->Punteggio);
    printf("Titolarità: %.1f%%\n", g->PercentualeTitolarita);
    printf("Avversario: %s (Difficoltà: %d/20)\n", g->Avversario, g->DifficoltaPartita); 
    printf("Infortunio: %s\n", g->Infortunato ? "Si" : "No");
    printf("Disponibile: %s\n", g->Disponibile ? "Si" : "No");
    
    printf("\nStatistiche:\n");
    printf("Goals: %d\n", g->S.Goals);
    printf("Assist: %d\n", g->S.Assist);
    printf("Minuti: %d\n", g->S.Minuti_giocati);
    
    if(g->Ruolo == PORTIERE) {
        printf("Gol subiti: %d\n", g->S.Gol_subiti);
        printf("Clean sheet: %d\n", g->S.Clean_sheet);
    }
    
    printf("Xgoals: %.2lf\n", g->S.Xgoals);
    printf("Xassist: %.2lf\n", g->S.Xassist);
    printf("Media voto: %.2lf\n", g->S.Media_voto);
    printf("Media fantavoto: %.2lf\n", g->S.Media_fantavoto);
}

void stampa_giocatore_formattato(Giocatore *g) {
    if (g == NULL) {
        printf("ERRORE: Giocatore NULL\n");
        return;
    }
    
    char difficolta_str[8];
    snprintf(difficolta_str, sizeof(difficolta_str), "%2d/20", g->DifficoltaPartita);
    
    printf("%-*s %-*s %8.2lf %6.1f%% %-*s %6s %4s\n",
           larghezze_globali.larghezza_nome, g->Nome,
           larghezze_globali.larghezza_squadra, g->Squadra,
           g->Punteggio,
           g->PercentualeTitolarita,
           larghezze_globali.larghezza_avversario, g->Avversario,
           difficolta_str,
           g->Infortunato ? "INF" : " OK");
}

void stampa_giocatori_per_ruolo(Giocatore rosa[], int start, int count, const char* titolo) {
    if (rosa == NULL) {
        printf("ERRORE: Array rosa NULL\n");
        return;
    }
    
    if (start < 0 || start >= TOT_GIOCATORI) {
        printf("ERRORE: Indice start non valido: %d\n", start);
        return;
    }
    
    int end = start + count;
    if (end > TOT_GIOCATORI) {
        end = TOT_GIOCATORI;
        printf("AVVISO: Count ridotto per evitare overflow\n");
    }
    
    printf("\n--- %s ---\n", titolo);
    
    printf("%-*s %-*s %8s %6s %-*s %6s %4s\n",
           larghezze_globali.larghezza_nome, "Nome",
           larghezze_globali.larghezza_squadra, "Squadra",
           "Punteggio", "Tit%",
           larghezze_globali.larghezza_avversario, "Avversario",
           "Diff.", "Stat");
    
    for(int i = 0; i < larghezze_globali.larghezza_nome; i++) printf("-");
    printf(" ");
    for(int i = 0; i < larghezze_globali.larghezza_squadra; i++) printf("-");
    printf(" ");
    for(int i = 0; i < 8; i++) printf("-");
    printf(" ");
    for(int i = 0; i < 6; i++) printf("-"); 
    printf(" ");
    for(int i = 0; i < larghezze_globali.larghezza_avversario; i++) printf("-");
    printf(" ");
    for(int i = 0; i < 6; i++) printf("-"); 
    printf(" ");
    for(int i = 0; i < 4; i++) printf("-");
    printf("\n");
    
    for(int i = start; i < end; i++) {
        stampa_giocatore_formattato(&rosa[i]);
    }
}

void stampa_rosa(Giocatore rosa[]) {
    if (rosa == NULL) {
        printf("ERRORE: Array rosa NULL\n");
        return;
    }
    
    printf("\n=== ROSA COMPLETA ===\n");
    stampa_giocatori_per_ruolo(rosa, 0, NUM_PORTIERI, "PORTIERI");
    stampa_giocatori_per_ruolo(rosa, NUM_PORTIERI, NUM_DIFENSORI, "DIFENSORI");
    stampa_giocatori_per_ruolo(rosa, NUM_PORTIERI + NUM_DIFENSORI, NUM_CENTROCAMPISTI, "CENTROCAMPISTI");
    stampa_giocatori_per_ruolo(rosa, NUM_PORTIERI + NUM_DIFENSORI + NUM_CENTROCAMPISTI, NUM_ATTACCANTI, "ATTACCANTI");
}

void stampa_gruppo_giocatori(Giocatore gruppo[], int count, const char* titolo) {
    printf("\n--- %s ---\n", titolo);
    
    printf("%-*s %-*s %8s %6s %-*s %6s %4s\n",
           larghezze_globali.larghezza_nome, "Nome",
           larghezze_globali.larghezza_squadra, "Squadra",
           "Punteggio", "Tit%",
           larghezze_globali.larghezza_avversario, "Avversario",
           "Diff.", "Stat");
    
    for(int i = 0; i < larghezze_globali.larghezza_nome; i++) printf("-");
    printf(" ");
    for(int i = 0; i < larghezze_globali.larghezza_squadra; i++) printf("-");
    printf(" ");
    for(int i = 0; i < 8; i++) printf("-");
    printf(" ");
    for(int i = 0; i < 6; i++) printf("-");
    printf(" ");
    for(int i = 0; i < larghezze_globali.larghezza_avversario; i++) printf("-");
    printf(" ");
    for(int i = 0; i < 6; i++) printf("-");
    printf(" ");
    for(int i = 0; i < 4; i++) printf("-");
    printf("\n");
    
    for(int i = 0; i < count; i++) {
        stampa_giocatore_formattato(&gruppo[i]);
    }
}

void stampa_migliori_per_ruolo(Giocatore rosa[]) {
    if (rosa == NULL) {
        printf("ERRORE: Array rosa NULL\n");
        return;
    }
    
    printf("\n=== MIGLIORI GIOCATORI PER RUOLO ===\n");
    
    Giocatore portieri[NUM_PORTIERI];
    Giocatore difensori[NUM_DIFENSORI];
    Giocatore centrocampisti[NUM_CENTROCAMPISTI];
    Giocatore attaccanti[NUM_ATTACCANTI];
    
    for(int i = 0; i < NUM_PORTIERI; i++) {
        portieri[i] = rosa[i];
    }
    for(int i = 0; i < NUM_DIFENSORI; i++) {
        difensori[i] = rosa[NUM_PORTIERI + i];
    }
    for(int i = 0; i < NUM_CENTROCAMPISTI; i++) {
        centrocampisti[i] = rosa[NUM_PORTIERI + NUM_DIFENSORI + i];
    }
    for(int i = 0; i < NUM_ATTACCANTI; i++) {
        attaccanti[i] = rosa[NUM_PORTIERI + NUM_DIFENSORI + NUM_CENTROCAMPISTI + i];
    }
    
    ordina_giocatori(portieri, NUM_PORTIERI);
    ordina_giocatori(difensori, NUM_DIFENSORI);
    ordina_giocatori(centrocampisti, NUM_CENTROCAMPISTI);
    ordina_giocatori(attaccanti, NUM_ATTACCANTI);
    
    stampa_gruppo_giocatori(portieri, NUM_PORTIERI, "MIGLIORI PORTIERI");
    stampa_gruppo_giocatori(difensori, NUM_DIFENSORI, "MIGLIORI DIFENSORI");
    stampa_gruppo_giocatori(centrocampisti, NUM_CENTROCAMPISTI, "MIGLIORI CENTROCAMPISTI");
    stampa_gruppo_giocatori(attaccanti, NUM_ATTACCANTI, "MIGLIORI ATTACCANTI");
}

void stampa_migliore_formazione(Giocatore rosa[]) {
    if (rosa == NULL) {
        printf("ERRORE: Array rosa NULL\n");
        return;
    }

    calcola_punteggi(rosa);
    
    ordina_giocatori(&rosa[0], NUM_PORTIERI);
    ordina_giocatori(&rosa[NUM_PORTIERI], NUM_DIFENSORI);
    ordina_giocatori(&rosa[NUM_PORTIERI + NUM_DIFENSORI], NUM_CENTROCAMPISTI);
    ordina_giocatori(&rosa[NUM_PORTIERI + NUM_DIFENSORI + NUM_CENTROCAMPISTI], NUM_ATTACCANTI);

    Giocatore portieri[1];
    Giocatore difensori[5];
    Giocatore centrocampisti[5];
    Giocatore attaccanti[3];

    int moduli[][3] = {
        {3, 4, 3}, {3, 5, 2}, {4, 3, 3}, {4, 4, 2},
        {4, 5, 1}, {5, 3, 2}, {5, 4, 1}
    };
    int num_moduli = 7;

    double punteggio_migliore = -1.0;
    int num_dif_migliore, num_cen_migliore, num_att_migliore;

    for (int m = 0; m < num_moduli; m++) {
        int n_dif = moduli[m][0];
        int n_cen = moduli[m][1];
        int n_att = moduli[m][2];

        double punteggio = rosa[0].Punteggio;
        
        for (int i = 0; i < n_dif && i < NUM_DIFENSORI; i++) {
            punteggio += rosa[NUM_PORTIERI + i].Punteggio;
        }
        for (int i = 0; i < n_cen && i < NUM_CENTROCAMPISTI; i++) {
            punteggio += rosa[NUM_PORTIERI + NUM_DIFENSORI + i].Punteggio;
        }
        for (int i = 0; i < n_att && i < NUM_ATTACCANTI; i++) {
            punteggio += rosa[NUM_PORTIERI + NUM_DIFENSORI + NUM_CENTROCAMPISTI + i].Punteggio;
        }

        if (punteggio > punteggio_migliore) {
            punteggio_migliore = punteggio;
            num_dif_migliore = n_dif;
            num_cen_migliore = n_cen;
            num_att_migliore = n_att;
        }
    }

    portieri[0] = rosa[0];

    for (int i = 0; i < num_dif_migliore; i++) {
        difensori[i] = rosa[NUM_PORTIERI + i];
    }
    for (int i = 0; i < num_cen_migliore; i++) {
        centrocampisti[i] = rosa[NUM_PORTIERI + NUM_DIFENSORI + i];
    }
    for (int i = 0; i < num_att_migliore; i++) {
        attaccanti[i] = rosa[NUM_PORTIERI + NUM_DIFENSORI + NUM_CENTROCAMPISTI + i];
    }

    printf("\n==========================================\n");
    printf("   MIGLIORE FORMAZIONE CONSIGLIATA\n");
    printf("   Modulo: %d-%d-%d\n", num_dif_migliore, num_cen_migliore, num_att_migliore);
    printf("   Punteggio totale previsto: %.2f\n", punteggio_migliore);
    printf("   Punteggio medio previsto: %.2f\n", punteggio_migliore/11);
    printf("==========================================\n\n");

    stampa_gruppo_giocatori(portieri, 1, "PORTIERE");
    stampa_gruppo_giocatori(difensori, num_dif_migliore, "DIFENSORI");
    stampa_gruppo_giocatori(centrocampisti, num_cen_migliore, "CENTROCAMPISTI");
    stampa_gruppo_giocatori(attaccanti, num_att_migliore, "ATTACCANTI");

}

void stampa_classifica() {
    printf("\n=== CLASSIFICA SERIE A (FORZA SQUADRE) ===\n");
    printf("%-20s %s\n", "Squadra", "Forza");
    for(int i = 0; i < NUM_SQUADRE; i++) {
        printf("%-20s %d\n", classifica[i].nome, classifica[i].punti_classifica);
    }
    printf("\nNota: Valori 1-20 dove 20=squadra piu forte, 10=media, 1=piu debole\n");
    printf("Il punto neutro (10) non da ne bonus ne penalita ai giocatori\n");
}