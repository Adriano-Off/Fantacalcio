#ifndef STAMPA_H
#define STAMPA_H

#include "Strutture.h"

void stampa_giocatore_formattato(Giocatore *g);
void stampa_rosa(Giocatore rosa[]);
void stampa_migliori_per_ruolo(Giocatore rosa[]);
void stampa_migliore_formazione(Giocatore rosa[]);
void stampa_classifica(void);
void stampa_statistiche_giocatore(Giocatore *g);
void stampa_giocatori_per_ruolo(Giocatore rosa[], int start, int count, const char* titolo);
void stampa_gruppo_giocatori(Giocatore gruppo[], int count, const char* titolo);

#endif
