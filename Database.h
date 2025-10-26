#ifndef DATABASE_H
#define DATABASE_H

#include "Strutture.h"

void salva_database(Giocatore rosa[]);
void carica_database(Giocatore rosa[]);
void importa_da_csv(Giocatore rosa[], const char *filename);
void importa_classifica_da_csv(const char *filename);
void importa_classifica_da_csv(const char *filename);
void esporta_json_rosa(Giocatore rosa[]);
void esporta_formazione_json(Giocatore rosa[]);
void esporta_json_classifica();
void importa_json_modifiche(Giocatore rosa[]);

#endif
