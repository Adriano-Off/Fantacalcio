#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include "Strutture.h"
#include "Calcolo.h"

// OTTIMIZZATO: Cache per evitare lookup ripetuti
static int cache_forza[NUM_SQUADRE] = {-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 
                                       -1, -1, -1, -1, -1, -1, -1, -1, -1, -1};
static bool cache_inizializzata = false;

static void inizializza_cache() {
    if (!cache_inizializzata) {
        for(int i = 0; i < NUM_SQUADRE; i++) {
            cache_forza[i] = classifica[i].punti_classifica;
        }
        cache_inizializzata = true;
    }
}

int calcola_difficolta(const char avversario[]) {
    inizializza_cache();
    for(int i = 0; i < NUM_SQUADRE; i++) {
        if(strcmp(classifica[i].nome, avversario) == 0) {
            return cache_forza[i];
        }
    }
    return 10; 
}

int calcola_forza_squadra(const char squadra[]) {
    inizializza_cache();
    for(int i = 0; i < NUM_SQUADRE; i++) {
        if(strcmp(classifica[i].nome, squadra) == 0) {
            return cache_forza[i];
        }
    }
    return 10;
}

double calcola_modificatore_squadra(const char squadra[], RuoloEnum ruolo) {
    int forza = calcola_forza_squadra(squadra);
    double modificatore_base = 0.7 + (forza - 1) * (0.6 / 19.0); 
    
    switch(ruolo) {
        case PORTIERE:
            return modificatore_base * 1.1;
        case DIFENSORE:
            return modificatore_base * 1.05;
        case CENTROCAMPISTA:
            return modificatore_base;
        case ATTACCANTE:
            return modificatore_base * 0.95;
        default:
            return modificatore_base;
    }
}

// NUOVO: Coefficienti per ciascun ruolo
static const CoefficientiRuolo COEFF_PORT = {
    .goals = 15.0, .assist = 8.0, .clean_sheet = 6.0, .gol_subiti = -1.0,
    .xgoals = 3.0, .xassist = 2.0, .media_voto = 4.0, 
    .media_fantavoto = 5.0, .bonus_minuti = 2.0
};

static const CoefficientiRuolo COEFF_DIF = {
    .goals = 12.0, .assist = 6.0, .clean_sheet = 0.0, .gol_subiti = 0.0,
    .xgoals = 2.5, .xassist = 1.5, .media_voto = 3.0, 
    .media_fantavoto = 4.0, .bonus_minuti = 1.5
};

static const CoefficientiRuolo COEFF_CEN = {
    .goals = 10.0, .assist = 5.0, .clean_sheet = 0.0, .gol_subiti = 0.0,
    .xgoals = 2.0, .xassist = 1.0, .media_voto = 2.5, 
    .media_fantavoto = 3.5, .bonus_minuti = 1.0
};

static const CoefficientiRuolo COEFF_ATT = {
    .goals = 8.0, .assist = 4.0, .clean_sheet = 0.0, .gol_subiti = 0.0,
    .xgoals = 1.5, .xassist = 0.8, .media_voto = 2.0, 
    .media_fantavoto = 3.0, .bonus_minuti = 0.5
};

// OTTIMIZZATO: Funzione unificata per calcolo punteggio base
static double calcola_punteggio_base(Giocatore *G, const CoefficientiRuolo *coeff) {
    double score = (G->S.Goals * coeff->goals) + 
                   (G->S.Assist * coeff->assist) + 
                   (G->S.Xgoals * coeff->xgoals) + 
                   (G->S.Xassist * coeff->xassist) + 
                   (G->S.Media_voto * coeff->media_voto) + 
                   (G->S.Media_fantavoto * coeff->media_fantavoto);
    
    // Aggiungi componenti specifiche per portieri
    if (coeff == &COEFF_PORT) {
        score += (G->S.Clean_sheet * coeff->clean_sheet);
        score += (G->S.Gol_subiti * coeff->gol_subiti);
    }
    
    if (G->S.Minuti_giocati > 60) {
        score += coeff->bonus_minuti;
    }
    
    return score;
}

// OTTIMIZZATO: Funzione unificata per tutti i ruoli
static void calcola_punteggio_ruolo(Giocatore *G, const CoefficientiRuolo *coeff, double coeff_difficolta) {
    if(G->Infortunato) {
        G->Punteggio = 0.0;
        return;
    }
    
    double base_score = calcola_punteggio_base(G, coeff);
    double modificatore_squadra = calcola_modificatore_squadra(G->Squadra, G->Ruolo);
    double modificatore_difficolta = 1.0 + (PUNTO_NEUTRO - G->DifficoltaPartita) * coeff_difficolta;
    
    G->Punteggio = base_score * (G->PercentualeTitolarita / 100.0) * 
                   modificatore_difficolta * modificatore_squadra;
}

void Calc_port(Giocatore *G) {
    calcola_punteggio_ruolo(G, &COEFF_PORT, COEFF_PORTIERE);
}

void Calc_dif(Giocatore *G) {
    calcola_punteggio_ruolo(G, &COEFF_DIF, COEFF_DIFENSORE);
}

void Calc_cen(Giocatore *G) {
    calcola_punteggio_ruolo(G, &COEFF_CEN, COEFF_CENTROCAMPISTA);
}

void Calc_att(Giocatore *G) {
    calcola_punteggio_ruolo(G, &COEFF_ATT, COEFF_ATTACCANTE);
}

void calcola_punteggi(Giocatore rosa[]) {
    for(int i = 0; i < TOT_GIOCATORI; i++) {
        switch(rosa[i].Ruolo) {
            case PORTIERE: 
                Calc_port(&rosa[i]); 
                break;
            case DIFENSORE: 
                Calc_dif(&rosa[i]); 
                break;
            case CENTROCAMPISTA: 
                Calc_cen(&rosa[i]); 
                break;
            case ATTACCANTE: 
                Calc_att(&rosa[i]); 
                break;
        }
    }
}
