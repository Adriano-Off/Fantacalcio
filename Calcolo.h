#ifndef CALCOLO_H
#define CALCOLO_H

#include "Strutture.h"

void Calc_port(Giocatore *G);
void Calc_dif(Giocatore *G);
void Calc_cen(Giocatore *G);
void Calc_att(Giocatore *G);
void calcola_punteggi(Giocatore rosa[]);
int calcola_difficolta(const char avversario[]);
int calcola_forza_squadra(const char squadra[]);
double calcola_modificatore_squadra(const char squadra[], RuoloEnum ruolo);

#endif