#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "Strutture.h"
#include "Modifica.h"

void clear_input_buffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

void aggiorna_larghezze_globali(Giocatore rosa[]) {
    larghezze_globali.larghezza_nome = strlen("Nome");
    larghezze_globali.larghezza_squadra = strlen("Squadra");
    larghezze_globali.larghezza_avversario = strlen("Avversario");
    
    for(int i = 0; i < TOT_GIOCATORI; i++) {
        int len_nome = strlen(rosa[i].Nome);
        int len_squadra = strlen(rosa[i].Squadra);
        int len_avversario = strlen(rosa[i].Avversario);
        
        if(len_nome > larghezze_globali.larghezza_nome) {
            larghezze_globali.larghezza_nome = len_nome;
        }
        if(len_squadra > larghezze_globali.larghezza_squadra) {
            larghezze_globali.larghezza_squadra = len_squadra;
        }
        if(len_avversario > larghezze_globali.larghezza_avversario) {
            larghezze_globali.larghezza_avversario = len_avversario;
        }
    }
    
    larghezze_globali.larghezza_nome += 2;
    larghezze_globali.larghezza_squadra += 2;
    larghezze_globali.larghezza_avversario += 2;
}

// OTTIMIZZATO: Funzione di confronto per qsort
static int confronta_giocatori(const void *a, const void *b) {
    Giocatore *ga = (Giocatore *)a;
    Giocatore *gb = (Giocatore *)b;
    
    if (ga->Punteggio > gb->Punteggio) return -1;
    if (ga->Punteggio < gb->Punteggio) return 1;
    return 0;
}

// OTTIMIZZATO: Usa qsort invece di bubble sort (O(n log n) invece di O(n²))
void ordina_giocatori(Giocatore rosa[], int size) {
    if (rosa == NULL || size <= 0) {
        return;
    }
    qsort(rosa, size, sizeof(Giocatore), confronta_giocatori);
}

void ordina_giocatori_puntatori(Giocatore** array, int size) {
    for(int i = 0; i < size - 1; i++) {
        for(int j = 0; j < size - i - 1; j++) {
            if(array[j]->Punteggio < array[j + 1]->Punteggio) {
                Giocatore* temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
}