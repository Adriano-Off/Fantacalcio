#include <stdio.h>
#include <stdlib.h>
#include "Strutture.h"
#include "Calcolo.h"
#include "Database.h"
#include "Modifica.h"
#include "Stampa.h"

// OTTIMIZZATO: Funzione portabile invece di system("pause")
static void attendi_input() {
    printf("\nPremi INVIO per continuare...");
    clear_input_buffer();
    getchar();
}

int main() {
    Giocatore rosa[TOT_GIOCATORI];
    int scelta;
    
    for(int i = 0; i < TOT_GIOCATORI; i++) {
        strcpy(rosa[i].Nome, "Da inserire");
        rosa[i].Ruolo = PORTIERE;
        rosa[i].Punteggio = 0.0;
        rosa[i].Disponibile = true;
        rosa[i].PercentualeTitolarita = 0.0;
        strcpy(rosa[i].Avversario, "Da definire");
        rosa[i].DifficoltaPartita = 10;
        rosa[i].Infortunato = false;
        strcpy(rosa[i].Squadra, "Da definire");
        memset(&rosa[i].S, 0, sizeof(Score));
    }
    
    carica_database(rosa);
    aggiorna_larghezze_globali(rosa);
    
    
    do {        
        printf("\n=== GESTIONE ROSA FANTACALCIO ===\n");
        printf("1. Carica statistiche\n");
        printf("2. Calcola punteggi\n");
        printf("3. Visualizza rosa\n");
        printf("4. Visualizza migliori per ruolo\n");
        printf("5. Visualizza migliore formazione\n");
        printf("6. Statistiche giocatore\n");
        printf("7. Carica classifica\n");
        printf("8. Stampa classifica\n");
        printf("9. Salva database\n");
        printf("10. Esporta per interfaccia web\n");  // ← NUOVO
        printf("11. Importa modifiche da interfaccia web\n");  // ← NUOVA OPZIONE
        printf("0. Esci\n");
        printf("Scelta: ");
        
        if(scanf("%d", &scelta) != 1) {
            printf("Input non valido!\n");
            clear_input_buffer();
            continue;
        }
        
        switch(scelta) {
            case 1:
                importa_da_csv(rosa, "statistiche_giocatori.csv");
                salva_database(rosa);
                break;
                
            case 2:
                calcola_punteggi(rosa);
                printf("Punteggi calcolati!\n");
                break;
                
            case 3:
                stampa_rosa(rosa);
                attendi_input();
                break;
                
            case 4:
                stampa_migliori_per_ruolo(rosa);
                attendi_input();
                break;

            case 5:
                stampa_migliore_formazione(rosa);
                attendi_input();
                break;    
            
            case 6: {
                char nome[DIM];
                printf("\nNome giocatore: ");
                scanf("%s", nome);
                
                int trovato = 0;
                for(int i = 0; i < TOT_GIOCATORI; i++) {
                    if(strcmp(rosa[i].Nome, nome) == 0) {
                        stampa_statistiche_giocatore(&rosa[i]);
                        trovato = 1;
                        break;
                    }
                }
                if(!trovato) {
                    printf("Giocatore non trovato!\n");
                }
                attendi_input();
                break;
            }
            
            case 7:
                importa_classifica_da_csv("classifica_squadre.csv");
                printf("Classifica aggiornata!\n");
                break;

            case 8:
                stampa_classifica();
                attendi_input();
                break;

            case 9:
                salva_database(rosa);
                break;

            case 10:
                esporta_json_rosa(rosa);
                esporta_json_classifica();
                esporta_formazione_json(rosa);  // ← AGGIUNGI QUESTA RIGA
                printf("\n📁 File JSON pronti!\n");
                printf("Copia rosa.json e classifica.json nella cartella dell'HTML\n");
                break;

            case 11:
                importa_json_modifiche(rosa);
                break;

            case 0:
                printf("Arrivederci!\n");
                break;
                
            default:
                printf("Scelta non valida!\n");
        }
    } while(scelta != 0);
    
    return 0;
}
