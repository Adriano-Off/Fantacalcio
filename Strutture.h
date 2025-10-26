#ifndef STRUTTURE_H
#define STRUTTURE_H

#include <stdio.h>
#include <stdbool.h>
#include <string.h>

#define DIM 30
#define NUM_PORTIERI 3
#define NUM_DIFENSORI 8
#define NUM_CENTROCAMPISTI 8
#define NUM_ATTACCANTI 6
#define TOT_GIOCATORI (NUM_PORTIERI + NUM_DIFENSORI + NUM_CENTROCAMPISTI + NUM_ATTACCANTI)
#define DB_FILE "giocatori.dat"
#define NUM_SQUADRE 20

#define PUNTO_NEUTRO 10.0
#define COEFF_PORTIERE 0.035
#define COEFF_DIFENSORE 0.025
#define COEFF_CENTROCAMPISTA 0.030
#define COEFF_ATTACCANTE 0.040

typedef struct {
    char nome[DIM];
    int punti_classifica;
} Squadra;

extern Squadra classifica[NUM_SQUADRE]; 

typedef enum {
    PORTIERE = 0,
    DIFENSORE = 1,
    CENTROCAMPISTA = 2,
    ATTACCANTE = 3
} RuoloEnum;

extern char Ruoli[4][DIM]; 

typedef struct {
    int Goals;
    int Assist;
    int Minuti_giocati;
    int Clean_sheet;
    int Gol_subiti;
    double Xgoals;
    double Xassist;
    double Media_voto;
    double Media_fantavoto;
} Score;

typedef struct {
    char Nome[DIM];
    RuoloEnum Ruolo;
    double Punteggio;
    bool Disponibile;
    float PercentualeTitolarita;
    char Avversario[DIM];
    int DifficoltaPartita;
    bool Infortunato;
    char Squadra[DIM];
    Score S;
} Giocatore;

typedef struct {
    int larghezza_nome;
    int larghezza_squadra;
    int larghezza_avversario;
} LarghezzeColonne;

// NUOVO: Struttura per coefficienti di calcolo punteggio
typedef struct {
    double goals;
    double assist;
    double clean_sheet;
    double gol_subiti;
    double xgoals;
    double xassist;
    double media_voto;
    double media_fantavoto;
    double bonus_minuti;
} CoefficientiRuolo;

extern LarghezzeColonne larghezze_globali; 

#endif
