#ifndef MODIFICA_H
#define MODIFICA_H

#include "Strutture.h"

void ordina_giocatori(Giocatore rosa[], int size);
void ordina_giocatori_puntatori(Giocatore** array, int size);  // ← AGGIUNGI QUESTA RIGA
void clear_input_buffer(void);
void aggiorna_larghezze_globali(Giocatore rosa[]);

#endif
