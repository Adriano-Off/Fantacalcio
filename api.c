#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "Strutture.h"
#include "Calcolo.h"
#include "Database.h"

void print_json_rosa(Giocatore rosa[]) {
    printf("Content-Type: application/json\n");
    printf("Access-Control-Allow-Origin: *\n\n");
    
    printf("{\"players\":[");
    for(int i = 0; i < TOT_GIOCATORI; i++) {
        printf("{\"nome\":\"%s\",\"ruolo\":%d,\"squadra\":\"%s\","
               "\"punteggio\":%.2f,\"titolarita\":%.1f,"
               "\"avversario\":\"%s\",\"difficolta\":%d,"
               "\"infortunato\":%s,\"disponibile\":%s}",
               rosa[i].Nome, rosa[i].Ruolo, rosa[i].Squadra,
               rosa[i].Punteggio, rosa[i].PercentualeTitolarita,
               rosa[i].Avversario, rosa[i].DifficoltaPartita,
               rosa[i].Infortunato ? "true" : "false",
               rosa[i].Disponibile ? "true" : "false");
        if(i < TOT_GIOCATORI - 1) printf(",");
    }
    printf("]}");
}

void print_json_classifica() {
    printf("Content-Type: application/json\n");
    printf("Access-Control-Allow-Origin: *\n\n");
    
    printf("{\"teams\":[");
    for(int i = 0; i < NUM_SQUADRE; i++) {
        printf("{\"nome\":\"%s\",\"punti\":%d}",
               classifica[i].nome, classifica[i].punti_classifica);
        if(i < NUM_SQUADRE - 1) printf(",");
    }
    printf("]}");
}

int main() {
    char *query = getenv("QUERY_STRING");
    char *method = getenv("REQUEST_METHOD");
    
    Giocatore rosa[TOT_GIOCATORI];
    
    if (query == NULL) {
        printf("Content-Type: application/json\n\n");
        printf("{\"error\":\"No query string\"}");
        return 0;
    }
    
    // GET /api.cgi?action=rosa
    if(strstr(query, "action=rosa") != NULL) {
        carica_database(rosa);
        print_json_rosa(rosa);
    }
    // GET /api.cgi?action=classifica
    else if(strstr(query, "action=classifica") != NULL) {
        print_json_classifica();
    }
    // GET /api.cgi?action=calcola
    else if(strstr(query, "action=calcola") != NULL) {
        carica_database(rosa);
        calcola_punteggi(rosa);
        salva_database(rosa);
        printf("Content-Type: application/json\n");
        printf("Access-Control-Allow-Origin: *\n\n");
        printf("{\"status\":\"success\",\"message\":\"Punteggi calcolati\"}");
    }
    else {
        printf("Content-Type: application/json\n\n");
        printf("{\"error\":\"Unknown action\"}");
    }
    
    return 0;
}
