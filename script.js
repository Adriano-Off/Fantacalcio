// CONFIGURAZIONE
const API_BASE = 'http://localhost/cgi-bin/api.cgi';
const USE_BACKEND = false;      // ← Non usa CGI
const USE_JSON_FILES = true;
const AUTO_CALCULATE = false;
let currentSortBy = 'punteggio';
let currentSortDirection = 'desc';
let currentPage = 1;
let itemsPerPage = 25;
let filteredRosa = [];
let currentRoleFilter = 'all';
const PUNTONEUTRO = 10.0;
const COEFFPORTIERE = 0.035;
const COEFFDIFENSORE = 0.025;
const COEFFCENTROCAMPISTA = 0.030;
const COEFFATTACCANTE = 0.040;

const calendario = [
    // Giornata 1 (24 agosto 2025)
    { giornata: 1, data: '2025-08-24', casa: 'Atalanta', trasferta: 'Pisa' },
    { giornata: 1, data: '2025-08-24', casa: 'Cagliari', trasferta: 'Fiorentina' },
    { giornata: 1, data: '2025-08-24', casa: 'Como', trasferta: 'Lazio' },
    { giornata: 1, data: '2025-08-24', casa: 'Genoa', trasferta: 'Lecce' },
    { giornata: 1, data: '2025-08-24', casa: 'Inter', trasferta: 'Torino' },
    { giornata: 1, data: '2025-08-24', casa: 'Juventus', trasferta: 'Parma' },
    { giornata: 1, data: '2025-08-24', casa: 'Milan', trasferta: 'Cremonese' },
    { giornata: 1, data: '2025-08-24', casa: 'Roma', trasferta: 'Bologna' },
    { giornata: 1, data: '2025-08-24', casa: 'Sassuolo', trasferta: 'Napoli' },
    { giornata: 1, data: '2025-08-24', casa: 'Udinese', trasferta: 'Verona' },

    // Giornata 2 (31 agosto 2025)
    { giornata: 2, data: '2025-08-31', casa: 'Bologna', trasferta: 'Como' },
    { giornata: 2, data: '2025-08-31', casa: 'Cremonese', trasferta: 'Sassuolo' },
    { giornata: 2, data: '2025-08-31', casa: 'Genoa', trasferta: 'Juventus' },
    { giornata: 2, data: '2025-08-31', casa: 'Inter', trasferta: 'Udinese' },
    { giornata: 2, data: '2025-08-31', casa: 'Lazio', trasferta: 'Verona' },
    { giornata: 2, data: '2025-08-31', casa: 'Lecce', trasferta: 'Milan' },
    { giornata: 2, data: '2025-08-31', casa: 'Napoli', trasferta: 'Cagliari' },
    { giornata: 2, data: '2025-08-31', casa: 'Parma', trasferta: 'Atalanta' },
    { giornata: 2, data: '2025-08-31', casa: 'Pisa', trasferta: 'Roma' },
    { giornata: 2, data: '2025-08-31', casa: 'Torino', trasferta: 'Fiorentina' },

    // Giornata 3 (14 settembre 2025)
    { giornata: 3, data: '2025-09-14', casa: 'Atalanta', trasferta: 'Lecce' },
    { giornata: 3, data: '2025-09-14', casa: 'Cagliari', trasferta: 'Parma' },
    { giornata: 3, data: '2025-09-14', casa: 'Como', trasferta: 'Genoa' },
    { giornata: 3, data: '2025-09-14', casa: 'Fiorentina', trasferta: 'Napoli' },
    { giornata: 3, data: '2025-09-14', casa: 'Juventus', trasferta: 'Inter' },
    { giornata: 3, data: '2025-09-14', casa: 'Milan', trasferta: 'Bologna' },
    { giornata: 3, data: '2025-09-14', casa: 'Pisa', trasferta: 'Udinese' },
    { giornata: 3, data: '2025-09-14', casa: 'Roma', trasferta: 'Torino' },
    { giornata: 3, data: '2025-09-14', casa: 'Sassuolo', trasferta: 'Lazio' },
    { giornata: 3, data: '2025-09-14', casa: 'Verona', trasferta: 'Cremonese' },

    // Giornata 4 (21 settembre 2025)
    { giornata: 4, data: '2025-09-21', casa: 'Bologna', trasferta: 'Genoa' },
    { giornata: 4, data: '2025-09-21', casa: 'Cremonese', trasferta: 'Parma' },
    { giornata: 4, data: '2025-09-21', casa: 'Fiorentina', trasferta: 'Como' },
    { giornata: 4, data: '2025-09-21', casa: 'Inter', trasferta: 'Sassuolo' },
    { giornata: 4, data: '2025-09-21', casa: 'Lazio', trasferta: 'Roma' },
    { giornata: 4, data: '2025-09-21', casa: 'Lecce', trasferta: 'Cagliari' },
    { giornata: 4, data: '2025-09-21', casa: 'Napoli', trasferta: 'Pisa' },
    { giornata: 4, data: '2025-09-21', casa: 'Torino', trasferta: 'Atalanta' },
    { giornata: 4, data: '2025-09-21', casa: 'Udinese', trasferta: 'Milan' },
    { giornata: 4, data: '2025-09-21', casa: 'Verona', trasferta: 'Juventus' },

    // Giornata 5 (28 settembre 2025)
    { giornata: 5, data: '2025-09-28', casa: 'Cagliari', trasferta: 'Inter' },
    { giornata: 5, data: '2025-09-28', casa: 'Como', trasferta: 'Cremonese' },
    { giornata: 5, data: '2025-09-28', casa: 'Genoa', trasferta: 'Lazio' },
    { giornata: 5, data: '2025-09-28', casa: 'Juventus', trasferta: 'Atalanta' },
    { giornata: 5, data: '2025-09-28', casa: 'Lecce', trasferta: 'Bologna' },
    { giornata: 5, data: '2025-09-28', casa: 'Milan', trasferta: 'Napoli' },
    { giornata: 5, data: '2025-09-28', casa: 'Parma', trasferta: 'Torino' },
    { giornata: 5, data: '2025-09-28', casa: 'Pisa', trasferta: 'Fiorentina' },
    { giornata: 5, data: '2025-09-28', casa: 'Roma', trasferta: 'Verona' },
    { giornata: 5, data: '2025-09-28', casa: 'Sassuolo', trasferta: 'Udinese' },

    // Giornata 6 (5 ottobre 2025)
    { giornata: 6, data: '2025-10-05', casa: 'Atalanta', trasferta: 'Como' },
    { giornata: 6, data: '2025-10-05', casa: 'Bologna', trasferta: 'Pisa' },
    { giornata: 6, data: '2025-10-05', casa: 'Fiorentina', trasferta: 'Roma' },
    { giornata: 6, data: '2025-10-05', casa: 'Inter', trasferta: 'Cremonese' },
    { giornata: 6, data: '2025-10-05', casa: 'Juventus', trasferta: 'Milan' },
    { giornata: 6, data: '2025-10-05', casa: 'Lazio', trasferta: 'Torino' },
    { giornata: 6, data: '2025-10-05', casa: 'Napoli', trasferta: 'Genoa' },
    { giornata: 6, data: '2025-10-05', casa: 'Parma', trasferta: 'Lecce' },
    { giornata: 6, data: '2025-10-05', casa: 'Udinese', trasferta: 'Cagliari' },
    { giornata: 6, data: '2025-10-05', casa: 'Verona', trasferta: 'Sassuolo' },

    // Giornata 7 (19 ottobre 2025)
    { giornata: 7, data: '2025-10-19', casa: 'Atalanta', trasferta: 'Lazio' },
    { giornata: 7, data: '2025-10-19', casa: 'Cagliari', trasferta: 'Bologna' },
    { giornata: 7, data: '2025-10-19', casa: 'Como', trasferta: 'Juventus' },
    { giornata: 7, data: '2025-10-19', casa: 'Cremonese', trasferta: 'Udinese' },
    { giornata: 7, data: '2025-10-19', casa: 'Genoa', trasferta: 'Parma' },
    { giornata: 7, data: '2025-10-19', casa: 'Lecce', trasferta: 'Sassuolo' },
    { giornata: 7, data: '2025-10-19', casa: 'Milan', trasferta: 'Fiorentina' },
    { giornata: 7, data: '2025-10-19', casa: 'Pisa', trasferta: 'Verona' },
    { giornata: 7, data: '2025-10-19', casa: 'Roma', trasferta: 'Inter' },
    { giornata: 7, data: '2025-10-19', casa: 'Torino', trasferta: 'Napoli' },

    // Giornata 8 (26 ottobre 2025)
    { giornata: 8, data: '2025-10-26', casa: 'Cremonese', trasferta: 'Atalanta' },
    { giornata: 8, data: '2025-10-26', casa: 'Fiorentina', trasferta: 'Bologna' },
    { giornata: 8, data: '2025-10-26', casa: 'Lazio', trasferta: 'Juventus' },
    { giornata: 8, data: '2025-10-26', casa: 'Milan', trasferta: 'Pisa' },
    { giornata: 8, data: '2025-10-26', casa: 'Napoli', trasferta: 'Inter' },
    { giornata: 8, data: '2025-10-26', casa: 'Parma', trasferta: 'Como' },
    { giornata: 8, data: '2025-10-26', casa: 'Sassuolo', trasferta: 'Roma' },
    { giornata: 8, data: '2025-10-26', casa: 'Torino', trasferta: 'Genoa' },
    { giornata: 8, data: '2025-10-26', casa: 'Udinese', trasferta: 'Lecce' },
    { giornata: 8, data: '2025-10-26', casa: 'Verona', trasferta: 'Cagliari' },

    // Giornata 9 (29 ottobre 2025)
    { giornata: 9, data: '2025-10-29', casa: 'Atalanta', trasferta: 'Milan' },
    { giornata: 9, data: '2025-10-29', casa: 'Bologna', trasferta: 'Torino' },
    { giornata: 9, data: '2025-10-29', casa: 'Cagliari', trasferta: 'Sassuolo' },
    { giornata: 9, data: '2025-10-29', casa: 'Como', trasferta: 'Verona' },
    { giornata: 9, data: '2025-10-29', casa: 'Genoa', trasferta: 'Cremonese' },
    { giornata: 9, data: '2025-10-29', casa: 'Inter', trasferta: 'Fiorentina' },
    { giornata: 9, data: '2025-10-29', casa: 'Juventus', trasferta: 'Udinese' },
    { giornata: 9, data: '2025-10-29', casa: 'Lecce', trasferta: 'Napoli' },
    { giornata: 9, data: '2025-10-29', casa: 'Pisa', trasferta: 'Lazio' },
    { giornata: 9, data: '2025-10-29', casa: 'Roma', trasferta: 'Parma' },

    // Giornata 10 (2 novembre 2025)
    { giornata: 10, data: '2025-11-02', casa: 'Cremonese', trasferta: 'Juventus' },
    { giornata: 10, data: '2025-11-02', casa: 'Fiorentina', trasferta: 'Lecce' },
    { giornata: 10, data: '2025-11-02', casa: 'Lazio', trasferta: 'Cagliari' },
    { giornata: 10, data: '2025-11-02', casa: 'Milan', trasferta: 'Roma' },
    { giornata: 10, data: '2025-11-02', casa: 'Napoli', trasferta: 'Como' },
    { giornata: 10, data: '2025-11-02', casa: 'Parma', trasferta: 'Bologna' },
    { giornata: 10, data: '2025-11-02', casa: 'Sassuolo', trasferta: 'Genoa' },
    { giornata: 10, data: '2025-11-02', casa: 'Torino', trasferta: 'Pisa' },
    { giornata: 10, data: '2025-11-02', casa: 'Udinese', trasferta: 'Atalanta' },
    { giornata: 10, data: '2025-11-02', casa: 'Verona', trasferta: 'Inter' },

    // Giornata 11 (9 novembre 2025)
    { giornata: 11, data: '2025-11-09', casa: 'Atalanta', trasferta: 'Sassuolo' },
    { giornata: 11, data: '2025-11-09', casa: 'Bologna', trasferta: 'Napoli' },
    { giornata: 11, data: '2025-11-09', casa: 'Como', trasferta: 'Cagliari' },
    { giornata: 11, data: '2025-11-09', casa: 'Genoa', trasferta: 'Fiorentina' },
    { giornata: 11, data: '2025-11-09', casa: 'Inter', trasferta: 'Lazio' },
    { giornata: 11, data: '2025-11-09', casa: 'Juventus', trasferta: 'Torino' },
    { giornata: 11, data: '2025-11-09', casa: 'Lecce', trasferta: 'Verona' },
    { giornata: 11, data: '2025-11-09', casa: 'Parma', trasferta: 'Milan' },
    { giornata: 11, data: '2025-11-09', casa: 'Pisa', trasferta: 'Cremonese' },
    { giornata: 11, data: '2025-11-09', casa: 'Roma', trasferta: 'Udinese' },

    // Giornata 12 (23 novembre 2025)
    { giornata: 12, data: '2025-11-23', casa: 'Cagliari', trasferta: 'Genoa' },
    { giornata: 12, data: '2025-11-23', casa: 'Cremonese', trasferta: 'Roma' },
    { giornata: 12, data: '2025-11-23', casa: 'Fiorentina', trasferta: 'Juventus' },
    { giornata: 12, data: '2025-11-23', casa: 'Inter', trasferta: 'Milan' },
    { giornata: 12, data: '2025-11-23', casa: 'Lazio', trasferta: 'Lecce' },
    { giornata: 12, data: '2025-11-23', casa: 'Napoli', trasferta: 'Atalanta' },
    { giornata: 12, data: '2025-11-23', casa: 'Sassuolo', trasferta: 'Pisa' },
    { giornata: 12, data: '2025-11-23', casa: 'Torino', trasferta: 'Como' },
    { giornata: 12, data: '2025-11-23', casa: 'Udinese', trasferta: 'Bologna' },
    { giornata: 12, data: '2025-11-23', casa: 'Verona', trasferta: 'Parma' },

    // Giornata 13 (30 novembre 2025)
    { giornata: 13, data: '2025-11-30', casa: 'Atalanta', trasferta: 'Fiorentina' },
    { giornata: 13, data: '2025-11-30', casa: 'Bologna', trasferta: 'Cremonese' },
    { giornata: 13, data: '2025-11-30', casa: 'Como', trasferta: 'Sassuolo' },
    { giornata: 13, data: '2025-11-30', casa: 'Genoa', trasferta: 'Verona' },
    { giornata: 13, data: '2025-11-30', casa: 'Juventus', trasferta: 'Cagliari' },
    { giornata: 13, data: '2025-11-30', casa: 'Lecce', trasferta: 'Torino' },
    { giornata: 13, data: '2025-11-30', casa: 'Milan', trasferta: 'Lazio' },
    { giornata: 13, data: '2025-11-30', casa: 'Parma', trasferta: 'Udinese' },
    { giornata: 13, data: '2025-11-30', casa: 'Pisa', trasferta: 'Inter' },
    { giornata: 13, data: '2025-11-30', casa: 'Roma', trasferta: 'Napoli' },

    // Giornata 14 (7 dicembre 2025)
    { giornata: 14, data: '2025-12-07', casa: 'Cagliari', trasferta: 'Roma' },
    { giornata: 14, data: '2025-12-07', casa: 'Cremonese', trasferta: 'Lecce' },
    { giornata: 14, data: '2025-12-07', casa: 'Inter', trasferta: 'Como' },
    { giornata: 14, data: '2025-12-07', casa: 'Lazio', trasferta: 'Bologna' },
    { giornata: 14, data: '2025-12-07', casa: 'Napoli', trasferta: 'Juventus' },
    { giornata: 14, data: '2025-12-07', casa: 'Pisa', trasferta: 'Parma' },
    { giornata: 14, data: '2025-12-07', casa: 'Sassuolo', trasferta: 'Fiorentina' },
    { giornata: 14, data: '2025-12-07', casa: 'Torino', trasferta: 'Milan' },
    { giornata: 14, data: '2025-12-07', casa: 'Udinese', trasferta: 'Genoa' },
    { giornata: 14, data: '2025-12-07', casa: 'Verona', trasferta: 'Atalanta' },

    // Giornata 15 (14 dicembre 2025)
    { giornata: 15, data: '2025-12-14', casa: 'Atalanta', trasferta: 'Cagliari' },
    { giornata: 15, data: '2025-12-14', casa: 'Bologna', trasferta: 'Juventus' },
    { giornata: 15, data: '2025-12-14', casa: 'Fiorentina', trasferta: 'Verona' },
    { giornata: 15, data: '2025-12-14', casa: 'Genoa', trasferta: 'Inter' },
    { giornata: 15, data: '2025-12-14', casa: 'Lecce', trasferta: 'Pisa' },
    { giornata: 15, data: '2025-12-14', casa: 'Milan', trasferta: 'Sassuolo' },
    { giornata: 15, data: '2025-12-14', casa: 'Parma', trasferta: 'Lazio' },
    { giornata: 15, data: '2025-12-14', casa: 'Roma', trasferta: 'Como' },
    { giornata: 15, data: '2025-12-14', casa: 'Torino', trasferta: 'Cremonese' },
    { giornata: 15, data: '2025-12-14', casa: 'Udinese', trasferta: 'Napoli' },

    // Giornata 16 (21 dicembre 2025)
    { giornata: 16, data: '2025-12-21', casa: 'Cagliari', trasferta: 'Pisa' },
    { giornata: 16, data: '2025-12-21', casa: 'Como', trasferta: 'Milan' },
    { giornata: 16, data: '2025-12-21', casa: 'Fiorentina', trasferta: 'Udinese' },
    { giornata: 16, data: '2025-12-21', casa: 'Genoa', trasferta: 'Atalanta' },
    { giornata: 16, data: '2025-12-21', casa: 'Inter', trasferta: 'Lecce' },
    { giornata: 16, data: '2025-12-21', casa: 'Juventus', trasferta: 'Roma' },
    { giornata: 16, data: '2025-12-21', casa: 'Lazio', trasferta: 'Cremonese' },
    { giornata: 16, data: '2025-12-21', casa: 'Napoli', trasferta: 'Parma' },
    { giornata: 16, data: '2025-12-21', casa: 'Sassuolo', trasferta: 'Torino' },
    { giornata: 16, data: '2025-12-21', casa: 'Verona', trasferta: 'Bologna' },

    // Giornata 17 (28 dicembre 2025)
    { giornata: 17, data: '2025-12-28', casa: 'Atalanta', trasferta: 'Inter' },
    { giornata: 17, data: '2025-12-28', casa: 'Bologna', trasferta: 'Sassuolo' },
    { giornata: 17, data: '2025-12-28', casa: 'Cremonese', trasferta: 'Napoli' },
    { giornata: 17, data: '2025-12-28', casa: 'Lecce', trasferta: 'Como' },
    { giornata: 17, data: '2025-12-28', casa: 'Milan', trasferta: 'Verona' },
    { giornata: 17, data: '2025-12-28', casa: 'Parma', trasferta: 'Fiorentina' },
    { giornata: 17, data: '2025-12-28', casa: 'Pisa', trasferta: 'Juventus' },
    { giornata: 17, data: '2025-12-28', casa: 'Roma', trasferta: 'Genoa' },
    { giornata: 17, data: '2025-12-28', casa: 'Torino', trasferta: 'Cagliari' },
    { giornata: 17, data: '2025-12-28', casa: 'Udinese', trasferta: 'Lazio' },

    // Giornata 18 (3 gennaio 2026)
    { giornata: 18, data: '2026-01-03', casa: 'Atalanta', trasferta: 'Roma' },
    { giornata: 18, data: '2026-01-03', casa: 'Cagliari', trasferta: 'Milan' },
    { giornata: 18, data: '2026-01-03', casa: 'Como', trasferta: 'Udinese' },
    { giornata: 18, data: '2026-01-03', casa: 'Fiorentina', trasferta: 'Cremonese' },
    { giornata: 18, data: '2026-01-03', casa: 'Genoa', trasferta: 'Pisa' },
    { giornata: 18, data: '2026-01-03', casa: 'Inter', trasferta: 'Bologna' },
    { giornata: 18, data: '2026-01-03', casa: 'Juventus', trasferta: 'Lecce' },
    { giornata: 18, data: '2026-01-03', casa: 'Lazio', trasferta: 'Napoli' },
    { giornata: 18, data: '2026-01-03', casa: 'Sassuolo', trasferta: 'Parma' },
    { giornata: 18, data: '2026-01-03', casa: 'Verona', trasferta: 'Torino' },

    // Giornata 19 (6 gennaio 2026)
    { giornata: 19, data: '2026-01-06', casa: 'Bologna', trasferta: 'Atalanta' },
    { giornata: 19, data: '2026-01-06', casa: 'Cremonese', trasferta: 'Cagliari' },
    { giornata: 19, data: '2026-01-06', casa: 'Lazio', trasferta: 'Fiorentina' },
    { giornata: 19, data: '2026-01-06', casa: 'Lecce', trasferta: 'Roma' },
    { giornata: 19, data: '2026-01-06', casa: 'Milan', trasferta: 'Genoa' },
    { giornata: 19, data: '2026-01-06', casa: 'Napoli', trasferta: 'Verona' },
    { giornata: 19, data: '2026-01-06', casa: 'Parma', trasferta: 'Inter' },
    { giornata: 19, data: '2026-01-06', casa: 'Pisa', trasferta: 'Como' },
    { giornata: 19, data: '2026-01-06', casa: 'Sassuolo', trasferta: 'Juventus' },
    { giornata: 19, data: '2026-01-06', casa: 'Torino', trasferta: 'Udinese' },

    // Giornata 20 (11 gennaio 2026)
    { giornata: 20, data: '2026-01-11', casa: 'Atalanta', trasferta: 'Torino' },
    { giornata: 20, data: '2026-01-11', casa: 'Como', trasferta: 'Bologna' },
    { giornata: 20, data: '2026-01-11', casa: 'Fiorentina', trasferta: 'Milan' },
    { giornata: 20, data: '2026-01-11', casa: 'Genoa', trasferta: 'Cagliari' },
    { giornata: 20, data: '2026-01-11', casa: 'Inter', trasferta: 'Napoli' },
    { giornata: 20, data: '2026-01-11', casa: 'Juventus', trasferta: 'Cremonese' },
    { giornata: 20, data: '2026-01-11', casa: 'Lecce', trasferta: 'Parma' },
    { giornata: 20, data: '2026-01-11', casa: 'Roma', trasferta: 'Sassuolo' },
    { giornata: 20, data: '2026-01-11', casa: 'Udinese', trasferta: 'Pisa' },
    { giornata: 20, data: '2026-01-11', casa: 'Verona', trasferta: 'Lazio' },

    // Giornata 21 (18 gennaio 2026)
    { giornata: 21, data: '2026-01-18', casa: 'Bologna', trasferta: 'Fiorentina' },
    { giornata: 21, data: '2026-01-18', casa: 'Cagliari', trasferta: 'Juventus' },
    { giornata: 21, data: '2026-01-18', casa: 'Cremonese', trasferta: 'Verona' },
    { giornata: 21, data: '2026-01-18', casa: 'Lazio', trasferta: 'Como' },
    { giornata: 21, data: '2026-01-18', casa: 'Milan', trasferta: 'Lecce' },
    { giornata: 21, data: '2026-01-18', casa: 'Napoli', trasferta: 'Sassuolo' },
    { giornata: 21, data: '2026-01-18', casa: 'Parma', trasferta: 'Genoa' },
    { giornata: 21, data: '2026-01-18', casa: 'Pisa', trasferta: 'Atalanta' },
    { giornata: 21, data: '2026-01-18', casa: 'Torino', trasferta: 'Roma' },
    { giornata: 21, data: '2026-01-18', casa: 'Udinese', trasferta: 'Inter' },

    // Giornata 22 (25 gennaio 2026)
    { giornata: 22, data: '2026-01-25', casa: 'Atalanta', trasferta: 'Parma' },
    { giornata: 22, data: '2026-01-25', casa: 'Como', trasferta: 'Torino' },
    { giornata: 22, data: '2026-01-25', casa: 'Fiorentina', trasferta: 'Cagliari' },
    { giornata: 22, data: '2026-01-25', casa: 'Genoa', trasferta: 'Bologna' },
    { giornata: 22, data: '2026-01-25', casa: 'Inter', trasferta: 'Pisa' },
    { giornata: 22, data: '2026-01-25', casa: 'Juventus', trasferta: 'Napoli' },
    { giornata: 22, data: '2026-01-25', casa: 'Lecce', trasferta: 'Lazio' },
    { giornata: 22, data: '2026-01-25', casa: 'Roma', trasferta: 'Milan' },
    { giornata: 22, data: '2026-01-25', casa: 'Sassuolo', trasferta: 'Cremonese' },
    { giornata: 22, data: '2026-01-25', casa: 'Verona', trasferta: 'Udinese' },

    // Giornata 23 (1 febbraio 2026)
    { giornata: 23, data: '2026-02-01', casa: 'Bologna', trasferta: 'Milan' },
    { giornata: 23, data: '2026-02-01', casa: 'Cagliari', trasferta: 'Verona' },
    { giornata: 23, data: '2026-02-01', casa: 'Como', trasferta: 'Atalanta' },
    { giornata: 23, data: '2026-02-01', casa: 'Cremonese', trasferta: 'Inter' },
    { giornata: 23, data: '2026-02-01', casa: 'Lazio', trasferta: 'Genoa' },
    { giornata: 23, data: '2026-02-01', casa: 'Napoli', trasferta: 'Fiorentina' },
    { giornata: 23, data: '2026-02-01', casa: 'Parma', trasferta: 'Juventus' },
    { giornata: 23, data: '2026-02-01', casa: 'Pisa', trasferta: 'Sassuolo' },
    { giornata: 23, data: '2026-02-01', casa: 'Torino', trasferta: 'Lecce' },
    { giornata: 23, data: '2026-02-01', casa: 'Udinese', trasferta: 'Roma' },

    // Giornata 24 (8 febbraio 2026)
    { giornata: 24, data: '2026-02-08', casa: 'Atalanta', trasferta: 'Cremonese' },
    { giornata: 24, data: '2026-02-08', casa: 'Bologna', trasferta: 'Parma' },
    { giornata: 24, data: '2026-02-08', casa: 'Fiorentina', trasferta: 'Pisa' },
    { giornata: 24, data: '2026-02-08', casa: 'Genoa', trasferta: 'Udinese' },
    { giornata: 24, data: '2026-02-08', casa: 'Inter', trasferta: 'Juventus' },
    { giornata: 24, data: '2026-02-08', casa: 'Lecce', trasferta: 'Cagliari' },
    { giornata: 24, data: '2026-02-08', casa: 'Milan', trasferta: 'Como' },
    { giornata: 24, data: '2026-02-08', casa: 'Roma', trasferta: 'Lazio' },
    { giornata: 24, data: '2026-02-08', casa: 'Sassuolo', trasferta: 'Torino' },
    { giornata: 24, data: '2026-02-08', casa: 'Verona', trasferta: 'Napoli' },

    // Giornata 25 (15 febbraio 2026)
    { giornata: 25, data: '2026-02-15', casa: 'Cagliari', trasferta: 'Lecce' },
    { giornata: 25, data: '2026-02-15', casa: 'Como', trasferta: 'Fiorentina' },
    { giornata: 25, data: '2026-02-15', casa: 'Cremonese', trasferta: 'Bologna' },
    { giornata: 25, data: '2026-02-15', casa: 'Juventus', trasferta: 'Verona' },
    { giornata: 25, data: '2026-02-15', casa: 'Lazio', trasferta: 'Atalanta' },
    { giornata: 25, data: '2026-02-15', casa: 'Milan', trasferta: 'Udinese' },
    { giornata: 25, data: '2026-02-15', casa: 'Napoli', trasferta: 'Roma' },
    { giornata: 25, data: '2026-02-15', casa: 'Parma', trasferta: 'Sassuolo' },
    { giornata: 25, data: '2026-02-15', casa: 'Pisa', trasferta: 'Genoa' },
    { giornata: 25, data: '2026-02-15', casa: 'Torino', trasferta: 'Inter' },

    // Giornata 26 (22 febbraio 2026)
    { giornata: 26, data: '2026-02-22', casa: 'Atalanta', trasferta: 'Juventus' },
    { giornata: 26, data: '2026-02-22', casa: 'Bologna', trasferta: 'Cagliari' },
    { giornata: 26, data: '2026-02-22', casa: 'Fiorentina', trasferta: 'Torino' },
    { giornata: 26, data: '2026-02-22', casa: 'Genoa', trasferta: 'Milan' },
    { giornata: 26, data: '2026-02-22', casa: 'Inter', trasferta: 'Parma' },
    { giornata: 26, data: '2026-02-22', casa: 'Lecce', trasferta: 'Como' },
    { giornata: 26, data: '2026-02-22', casa: 'Roma', trasferta: 'Cremonese' },
    { giornata: 26, data: '2026-02-22', casa: 'Sassuolo', trasferta: 'Lazio' },
    { giornata: 26, data: '2026-02-22', casa: 'Udinese', trasferta: 'Napoli' },
    { giornata: 26, data: '2026-02-22', casa: 'Verona', trasferta: 'Pisa' },

    // Giornata 27 (1 marzo 2026)
    { giornata: 27, data: '2026-03-01', casa: 'Cagliari', trasferta: 'Udinese' },
    { giornata: 27, data: '2026-03-01', casa: 'Como', trasferta: 'Atalanta' },
    { giornata: 27, data: '2026-03-01', casa: 'Cremonese', trasferta: 'Fiorentina' },
    { giornata: 27, data: '2026-03-01', casa: 'Juventus', trasferta: 'Genoa' },
    { giornata: 27, data: '2026-03-01', casa: 'Lazio', trasferta: 'Inter' },
    { giornata: 27, data: '2026-03-01', casa: 'Milan', trasferta: 'Bologna' },
    { giornata: 27, data: '2026-03-01', casa: 'Napoli', trasferta: 'Lecce' },
    { giornata: 27, data: '2026-03-01', casa: 'Parma', trasferta: 'Roma' },
    { giornata: 27, data: '2026-03-01', casa: 'Pisa', trasferta: 'Torino' },
    { giornata: 27, data: '2026-03-01', casa: 'Sassuolo', trasferta: 'Verona' },

    // Giornata 28 (8 marzo 2026)
    { giornata: 28, data: '2026-03-08', casa: 'Atalanta', trasferta: 'Genoa' },
    { giornata: 28, data: '2026-03-08', casa: 'Bologna', trasferta: 'Verona' },
    { giornata: 28, data: '2026-03-08', casa: 'Fiorentina', trasferta: 'Sassuolo' },
    { giornata: 28, data: '2026-03-08', casa: 'Inter', trasferta: 'Cagliari' },
    { giornata: 28, data: '2026-03-08', casa: 'Lecce', trasferta: 'Cremonese' },
    { giornata: 28, data: '2026-03-08', casa: 'Milan', trasferta: 'Juventus' },
    { giornata: 28, data: '2026-03-08', casa: 'Roma', trasferta: 'Pisa' },
    { giornata: 28, data: '2026-03-08', casa: 'Torino', trasferta: 'Parma' },
    { giornata: 28, data: '2026-03-08', casa: 'Udinese', trasferta: 'Como' },
    { giornata: 28, data: '2026-03-08', casa: 'Napoli', trasferta: 'Lazio' },

    // Giornata 29 (15 marzo 2026)
    { giornata: 29, data: '2026-03-15', casa: 'Cagliari', trasferta: 'Atalanta' },
    { giornata: 29, data: '2026-03-15', casa: 'Como', trasferta: 'Roma' },
    { giornata: 29, data: '2026-03-15', casa: 'Cremonese', trasferta: 'Torino' },
    { giornata: 29, data: '2026-03-15', casa: 'Genoa', trasferta: 'Lecce' },
    { giornata: 29, data: '2026-03-15', casa: 'Juventus', trasferta: 'Bologna' },
    { giornata: 29, data: '2026-03-15', casa: 'Lazio', trasferta: 'Parma' },
    { giornata: 29, data: '2026-03-15', casa: 'Napoli', trasferta: 'Milan' },
    { giornata: 29, data: '2026-03-15', casa: 'Pisa', trasferta: 'Lecce' },
    { giornata: 29, data: '2026-03-15', casa: 'Sassuolo', trasferta: 'Inter' },
    { giornata: 29, data: '2026-03-15', casa: 'Verona', trasferta: 'Fiorentina' },

    // Giornata 30 (22 marzo 2026)
    { giornata: 30, data: '2026-03-22', casa: 'Atalanta', trasferta: 'Udinese' },
    { giornata: 30, data: '2026-03-22', casa: 'Bologna', trasferta: 'Lazio' },
    { giornata: 30, data: '2026-03-22', casa: 'Fiorentina', trasferta: 'Genoa' },
    { giornata: 30, data: '2026-03-22', casa: 'Inter', trasferta: 'Verona' },
    { giornata: 30, data: '2026-03-22', casa: 'Lecce', trasferta: 'Juventus' },
    { giornata: 30, data: '2026-03-22', casa: 'Milan', trasferta: 'Cagliari' },
    { giornata: 30, data: '2026-03-22', casa: 'Parma', trasferta: 'Pisa' },
    { giornata: 30, data: '2026-03-22', casa: 'Roma', trasferta: 'Napoli' },
    { giornata: 30, data: '2026-03-22', casa: 'Torino', trasferta: 'Sassuolo' },
    { giornata: 30, data: '2026-03-22', casa: 'Udinese', trasferta: 'Cremonese' },

    // Giornata 31 (5 aprile 2026)
    { giornata: 31, data: '2026-04-05', casa: 'Cagliari', trasferta: 'Como' },
    { giornata: 31, data: '2026-04-05', casa: 'Cremonese', trasferta: 'Milan' },
    { giornata: 31, data: '2026-04-05', casa: 'Genoa', trasferta: 'Parma' },
    { giornata: 31, data: '2026-04-05', casa: 'Juventus', trasferta: 'Fiorentina' },
    { giornata: 31, data: '2026-04-05', casa: 'Lazio', trasferta: 'Udinese' },
    { giornata: 31, data: '2026-04-05', casa: 'Napoli', trasferta: 'Bologna' },
    { giornata: 31, data: '2026-04-05', casa: 'Pisa', trasferta: 'Atalanta' },
    { giornata: 31, data: '2026-04-05', casa: 'Sassuolo', trasferta: 'Roma' },
    { giornata: 31, data: '2026-04-05', casa: 'Torino', trasferta: 'Inter' },
    { giornata: 31, data: '2026-04-05', casa: 'Verona', trasferta: 'Lecce' },

    // Giornata 32 (8 aprile 2026)
    { giornata: 32, data: '2026-04-08', casa: 'Atalanta', trasferta: 'Napoli' },
    { giornata: 32, data: '2026-04-08', casa: 'Bologna', trasferta: 'Inter' },
    { giornata: 32, data: '2026-04-08', casa: 'Fiorentina', trasferta: 'Lazio' },
    { giornata: 32, data: '2026-04-08', casa: 'Lecce', trasferta: 'Genoa' },
    { giornata: 32, data: '2026-04-08', casa: 'Milan', trasferta: 'Cremonese' },
    { giornata: 32, data: '2026-04-08', casa: 'Parma', trasferta: 'Cagliari' },
    { giornata: 32, data: '2026-04-08', casa: 'Roma', trasferta: 'Juventus' },
    { giornata: 32, data: '2026-04-08', casa: 'Torino', trasferta: 'Verona' },
    { giornata: 32, data: '2026-04-08', casa: 'Udinese', trasferta: 'Sassuolo' },
    { giornata: 32, data: '2026-04-08', casa: 'Como', trasferta: 'Pisa' },

    // Giornata 33 (12 aprile 2026)
    { giornata: 33, data: '2026-04-12', casa: 'Cagliari', trasferta: 'Torino' },
    { giornata: 33, data: '2026-04-12', casa: 'Cremonese', trasferta: 'Lazio' },
    { giornata: 33, data: '2026-04-12', casa: 'Genoa', trasferta: 'Roma' },
    { giornata: 33, data: '2026-04-12', casa: 'Inter', trasferta: 'Atalanta' },
    { giornata: 33, data: '2026-04-12', casa: 'Juventus', trasferta: 'Pisa' },
    { giornata: 33, data: '2026-04-12', casa: 'Lecce', trasferta: 'Bologna' },
    { giornata: 33, data: '2026-04-12', casa: 'Napoli', trasferta: 'Udinese' },
    { giornata: 33, data: '2026-04-12', casa: 'Parma', trasferta: 'Milan' },
    { giornata: 33, data: '2026-04-12', casa: 'Sassuolo', trasferta: 'Como' },
    { giornata: 33, data: '2026-04-12', casa: 'Verona', trasferta: 'Fiorentina' },

    // Giornata 34 (19 aprile 2026)
    { giornata: 34, data: '2026-04-19', casa: 'Atalanta', trasferta: 'Bologna' },
    { giornata: 34, data: '2026-04-19', casa: 'Como', trasferta: 'Juventus' },
    { giornata: 34, data: '2026-04-19', casa: 'Fiorentina', trasferta: 'Inter' },
    { giornata: 34, data: '2026-04-19', casa: 'Lazio', trasferta: 'Milan' },
    { giornata: 34, data: '2026-04-19', casa: 'Pisa', trasferta: 'Cagliari' },
    { giornata: 34, data: '2026-04-19', casa: 'Roma', trasferta: 'Lecce' },
    { giornata: 34, data: '2026-04-19', casa: 'Sassuolo', trasferta: 'Genoa' },
    { giornata: 34, data: '2026-04-19', casa: 'Torino', trasferta: 'Napoli' },
    { giornata: 34, data: '2026-04-19', casa: 'Udinese', trasferta: 'Parma' },
    { giornata: 34, data: '2026-04-19', casa: 'Verona', trasferta: 'Cremonese' },

    // Giornata 35 (26 aprile 2026)
    { giornata: 35, data: '2026-04-26', casa: 'Bologna', trasferta: 'Roma' },
    { giornata: 35, data: '2026-04-26', casa: 'Cagliari', trasferta: 'Atalanta' },
    { giornata: 35, data: '2026-04-26', casa: 'Cremonese', trasferta: 'Sassuolo' },
    { giornata: 35, data: '2026-04-26', casa: 'Genoa', trasferta: 'Torino' },
    { giornata: 35, data: '2026-04-26', casa: 'Inter', trasferta: 'Lecce' },
    { giornata: 35, data: '2026-04-26', casa: 'Juventus', trasferta: 'Udinese' },
    { giornata: 35, data: '2026-04-26', casa: 'Milan', trasferta: 'Fiorentina' },
    { giornata: 35, data: '2026-04-26', casa: 'Napoli', trasferta: 'Parma' },
    { giornata: 35, data: '2026-04-26', casa: 'Pisa', trasferta: 'Verona' },
    { giornata: 35, data: '2026-04-26', casa: 'Como', trasferta: 'Lazio' },

    // Giornata 36 (3 maggio 2026)
    { giornata: 36, data: '2026-05-03', casa: 'Atalanta', trasferta: 'Fiorentina' },
    { giornata: 36, data: '2026-05-03', casa: 'Bologna', trasferta: 'Cremonese' },
    { giornata: 36, data: '2026-05-03', casa: 'Lazio', trasferta: 'Sassuolo' },
    { giornata: 36, data: '2026-05-03', casa: 'Lecce', trasferta: 'Cagliari' },
    { giornata: 36, data: '2026-05-03', casa: 'Milan', trasferta: 'Inter' },
    { giornata: 36, data: '2026-05-03', casa: 'Parma', trasferta: 'Genoa' },
    { giornata: 36, data: '2026-05-03', casa: 'Roma', trasferta: 'Como' },
    { giornata: 36, data: '2026-05-03', casa: 'Torino', trasferta: 'Juventus' },
    { giornata: 36, data: '2026-05-03', casa: 'Udinese', trasferta: 'Verona' },
    { giornata: 36, data: '2026-05-03', casa: 'Napoli', trasferta: 'Pisa' },

    // Giornata 37 (10 maggio 2026)
    { giornata: 37, data: '2026-05-10', casa: 'Cagliari', trasferta: 'Napoli' },
    { giornata: 37, data: '2026-05-10', casa: 'Como', trasferta: 'Inter' },
    { giornata: 37, data: '2026-05-10', casa: 'Cremonese', trasferta: 'Bologna' },
    { giornata: 37, data: '2026-05-10', casa: 'Fiorentina', trasferta: 'Roma' },
    { giornata: 37, data: '2026-05-10', casa: 'Genoa', trasferta: 'Atalanta' },
    { giornata: 37, data: '2026-05-10', casa: 'Juventus', trasferta: 'Milan' },
    { giornata: 37, data: '2026-05-10', casa: 'Pisa', trasferta: 'Lecce' },
    { giornata: 37, data: '2026-05-10', casa: 'Sassuolo', trasferta: 'Parma' },
    { giornata: 37, data: '2026-05-10', casa: 'Udinese', trasferta: 'Torino' },
    { giornata: 37, data: '2026-05-10', casa: 'Verona', trasferta: 'Lazio' },

    // Giornata 38 (17 maggio 2026)
    { giornata: 38, data: '2026-05-17', casa: 'Atalanta', trasferta: 'Verona' },
    { giornata: 38, data: '2026-05-17', casa: 'Bologna', trasferta: 'Juventus' },
    { giornata: 38, data: '2026-05-17', casa: 'Inter', trasferta: 'Cagliari' },
    { giornata: 38, data: '2026-05-17', casa: 'Lazio', trasferta: 'Genoa' },
    { giornata: 38, data: '2026-05-17', casa: 'Lecce', trasferta: 'Udinese' },
    { giornata: 38, data: '2026-05-17', casa: 'Milan', trasferta: 'Sassuolo' },
    { giornata: 38, data: '2026-05-17', casa: 'Napoli', trasferta: 'Fiorentina' },
    { giornata: 38, data: '2026-05-17', casa: 'Parma', trasferta: 'Pisa' },
    { giornata: 38, data: '2026-05-17', casa: 'Roma', trasferta: 'Cremonese' },
    { giornata: 38, data: '2026-05-17', casa: 'Torino', trasferta: 'Como' }
];

let rosa = [];
let classifica = [
    { nome: "Milan", punti: 20 },
    { nome: "Napoli", punti: 19 },
    { nome: "Inter", punti: 18 },
    { nome: "Roma", punti: 17 },
    { nome: "Juventus", punti: 16 },
    { nome: "Atalanta", punti: 15 },
    { nome: "Bologna", punti: 14 },
    { nome: "Lazio", punti: 13 },
    { nome: "Como", punti: 12 },
    { nome: "Fiorentina", punti: 11 },
    { nome: "Torino", punti: 10 },
    { nome: "Udinese", punti: 9 },
    { nome: "Genoa", punti: 8 },
    { nome: "Cagliari", punti: 7 },
    { nome: "Parma", punti: 6 },
    { nome: "Sassuolo", punti: 5 },
    { nome: "Lecce", punti: 4 },
    { nome: "Cremonese", punti: 3 },
    { nome: "Verona", punti: 2 },
    { nome: "Pisa", punti: 1 }
];

const ruoliMap = ["Portiere", "Difensore", "Centrocampista", "Attaccante"];

// Inizializzazione


function checkScoreOrigin() {
    const fromC = rosa.some(p => p.punteggio > 0);

    if (fromC) {
        const badge = document.createElement('div');
        badge.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 0.75rem 1rem;
                    background: var(--success-color);
                    color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 1000;
                    font-size: 0.9rem;
                `;
        badge.innerHTML = '<i class="fas fa-check-circle"></i> Punteggi dal programma C';
        document.body.appendChild(badge);
    }
}

// Ricarica automaticamente ogni 5 secondi se rileva modifiche
let lastLoadTime = 0;

async function autoReload() {
    if (!USE_JSON_FILES) return;

    try {
        const response = await fetch('rosa.json?' + new Date().getTime());
        const lastModified = response.headers.get('Last-Modified');
        const currentTime = new Date(lastModified).getTime();

        if (lastLoadTime > 0 && currentTime > lastLoadTime) {
            console.log('🔄 Rilevate modifiche, ricarico...');
            await loadData();
            await loadClassifica();
            renderDashboard();
            renderRosa();
            //showNotification('Dati aggiornati dal programma C', 'success');
        }

        lastLoadTime = currentTime;
    } catch (error) {
        // File non trovato o errore, ignora
    }
}

// Avvia auto-reload ogni 5 secondi
setInterval(autoReload, 5000);


function updateCalcButton() {
    const calcBtn = document.getElementById('calcPunteggi');

    if (USE_JSON_FILES && rosa.some(p => p.punteggio > 0)) {
        // Cambia stile per indicare che i punteggi sono già calcolati
        calcBtn.style.background = 'var(--text-secondary)';
        calcBtn.title = 'Punteggi già calcolati dal programma C';
    } else {
        calcBtn.style.background = 'var(--primary-color)';
        calcBtn.title = 'Calcola punteggi';
    }
}

async function initializeApp() {
    console.log('🚀 Inizializzazione app...');

    await loadData();
    if (rosa.length > 0) {
        aggiornaAvversariAutomatico(); // ⬅️ AGGIUNGI QUESTA RIGA
    }
    console.log('📊 Rosa length:', rosa.length); // ⬅️ DEBUG

    // ✅ Mostra wizard SOLO se rosa vuota
    // ✅ Mostra wizard SOLO se rosa vuota
if (rosa.length === 0) {
    console.log('👋 Primo accesso - mostra wizard');
    
    const wizard = document.getElementById('firstTimeWizard');
    const mainContent = document.querySelector('.main-content');
    
    if (wizard) {
        // ✅ Forza stili CSS mancanti
        wizard.style.position = 'fixed';
        wizard.style.top = '0';
        wizard.style.left = '0';
        wizard.style.width = '100%';
        wizard.style.height = '100%';
        wizard.style.zIndex = '10000';
        wizard.style.display = 'flex';
        wizard.style.alignItems = 'center';
        wizard.style.justifyContent = 'center';
        wizard.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        wizard.style.padding = '2rem';
        
        console.log('✅ Wizard mostrato');
    }
    
    if (mainContent) mainContent.style.display = 'none';
    
    return;
}

    // Altrimenti renderizza normalmente
    console.log('✅ Dati esistenti - carica interfaccia');

    // Nascondi wizard se presente
    const wizard = document.getElementById('firstTimeWizard');
    if (wizard) wizard.style.display = 'none';

    // Mostra main-content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.style.display = 'block';

    renderDashboard();
    renderRosa();
    renderFormazione();
    renderTopGiocatori();
    renderClassifica();

    console.log('✅ App inizializzata');
}






// NUOVA FUNZIONE: Messaggio di benvenuto
function showWelcomeMessage() {
    const welcomeHtml = `
                <div style="text-align: center; padding: 3rem; background: white; border-radius: 12px; margin: 2rem;">
                    <i class="fas fa-futbol" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                    <h2 style="margin-bottom: 1rem;">Benvenuto nel Gestionale Fantacalcio</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                        Non ci sono giocatori nella rosa. Per iniziare:
                    </p>
                    <div style="display: grid; gap: 1rem; max-width: 600px; margin: 0 auto;">
                        <div style="padding: 1.5rem; background: var(--light); border-radius: 8px; text-align: left;">
                            <strong>Opzione 1: Importa CSV</strong>
                            <p style="margin-top: 0.5rem; color: var(--text-secondary);">
                                Vai su <strong>"Importa Dati"</strong> e carica il file CSV con le statistiche
                            </p>
                        </div>
                        <div style="padding: 1.5rem; background: var(--light); border-radius: 8px; text-align: left;">
                            <strong>Opzione 2: Carica JSON dal programma C</strong>
                            <p style="margin-top: 0.5rem; color: var(--text-secondary);">
                                Esegui l'opzione "10. Esporta per web" nel programma C e copia rosa.json qui
                            </p>
                        </div>
                    </div>
                </div>
            `;

    document.getElementById('topPlayers').innerHTML = welcomeHtml;
    document.getElementById('infortunati').innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nessun dato</p>';
}



function setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Calcola punteggi - USA IL NOME CORRETTO
    const calcBtn = document.getElementById('calcPunteggi');
    if (calcBtn) {
        calcBtn.addEventListener('click', function () {
            if (confirm('⚠️ Ricalcolare i punteggi?\n\nSovrascriverà i punteggi attuali.')) {
                calcolaPunteggi();
            }
        });
    }


    // Salva dati
    const saveBtn = document.getElementById('salvaDati');
    if (saveBtn) {
        saveBtn.addEventListener('click', salvaDati);
    }

    // Reset
    const resetBtn = document.getElementById('resetData');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllData);
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);

            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Chiudi menu mobile
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar?.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // Import stats
    const importStats = document.getElementById('importStats');
    if (importStats) {
        importStats.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) handleStatsImport(file);  // Passa il file
        });
    }

    // Import classifica
    const importClassifica = document.getElementById('importClassifica');
    if (importClassifica) {
        importClassifica.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) handleClassificaImport(file);
        });
    }

    // Search player
    const searchInput = document.getElementById('searchPlayer');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            filterRosaTable(e.target.value);
        });
    }

    // Modal close
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            document.getElementById('playerModal').style.display = 'none';
        });
    }

    // Click outside modal
    window.addEventListener('click', function (e) {
        const modal = document.getElementById('playerModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    console.log('✅ Event listeners configurati');
}



function showSection(sectionId) {
    window.scrollTo(0, 0);
    document.querySelectorAll('.content-section').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });

    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.classList.add('active');
    }

    if (sectionId === 'rosa') {
        renderRosa();
    }

    if (sectionId === 'formazione') {
        renderFormazione();
    }

    if (sectionId === 'classifica') {
        renderClassifica();
    }

    // ✅ AGGIUNGI QUESTO BLOCCO
    if (sectionId === 'topGiocatori') {
        // Calcola avversari usando la stessa logica di renderRosa()
        rosa.forEach(player => {
            const infoPartita = trovaProssimaPartita(player.squadra);

            let difficolta = 10; // default

            if (infoPartita.avversario !== "N/D") {
                const teamAvversario = classifica.find(t => t.nome === infoPartita.avversario);
                if (teamAvversario) {
                    difficolta = teamAvversario.punti;
                }
            }

            player.avversario = infoPartita.avversario;
            player.difficolta = difficolta;
        });

        renderTopGiocatori();
    }

    if (sectionId === 'gestione') {
        renderRosaManagement();
    }




}









// NON caricare rosa.json da file, usa SOLO localStorage
async function loadData() {
    try {
        // Carica rosa da UNA SOLA chiave
        const rosaData = localStorage.getItem('fantacalciorosa');
        if (rosaData) {
            const parsed = JSON.parse(rosaData);
            rosa = parsed.players || parsed || [];
            console.log('✅ Rosa caricata:', rosa.length, 'giocatori');
        } else {
            rosa = [];
            console.log('⚠️ Nessuna rosa trovata');
        }

        // Carica classifica
        const classificaData = localStorage.getItem('fantacalcio_classifica');
        if (classificaData) {
            classifica = JSON.parse(classificaData);
            console.log('✅ Classifica caricata:', classifica.length, 'squadre');
        } else {
            // Classifica predefinita
            classifica = [
                { nome: "Milan", punti: 20 },
                { nome: "Napoli", punti: 19 },
                { nome: "Inter", punti: 18 },
                { nome: "Roma", punti: 17 },
                { nome: "Juventus", punti: 16 },
                { nome: "Atalanta", punti: 15 },
                { nome: "Bologna", punti: 14 },
                { nome: "Lazio", punti: 13 },
                { nome: "Como", punti: 12 },
                { nome: "Fiorentina", punti: 11 },
                { nome: "Torino", punti: 10 },
                { nome: "Udinese", punti: 9 },
                { nome: "Genoa", punti: 8 },
                { nome: "Cagliari", punti: 7 },
                { nome: "Parma", punti: 6 },
                { nome: "Sassuolo", punti: 5 },
                { nome: "Lecce", punti: 4 },
                { nome: "Cremonese", punti: 3 },
                { nome: "Verona", punti: 2 },
                { nome: "Pisa", punti: 1 }
            ];
            localStorage.setItem('fantacalcio_classifica', JSON.stringify(classifica));
            console.log('✅ Classifica predefinita creata');
        }

        console.log(`📊 Dati caricati: ${rosa.length} giocatori, ${classifica.length} squadre`);
    } catch (error) {
        console.error('❌ Errore caricamento dati:', error);
        rosa = [];
        classifica = [];
    }
}




function showLoadJsonPrompt() {
    const prompt = document.createElement('div');
    prompt.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 9999;
                text-align: center;
            `;
    prompt.innerHTML = `
                <h2 style="margin-bottom: 1rem;">Carica i dati</h2>
                <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">
                    Seleziona rosa.json dal programma C
                </p>
                <button data-action="load-json" 
                        class="btn btn-primary">
                    <i class="fas fa-file-import"></i> Carica rosa.json
                </button>
            `;
    document.body.appendChild(prompt);

    document.getElementById('loadRosaJson').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const data = JSON.parse(event.target.result);
                rosa = data.players || [];
                localStorage.setItem('fantasoccerData', JSON.stringify(rosa));
                prompt.remove();
                renderDashboard();
                renderRosa();
                showNotification(`✓ ${rosa.length} giocatori caricati!`, 'success');
            } catch (error) {
                showNotification('Errore nel caricamento JSON', 'error');
            }
        };
        reader.readAsText(file);
    });
}


async function loadClassifica() {
    if (USE_JSON_FILES) {
        try {
            const response = await fetch('classifica.json?' + new Date().getTime());
            if (response.ok) {
                const data = await response.json();
                classifica = data.teams;
                console.log('✓ Classifica caricata da classifica.json (programma C)');
                return;
            }
        } catch (error) {
            console.log('⚠ File classifica.json non trovato, uso default');
        }
    }
    // Usa classifica di default già definita
}


function generateSampleData() {
    // Array vuoto - forza l'uso di file JSON o localStorage
    return [];
}


// Continue in next part...
// Dashboard Rendering
function renderDashboard() {
    updateStatsCards();
    // Update stats
    const stats = {
        portieri: rosa.filter(p => p.ruolo === 0).length,
        difensori: rosa.filter(p => p.ruolo === 1).length,
        centrocampisti: rosa.filter(p => p.ruolo === 2).length,
        attaccanti: rosa.filter(p => p.ruolo === 3).length
    };

    document.getElementById('numPortieri').textContent = stats.portieri;
    document.getElementById('numDifensori').textContent = stats.difensori;
    document.getElementById('numCentrocampisti').textContent = stats.centrocampisti;
    document.getElementById('numAttaccanti').textContent = stats.attaccanti;

    // Top 5 players
    const topPlayers = [...rosa]
        .filter(p => p.disponibile)
        .sort((a, b) => b.punteggio - a.punteggio)
        .slice(0, 5);

    if (topPlayers.length === 0 && rosa.length > 0) {
        document.getElementById('topPlayers').innerHTML =
            '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Calcola i punteggi per vedere i top giocatori</p>';
    } else if (rosa.length === 0) {
        showWelcomeMessage();
    } else {
        const topPlayersHtml = topPlayers.map((player, index) => `
                    <div class="player-item" data-player="${player.nome}">
                        <div class="player-info">
                            <div class="player-avatar">${index + 1}</div>
                            <div>
                                <div class="player-name">${player.nome}</div>
                                <div class="player-role">${ruoliMap[player.ruolo]} - ${player.squadra}</div>
                            </div>
                        </div>
                        <div class="player-score">${player.punteggio.toFixed(2)}</div>
                    </div>
                `).join('');
        document.getElementById('topPlayers').innerHTML = topPlayersHtml;
    }

    // Injured players
    const infortunati = rosa.filter(p => p.infortunato);
    const infortunatiHtml = infortunati.length > 0 ? infortunati.map(player => `
                <div class="player-item">
                    <div class="player-info">
                        <div class="player-avatar" style="background: var(--danger-color);">
                            <i class="fas fa-plus"></i>
                        </div>
                        <div>
                            <div class="player-name">${player.nome}</div>
                            <div class="player-role">${ruoliMap[player.ruolo]} - ${player.squadra}</div>
                        </div>
                    </div>
                    <span class="badge badge-danger">Infortunato</span>
                </div>
            `).join('') : '<p style="text-align: center; color: var(--text-secondary);">Nessun infortunato</p>';

    document.getElementById('infortunati').innerHTML = infortunatiHtml;
}

// Filter Rosa
function filterRosa(searchTerm) {
    const filtered = rosa.filter(player =>
        player.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.squadra.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // APPLICA LO STESSO ORDINAMENTO
    const sorted = filtered.sort((a, b) => {
        // ... stesso codice di ordinamento di renderRosa ...
        let valueA, valueB;

        switch (currentSortBy) {
            case 'punteggio':
                valueA = a.punteggio;
                valueB = b.punteggio;
                break;
            case 'ruolo':
                if (a.ruolo === b.ruolo) {
                    return b.punteggio - a.punteggio;
                }
                valueA = a.ruolo;
                valueB = b.ruolo;
                break;
            case 'nome':
                valueA = a.nome.toLowerCase();
                valueB = b.nome.toLowerCase();
                break;
            case 'squadra':
                valueA = a.squadra.toLowerCase();
                valueB = b.squadra.toLowerCase();
                break;
            case 'titolarita':
                valueA = a.titolarita;
                valueB = b.titolarita;
                break;
            default:
                valueA = a.punteggio;
                valueB = b.punteggio;
        }

        if (currentSortDirection === 'asc') {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
    });

    const tbody = document.getElementById('rosaTableBody');
    const html = sorted.map(player => `
                <!-- ... stesso HTML di renderRosa ... -->
            `).join('');

    tbody.innerHTML = html || '<tr><td colspan="9" style="text-align: center;">Nessun giocatore trovato</td></tr>';
    updateSortButtons();
}


// Formazione Rendering
async function renderFormazione() {
    console.log('🔄 Rendering formazione...');

    // Prova a caricare formazione pre-calcolata
    if (USE_JSON_FILES) {
        try {
            const response = await fetch('formazione.json?' + Date.now());
            if (response.ok) {
                const data = await response.json();
                console.log('✓ Formazione caricata da JSON');
                renderFormazioneFromJSON(data);
                return;
            }
        } catch (error) {
            console.log('⚠️ formazione.json non trovato, uso calcolo locale');
        }
    }

    // Calcolo locale
    renderFormazioneLocale();
}

function renderFormazioneLocale() {
    const container = document.getElementById('formazioneContainer');

    if (!container) {
        console.error('❌ Elemento formazioneContainer non trovato!');
        return;
    }

    console.log('📋 Rosa disponibile:', rosa.length, 'giocatori');

    if (!rosa || rosa.length === 0) {
        container.innerHTML = `
                    <div class="card">
                        <div class="card-body" style="text-align: center; padding: 3rem;">
                            <i class="fas fa-users" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                            <h3>Nessun giocatore disponibile</h3>
                            <p style="color: var(--text-secondary);">Carica prima i dati della rosa</p>
                        </div>
                    </div>
                `;
        return;
    }

    // Dividi per ruolo e ordina per punteggio
    const portieri = rosa.filter(p => p.ruolo === 0 && p.disponibile && !p.infortunato)
        .sort((a, b) => (b.punteggio || 0) - (a.punteggio || 0));
    const difensori = rosa.filter(p => p.ruolo === 1 && p.disponibile && !p.infortunato)
        .sort((a, b) => (b.punteggio || 0) - (a.punteggio || 0));
    const centrocampisti = rosa.filter(p => p.ruolo === 2 && p.disponibile && !p.infortunato)
        .sort((a, b) => (b.punteggio || 0) - (a.punteggio || 0));
    const attaccanti = rosa.filter(p => p.ruolo === 3 && p.disponibile && !p.infortunato)
        .sort((a, b) => (b.punteggio || 0) - (a.punteggio || 0));

    console.log(`👥 Disponibili - P:${portieri.length} D:${difensori.length} C:${centrocampisti.length} A:${attaccanti.length}`);

    // Verifica se ci sono abbastanza giocatori
    if (!portieri[0] || difensori.length < 3 || centrocampisti.length < 5 || attaccanti.length < 2) {
        container.innerHTML = `
                    <div class="card">
                        <div class="card-body" style="text-align: center; padding: 3rem;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--warning-color); margin-bottom: 1rem;"></i>
                            <h3>Non ci sono abbastanza giocatori disponibili</h3>
                            <p style="color: var(--text-secondary);">
                                <strong>Serve formazione 3-5-2:</strong><br>
                                1 Portiere, 3 Difensori, 5 Centrocampisti, 2 Attaccanti
                            </p>
                            <p style="margin-top: 1rem; padding: 1rem; background: #fef3c7; border-radius: 8px;">
                                <strong>Disponibili ora:</strong><br>
                                Portieri: ${portieri.length}, 
                                Difensori: ${difensori.length}, 
                                Centrocampisti: ${centrocampisti.length}, 
                                Attaccanti: ${attaccanti.length}
                            </p>
                        </div>
                    </div>
                `;
        return;
    }

    // Formazione 3-5-2
    const formazione = {
        portiere: portieri[0],
        difensori: difensori.slice(0, 3),
        centrocampisti: centrocampisti.slice(0, 5),
        attaccanti: attaccanti.slice(0, 2)
    };

    // Calcola punteggio totale
    const punteggioTotale = [
        formazione.portiere,
        ...formazione.difensori,
        ...formazione.centrocampisti,
        ...formazione.attaccanti
    ].reduce((sum, p) => sum + (p?.punteggio || 0), 0);

    console.log('✅ Formazione calcolata. Punteggio:', punteggioTotale.toFixed(2));

    // Template giocatore
    const renderPlayer = (player) => {
        if (!player) return '<div style="opacity: 0.3;">Nessuno</div>';
        return `
                    <div class="campo-player" data-player="${player.nome}" 
                        style="cursor: pointer; background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.2s; min-width: 120px;" 
                        onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.3)'" 
                        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)'">
                        <strong style="display: block; color: #111827; font-size: 0.9rem; margin-bottom: 0.25rem;">${player.nome}</strong>
                        <span style="color: var(--text-secondary); font-size: 0.75rem;">${player.squadra}</span>
                        <div style="margin-top: 0.5rem; padding: 0.3rem 0.6rem; background: linear-gradient(135deg, var(--primary-color), #7c3aed); color: white; border-radius: 4px; font-weight: 700; font-size: 0.9rem;">
                            ${(player.punteggio || 0).toFixed(2)}
                        </div>
                    </div>
                `;
    };

    // Render HTML
    const html = `
                <div style="background: linear-gradient(135deg, var(--primary-color), #2563eb); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; text-align: center;">
                    <h2 style="margin: 0 0 0.5rem; font-size: 2rem;"><i class="fas fa-tactics"></i> Formazione Ottimale 3-5-2</h2>
                    <p style="margin: 0; font-size: 1.5rem; font-weight: 700;">Punteggio Totale: ${punteggioTotale.toFixed(2)}</p>
                </div>
                
                <div class="card">
                    <div class="campo-container" style="background: linear-gradient(180deg, #16a34a, #15803d); padding: 3rem 2rem; border-radius: 12px;">
                        <div style="display: flex; flex-direction: column; gap: 3rem;">
                            
                            <!-- Attaccanti -->
                            <div style="display: flex; justify-content: center; gap: 4rem;">
                                ${formazione.attaccanti.map(renderPlayer).join('')}
                            </div>
                            
                            <!-- Centrocampisti -->
                            <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                                ${formazione.centrocampisti.map(renderPlayer).join('')}
                            </div>
                            
                            <!-- Difensori -->
                            <div style="display: flex; justify-content: center; gap: 4rem;">
                                ${formazione.difensori.map(renderPlayer).join('')}
                            </div>
                            
                            <!-- Portiere -->
                            <div style="display: flex; justify-content: center;">
                                ${renderPlayer(formazione.portiere)}
                            </div>
                            
                        </div>
                    </div>
                </div>
            `;

    container.innerHTML = html;
}

function renderFormazioneFromJSON(data) {
    // Placeholder per formazione da JSON pre-calcolata
    renderFormazioneLocale();
}

function renderFormationPlayers(players) {
    return players.map(player => `
                <div class="formation-player" data-player="${player.nome}">
                    <div class="formation-player-name">${player.nome}</div>
                    <div class="formation-player-score">${player.punteggio.toFixed(2)}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${player.squadra}</div>
                </div>
            `).join('');
}
function renderFormazioneLocale() {
    const disponibili = rosa.filter(p => p.disponibile && !p.infortunato);

    // Ordina per punteggio decrescente per ruolo
    const portieri = disponibili.filter(p => p.ruolo === 0).sort((a, b) => b.punteggio - a.punteggio);
    const difensori = disponibili.filter(p => p.ruolo === 1).sort((a, b) => b.punteggio - a.punteggio);
    const centrocampisti = disponibili.filter(p => p.ruolo === 2).sort((a, b) => b.punteggio - a.punteggio);
    const attaccanti = disponibili.filter(p => p.ruolo === 3).sort((a, b) => b.punteggio - a.punteggio);

    // Moduli da provare (identici al programma C)
    const moduli = [
        { dif: 3, cen: 4, att: 3 },
        { dif: 3, cen: 5, att: 2 },
        { dif: 4, cen: 3, att: 3 },
        { dif: 4, cen: 4, att: 2 },
        { dif: 4, cen: 5, att: 1 },
        { dif: 5, cen: 3, att: 2 },
        { dif: 5, cen: 4, att: 1 }
    ];

    let punteggioMigliore = -1;
    let moduloMigliore = null;

    // Prova ogni modulo
    moduli.forEach(modulo => {
        // Verifica che ci siano abbastanza giocatori
        if (difensori.length < modulo.dif ||
            centrocampisti.length < modulo.cen ||
            attaccanti.length < modulo.att) {
            return; // Salta questo modulo
        }

        // Calcola punteggio totale per questo modulo
        let punteggio = 0;

        // Portiere (sempre 1)
        if (portieri.length > 0) {
            punteggio += portieri[0].punteggio;
        }

        // Difensori
        for (let i = 0; i < modulo.dif; i++) {
            punteggio += difensori[i].punteggio;
        }

        // Centrocampisti
        for (let i = 0; i < modulo.cen; i++) {
            punteggio += centrocampisti[i].punteggio;
        }

        // Attaccanti
        for (let i = 0; i < modulo.att; i++) {
            punteggio += attaccanti[i].punteggio;
        }

        // Se questo modulo è migliore, salvalo
        if (punteggio > punteggioMigliore) {
            punteggioMigliore = punteggio;
            moduloMigliore = modulo;
        }
    });

    // Se non c'è un modulo valido, usa il default
    if (!moduloMigliore) {
        moduloMigliore = { dif: 4, cen: 4, att: 2 };
    }

    // Seleziona i giocatori per il modulo migliore
    const formazionePortieri = portieri.slice(0, 1);
    const formazioneDifensori = difensori.slice(0, moduloMigliore.dif);
    const formazioneCentrocampisti = centrocampisti.slice(0, moduloMigliore.cen);
    const formazioneAttaccanti = attaccanti.slice(0, moduloMigliore.att);

    // Mostra il modulo e punteggio totale
    const punteggioMedio = punteggioMigliore / 11;
    const infoModulo = `
                <div style="text-align: center; margin-bottom: 2rem; padding: 1.5rem; background: white; border-radius: 12px;">
                    <h2 style="margin-bottom: 1rem;">Modulo: ${moduloMigliore.dif}-${moduloMigliore.cen}-${moduloMigliore.att}</h2>
                    <div style="display: flex; gap: 2rem; justify-content: center;">
                        <div>
                            <p style="color: var(--text-secondary); margin-bottom: 0.25rem;">Punteggio Totale</p>
                            <p style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">${punteggioMigliore.toFixed(2)}</p>
                        </div>
                        <div>
                            <p style="color: var(--text-secondary); margin-bottom: 0.25rem;">Punteggio Medio</p>
                            <p style="font-size: 2rem; font-weight: 700; color: var(--success-color);">${punteggioMedio.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            `;

    // Inserisci le informazioni del modulo prima del campo
    const formazioneContainer = document.querySelector('.formation-container');
    if (formazioneContainer) {
        const existingInfo = formazioneContainer.querySelector('.modulo-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        const infoDiv = document.createElement('div');
        infoDiv.className = 'modulo-info';
        infoDiv.innerHTML = infoModulo;
        formazioneContainer.insertBefore(infoDiv, formazioneContainer.firstChild);
    }

    // Renderizza i giocatori
    document.getElementById('formazionePortieri').innerHTML = renderFormationPlayers(formazionePortieri);
    document.getElementById('formazioneDifensori').innerHTML = renderFormationPlayers(formazioneDifensori);
    document.getElementById('formazioneCentrocampisti').innerHTML = renderFormationPlayers(formazioneCentrocampisti);
    document.getElementById('formazioneAttaccanti').innerHTML = renderFormationPlayers(formazioneAttaccanti);
}


// Role Players Grid
function renderRolePlayersGrid(role) {
    const filtered = role === 'all' ? rosa : rosa.filter(p => p.ruolo === parseInt(role));
    const sorted = [...filtered].sort((a, b) => b.punteggio - a.punteggio);

    const html = sorted.map(player => `
                <div class="player-card" data-player="${player.nome}">
                    <div class="player-card-header">
                        <div>
                            <div class="player-card-name">${player.nome}</div>
                            <span class="badge badge-info">${ruoliMap[player.ruolo]}</span>
                        </div>
                        <div class="player-card-score">${player.punteggio.toFixed(2)}</div>
                    </div>
                    <div class="player-card-info">
                        <div><i class="fas fa-jersey"></i> ${player.squadra}</div>
                        <div><i class="fas fa-percentage"></i> Titolarità: ${player.titolarita}%</div>
                        <div><i class="fas fa-crosshairs"></i> vs ${player.avversario} (Diff. ${player.difficolta})</div>
                        <div>
                            ${player.infortunato ? '<i class="fas fa-heartbeat"></i> <span style="color: var(--danger-color);">Infortunato</span>' :
            player.disponibile ? '<i class="fas fa-check-circle"></i> <span style="color: var(--success-color);">Disponibile</span>' :
                '<i class="fas fa-times-circle"></i> <span style="color: var(--warning-color);">Non disponibile</span>'}
                        </div>
                    </div>
                </div>
            `).join('');

    document.getElementById('rolePlayersGrid').innerHTML = html || '<p style="text-align: center; padding: 2rem;">Nessun giocatore in questa categoria</p>';
}

function filterByRole(role) {
    renderRolePlayersGrid(role);
}

// Classifica Rendering
function renderClassifica() {
    const tbody = document.getElementById('classificaTableBody');
    const html = classifica.map((squadra, index) => {
        let badgeClass = 'badge-success';
        if (index > 16) badgeClass = 'badge-danger';
        else if (index > 12) badgeClass = 'badge-warning';

        return `
                    <tr>
                        <td><strong>${index + 1}</strong></td>
                        <td><strong>${squadra.nome}</strong></td>
                        <td>${squadra.punti}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div style="flex: 1; background: var(--light); height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${(squadra.punti / 20) * 100}%; height: 100%; background: var(--primary-color);"></div>
                                </div>
                                <span class="badge ${badgeClass}">${squadra.punti}/20</span>
                            </div>
                        </td>
                    </tr>
                `;
    }).join('');

    tbody.innerHTML = html;
}

// Player Details Modal
function showPlayerDetails(nomeGiocatore) {

    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    const player = rosa.find(p => p.nome === nomeGiocatore);

    if (!player) {
        showNotification('❌ Giocatore non trovato', 'error');
        return;
    }

    const ruoloNorm = normalizzaRuolo(player.ruolo);
    const isPortiere = ruoloNorm === 'P';

    // ⭐ Estrai le statistiche dall'oggetto stats
    const stats = player.stats || {};
    const infoPartita = trovaProssimaPartita(player.squadra);

    // 🔥 AGGIUNGI QUESTO BLOCCO PER CALCOLARE LA DIFFICOLTÀ
    let difficolta = 10; // default
    if (infoPartita.avversario !== "N/D") {
        const teamAvversario = classifica.find(t => t.nome === infoPartita.avversario);
        if (teamAvversario) {
            difficolta = teamAvversario.punti;
        }
    }
    infoPartita.difficolta = difficolta; // Aggiungi al oggetto infoPartita
    // FINE BLOCCO

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            overflow-y: auto;
            padding: 2rem;
        `;

    modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; width: 100%; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideIn 0.3s ease; margin: auto;">
                <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-color), #2563eb); color: white; padding: 2rem; border-radius: 16px 16px 0 0;">
                    <h2 style="margin: 0; display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-weight: 700; font-size: 1.5rem;">
                            ${ruoloNorm}
                        </div>
                        ${player.nome}
                    </h2>
                    <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">${player.squadra} • ${getRuoloCompleto(ruoloNorm)}</p>
                </div>
                
                <div class="modal-body" style="padding: 2rem;">
                    <!-- Metriche Principali -->
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
                        <div style="background: #f0f9ff; padding: 1.5rem; border-radius: 12px; text-align: center;">
                            <i class="fas fa-chart-line" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 0.5rem;"></i>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Punteggio</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 2rem; font-weight: 700; color: var(--primary-color);">${(player.punteggio || 0).toFixed(2)}</p>
                        </div>
                        
                        <div style="background: #f0fdf4; padding: 1.5rem; border-radius: 12px; text-align: center;">
                            <i class="fas fa-percentage" style="font-size: 2rem; color: var(--success-color); margin-bottom: 0.5rem;"></i>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Titolarità</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 2rem; font-weight: 700; color: var(--success-color);">${player.titolarita || 0}%</p>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 1.5rem; border-radius: 12px; text-align: center;">
                            <i class="fas fa-shield-alt" style="font-size: 2rem; color: var(--warning-color); margin-bottom: 0.5rem;"></i>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Avversario</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: var(--warning-color);">${infoPartita.avversario}</p>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">Giornata ${infoPartita.giornata} - ${infoPartita.data}</p>
                        </div>
                        
                        <div style="background: #fee2e2; padding: 1.5rem; border-radius: 12px; text-align: center;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--danger-color); margin-bottom: 0.5rem;"></i>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Difficoltà</p>
                            <p style="margin: 0.5rem 0 0 0; font-size: 2rem; font-weight: 700; color: var(--danger-color);">${infoPartita.difficolta || player.difficolta || 10}/20</p>
                        </div>
                    </div>
                    
                    <!-- ⭐ STATISTICHE DETTAGLIATE (DINAMICHE PER RUOLO) -->
    <div style="background: linear-gradient(135deg, #f9fafb, #f3f4f6); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
        <h3 style="margin: 0 0 1.5rem 0; color: var(--primary-color); display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-chart-bar"></i> Statistiche Dettagliate
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            ${isPortiere ? `
                <!-- STATISTICHE PER PORTIERI -->
                <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <i class="fas fa-hand-paper" style="color: #10b981; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Clean Sheet</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #10b981;">${stats.cleanSheet || 0}</p>
                </div>
                
                <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <i class="fas fa-bullseye" style="color: #ef4444; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Gol Subiti</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #ef4444;">${stats.golSubiti || 0}</p>
                </div>
                
                <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <i class="fas fa-save" style="color: #3b82f6; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Rigori Parati</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #3b82f6;">${stats.rigoriParati || 0}</p>
                </div>
            ` : `
                <!-- STATISTICHE PER ALTRI RUOLI -->
                <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <i class="fas fa-futbol" style="color: #10b981; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Gol</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #10b981;">${stats.goals || 0}</p>
                </div>
                
                <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <i class="fas fa-hands-helping" style="color: #3b82f6; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Assist</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #3b82f6;">${stats.assist || 0}</p>
                </div>
                
                <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <i class="fas fa-bolt" style="color: #f59e0b; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">xGoals</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #f59e0b;">${(stats.xgoals || 0).toFixed(1)}</p>
                </div>
            `}
            
            <!-- STATISTICHE COMUNI A TUTTI -->
            <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <i class="fas fa-hand-holding-heart" style="color: #8b5cf6; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">xAssist</p>
                <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #8b5cf6;">${(stats.xassist || 0).toFixed(1)}</p>
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <i class="fas fa-star" style="color: #fbbf24; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Media Voto</p>
                <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #fbbf24;">${(stats.mediaVoto || 0).toFixed(2)}</p>
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <i class="fas fa-trophy" style="color: #10b981; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Fantavoto</p>
                <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #10b981;">${(stats.mediaFantavoto || 0).toFixed(2)}</p>
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <i class="fas fa-clock" style="color: #6366f1; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">Minuti</p>
                <p style="margin: 0.25rem 0 0 0; font-size: 1.5rem; font-weight: 700; color: #6366f1;">${stats.minuti || 0}'</p>
            </div>
        </div>
    </div>

                    
                    
                    <!-- Stato -->
                    <div style="padding: 1.5rem; background: ${player.infortunato ? '#fee2e2' : player.disponibile ? '#d1fae5' : '#fef3c7'}; border-radius: 12px; text-align: center;">
                        ${player.infortunato ?
            '<i class="fas fa-heartbeat" style="font-size: 2rem; color: var(--danger-color);"></i><p style="margin: 0.5rem 0 0 0; font-weight: 600; color: var(--danger-color);">Infortunato</p>' :
            player.disponibile ?
                '<i class="fas fa-check-circle" style="font-size: 2rem; color: var(--success-color);"></i><p style="margin: 0.5rem 0 0 0; font-weight: 600; color: var(--success-color);">Disponibile</p>' :
                '<i class="fas fa-exclamation-circle" style="font-size: 2rem; color: var(--warning-color);"></i><p style="margin: 0.5rem 0 0 0; font-weight: 600; color: var(--warning-color);">Non Disponibile</p>'}
                    </div>
                </div>
                
                <div class="modal-footer" style="padding: 1.5rem; border-top: 1px solid #e5e7eb; display: flex; justify-content: center;">
                    <button class="btn btn-primary btn-close-modal" style="padding: 1rem 2rem;">
                        <i class="fas fa-times"></i> Chiudi
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    const closeBtn = modal.querySelector('.btn-close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}






function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        // ⭐ Aggiungi animazione fade-out
        modal.style.transition = 'opacity 0.3s ease';
        modal.style.opacity = '0';

        setTimeout(() => {
            modal.remove(); // Rimuove completamente dal DOM
        }, 300);
    }
}


// Calcola Punteggi
function calcolaPunteggi() {
    const btn = document.getElementById('calcPunteggi');

    // Controllo esistenza pulsante
    if (!btn) {
        console.error('Pulsante calcPunteggi non trovato!');
        return;
    }

    // Testo originale HARDCODED (non catturato dinamicamente)
    const TESTO_ORIGINALE = '<i class="fas fa-calculator"></i> Calcola Punteggi';

    // Funzione per ripristinare SEMPRE il pulsante
    const ripristinaPulsante = () => {
        btn.innerHTML = TESTO_ORIGINALE;
        btn.disabled = false;
    };

    // Controllo dati
    if (!rosa || rosa.length === 0) {
        showNotification('❌ Nessun giocatore da calcolare!', 'error');
        return;
    }

    if (!classifica || classifica.length === 0) {
        showNotification('❌ Classifica mancante! Importa prima la classifica.', 'error');
        return;
    }

    // Mostra loader
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calcolo...';
    btn.disabled = true;

    // Usa setTimeout per permettere al browser di aggiornare l'UI
    setTimeout(() => {
        let updated = 0;

        try {
            console.log('🔄 Inizio calcolo punteggi');

            rosa.forEach((player, index) => {
                try {
                    if (!player) return;

                    // Calcola difficoltà partita
                    player.difficolta = calcolaDifficolta(player.avversario);

                    // Calcola punteggio in base al ruolo
                    let newScore = 0;
                    switch (player.ruolo) {
                        case 0: newScore = calcPortiere(player); break;
                        case 1: newScore = calcDifensore(player); break;
                        case 2: newScore = calcCentrocampista(player); break;
                        case 3: newScore = calcAttaccante(player); break;
                        default: newScore = player.punteggio || 0;
                    }

                    // Aggiorna punteggio
                    player.punteggio = Math.round(newScore * 100) / 100;
                    updated++;

                } catch (error) {
                    console.error(`Errore calcolo giocatore ${index}:`, error);
                }
            });

            console.log(`✅ ${updated}/${rosa.length} giocatori aggiornati`);

            // Salva
            salvaDati();

            // Aggiorna visualizzazioni
            renderDashboard();
            renderRosa();
            renderFormazione();
            renderTopGiocatori();

            showNotification(`✅ Punteggi calcolati per ${updated} giocatori!`, 'success');

        } catch (error) {
            console.error('❌ Errore:', error);
            showNotification('❌ Errore durante il calcolo!', 'error');
        } finally {
            // GARANTISCE il ripristino
            ripristinaPulsante();
        }
    }, 100);
}





// Calcola difficoltà (con fallback)
function calcolaDifficolta(avversario) {
    const team = classifica.find(t => t.nome === avversario);
    return team ? team.punti : 10;
}

// Calcola forza squadra (con fallback)
function calcolaForzaSquadra(nomeSquadra) {
    const team = classifica.find(t => t.nome === nomeSquadra);
    return team ? team.punti : 10;
}

// Calcola modificatore squadra (con fallback)
function calcolaModificatoreSquadra(nomeSquadra, ruolo) {
    const forza = calcolaForzaSquadra(nomeSquadra);

    // Normalizza 0.7 - 1.3 per scala 1-20
    let modificatoreBase = 0.7 + (forza - 1) * (0.6 / (20 - 1));

    // Aggiusta per ruolo
    switch (ruolo) {
        case 0: return modificatoreBase * 1.1;   // Portiere
        case 1: return modificatoreBase * 1.05;  // Difensore
        case 2: return modificatoreBase;          // Centrocampista
        case 3: return modificatoreBase * 0.95;  // Attaccante
        default: return modificatoreBase;
    }
}


// PORTIERE (come in C)
function calcPortiere(player) {
    if (player.infortunato) return 0.0;

    const s = player.stats;

    // Base score IDENTICO al C
    let baseScore = (s.goals * 15.0) +
        (s.assist * 8.0) +
        (s.cleanSheet * 6.0) +
        (s.xgoals * 3.0) +
        (s.xassist * 2.0) +
        (s.mediaVoto * 4.0) +
        (s.mediaFantavoto * 5.0) -
        (s.golSubiti * 1.0);

    if (s.minuti > 60) baseScore += 2.0;

    const modSquadra = calcolaModificatoreSquadra(player.squadra, player.ruolo);
    const modDifficolta = 1.0 + (PUNTONEUTRO - player.difficolta) * COEFFPORTIERE;

    return baseScore * (player.titolarita / 100.0) * modDifficolta * modSquadra;
}

function calcDifensore(player) {
    if (player.infortunato) return 0.0;

    const s = player.stats;

    let baseScore = (s.goals * 12.0) +
        (s.assist * 6.0) +
        (s.xgoals * 2.5) +
        (s.xassist * 1.5) +
        (s.mediaVoto * 3.0) +
        (s.mediaFantavoto * 4.0);

    if (s.minuti > 60) baseScore += 1.5;

    const modSquadra = calcolaModificatoreSquadra(player.squadra, player.ruolo);
    const modDifficolta = 1.0 + (PUNTONEUTRO - player.difficolta) * COEFFDIFENSORE;

    return baseScore * (player.titolarita / 100.0) * modDifficolta * modSquadra;
}

function calcCentrocampista(player) {
    if (player.infortunato) return 0.0;

    const s = player.stats;

    let baseScore = (s.goals * 10.0) +
        (s.assist * 5.0) +
        (s.xgoals * 2.0) +
        (s.xassist * 1.0) +
        (s.mediaVoto * 2.5) +
        (s.mediaFantavoto * 3.5);

    if (s.minuti > 60) baseScore += 1.0;

    const modSquadra = calcolaModificatoreSquadra(player.squadra, player.ruolo);
    const modDifficolta = 1.0 + (PUNTONEUTRO - player.difficolta) * COEFFCENTROCAMPISTA;

    return baseScore * (player.titolarita / 100.0) * modDifficolta * modSquadra;
}

function calcAttaccante(player) {
    if (player.infortunato) return 0.0;

    const s = player.stats;

    let baseScore = (s.goals * 8.0) +
        (s.assist * 4.0) +
        (s.xgoals * 1.5) +
        (s.xassist * 0.8) +
        (s.mediaVoto * 2.0) +
        (s.mediaFantavoto * 3.0);

    if (s.minuti > 60) baseScore += 0.5;

    const modSquadra = calcolaModificatoreSquadra(player.squadra, player.ruolo);
    const modDifficolta = 1.0 + (PUNTONEUTRO - player.difficolta) * COEFFATTACCANTE;

    return baseScore * (player.titolarita / 100.0) * modDifficolta * modSquadra;
}

// Salva Dati
function salvaDati() {
    const data = {
        players: rosa,
        lastUpdate: new Date().toISOString()
    };
    
    localStorage.setItem('fantacalciorosa', JSON.stringify(data));
    console.log('✅ Dati salvati:', rosa.length, 'giocatori');
}

function resetAllData() {
    if (confirm('⚠️ ATTENZIONE!\n\nQuesto cancellerà TUTTI i dati:\n• Rosa giocatori\n• Formazione\n• Classifica\n• Impostazioni\n\nSei sicuro?')) {
        // Cancella TUTTE le chiavi localStorage
        localStorage.removeItem('fantacalciorosa');
        localStorage.removeItem('fantacalcio_rosa');
        localStorage.removeItem('fantacalcio_classifica');
        localStorage.removeItem('wizardCompleted');
        localStorage.removeItem('formazione');

        // Resetta array
        rosa = [];
        classifica = [];

        alert('✅ Tutti i dati sono stati cancellati!');

        // Ricarica la pagina
        location.reload();
    }
}



// Notification
function showNotification(message, type = 'info') {
    try {
        // Rimuovi notifiche esistenti
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());

        // Crea notifica
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Colore in base al tipo
        let bgColor;
        switch (type) {
            case 'success': bgColor = '#10b981'; break;
            case 'error': bgColor = '#ef4444'; break;
            case 'warning': bgColor = '#f59e0b'; break;
            default: bgColor = '#3b82f6'; break;
        }

        // Stile inline
        notification.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: ${bgColor};
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    max-width: 400px;
                    font-weight: 600;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                `;

        document.body.appendChild(notification);

        // Animazione entrata
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

    } catch (error) {
        console.error('Errore showNotification:', error);
        // Fallback: usa alert
        alert(message);
    }
}


// File Import Handlers
// IMPORT STATISTICHE - Versione CORRETTA
function handleStatsImport(file) {  // Riceve il file
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');

            let successCount = 0;

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const fields = line.split(';');
                if (fields.length < 15) continue;

                const nome = fields[0].trim();
                const squadra = fields[1].trim();
                const ruoloChar = fields[2].trim();
                const goals = parseInt(fields[3]) || 0;
                const assist = parseInt(fields[4]) || 0;
                const minuti = parseInt(fields[5]) || 0;
                const cleanSheet = parseInt(fields[6]) || 0;
                const golSubiti = parseInt(fields[7]) || 0;
                const xgoals = parseFloat(fields[8]) || 0;
                const xassist = parseFloat(fields[9]) || 0;
                const mediaVoto = parseFloat(fields[10]) || 0;
                const mediaFantavoto = parseFloat(fields[11]) || 0;
                const titolarita = parseFloat(fields[12]) || 0;
                const infortunato = fields[13].trim().toUpperCase() === 'TRUE';
                const rigoriParati = parseInt(fields[14]) || 0;

                let ruolo;
                switch (ruoloChar.toUpperCase()) {
                    case 'P': ruolo = 0; break;
                    case 'D': ruolo = 1; break;
                    case 'C': ruolo = 2; break;
                    case 'A': ruolo = 3; break;
                    default: continue;
                }

                const avversario = '';
                const teamInfo = classifica.find(t => t.nome === avversario);

                let playerIndex = rosa.findIndex(p => p.nome === nome);

                const playerData = {
                    nome: nome,
                    squadra: squadra,
                    ruolo: ruolo,
                    punteggio: 0,
                    titolarita: titolarita,
                    avversario: avversario,
                    difficolta: teamInfo ? teamInfo.punti : 10,
                    infortunato: infortunato,
                    disponibile: !infortunato,
                    stats: {
                        goals: goals,
                        assist: assist,
                        minuti: minuti,
                        cleanSheet: cleanSheet,
                        golSubiti: golSubiti,
                        rigoriParati: rigoriParati,
                        xgoals: xgoals,
                        xassist: xassist,
                        mediaVoto: mediaVoto,
                        mediaFantavoto: mediaFantavoto
                    }
                };

                if (playerIndex >= 0) {
                    rosa[playerIndex] = playerData;
                } else {
                    rosa.push(playerData);
                }

                successCount++;
            }

            if (successCount > 0) {
                salvaDati();
                renderDashboard();
                renderRosa();

                // ✅ Abilita pulsante Continua del wizard
                const finishBtn = document.getElementById('wizardFinishCSV');
                if (finishBtn) {
                    finishBtn.disabled = false;
                    finishBtn.style.opacity = '1';
                    finishBtn.style.cursor = 'pointer';
                }

                showNotification(`✓ ${successCount} giocatori importati! Premi Continua.`, 'success');
            }


        } catch (error) {
            console.error('Errore import:', error);
            showNotification('Errore nell\'importazione: ' + error.message, 'error');
        }
    };

    reader.readAsText(file);
}


// IMPORT CLASSIFICA - Versione CORRETTA
function handleClassificaImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');

            const newClassifica = [];
            let successCount = 0;
            let errorCount = 0;

            // Salta header
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // Parsing CSV con punto e virgola (;)
                const fields = line.split(';');
                if (fields.length < 2) {
                    errorCount++;
                    continue;
                }

                let nomeSquadra = fields[0].trim();
                const punti = parseInt(fields[1]) || 0;

                // Rimuovi virgolette se presenti
                nomeSquadra = nomeSquadra.replace(/^["']|["']$/g, '');

                if (nomeSquadra && punti >= 0) {
                    newClassifica.push({
                        nome: nomeSquadra,
                        punti: punti
                    });
                    successCount++;
                }
            }

            if (newClassifica.length > 0) {
                // Ordina per punti decrescenti
                classifica = newClassifica.sort((a, b) => b.punti - a.punti);

                // Aggiorna difficoltà partite nella rosa
                rosa.forEach(player => {
                    const teamInfo = classifica.find(t => t.nome === player.avversario);
                    if (teamInfo) {
                        player.difficolta = teamInfo.punti;
                    }
                });

                renderClassifica();
                showNotification(`✓ ${successCount} squadre importate!`, 'success');
            } else {
                showNotification('Nessuna squadra importata. Verifica il formato CSV', 'error');
            }

            if (errorCount > 0) {
                showNotification(`⚠ ${errorCount} righe con errori`, 'warning');
            }

        } catch (error) {
            console.error('Errore import classifica:', error);
            showNotification('Errore nell\'importazione: ' + error.message, 'error');
        }
    };

    reader.onerror = function () {
        showNotification('Errore nella lettura del file', 'error');
    };

    reader.readAsText(file);

    // Reset input
    event.target.value = '';
}


function handleClassificaImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const newClassifica = [];

            // Skip header
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const fields = line.split(',');
                if (fields.length < 2) continue;

                newClassifica.push({
                    nome: fields[0].trim(),
                    punti: parseInt(fields[1]) || 0
                });
            }

            if (newClassifica.length > 0) {
                classifica = newClassifica.sort((a, b) => b.punti - a.punti);
                renderClassifica();
                showNotification(`${newClassifica.length} squadre importate!`, 'success');
            }
        } catch (error) {
            showNotification('Errore nell\'importazione del file', 'error');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
document.head.appendChild(style);

// Gestione giocatori
let currentEditPlayer = null;

function loadPlayerForEdit() {
    const select = document.getElementById('editPlayerSelect');
    if (!select) return;

    const selectedName = select.value;
    const form = document.getElementById('editPlayerForm');
    if (!selectedName) {
        if (form) form.style.display = 'none';
        return;
    }
    const player = rosa.find(p => p.nome === selectedName);
    if (!player) return;
    if (form) form.style.display = 'block';

    // DEBUG: log valori caricati
    console.log('Player selezionato:', player);

    function setInput(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    }

    setInput('editNome', player.nome || '');
    setInput('editSquadra', player.squadra || '');
    setInput('editTitolarita', player.titolarita || '');

    const stats = player.stats || {};
    console.log('Stats:', stats); // DEBUG

    setInput('editGoals', stats.goals ?? 0);
    setInput('editAssist', stats.assist ?? 0);
    setInput('editMinuti', stats.minuti ?? 0);
    setInput('editCleanSheet', stats.cleanSheet ?? 0);
    setInput('editGolSubiti', stats.golSubiti ?? 0);
    setInput('editXgoals', (stats.xgoals ?? 0).toFixed(2));
    setInput('editXassist', (stats.xassist ?? 0).toFixed(2));
    setInput('editMediaVoto', (stats.mediaVoto ?? 0).toFixed(2));
    setInput('editMediaFantavoto', (stats.mediaFantavoto ?? 0).toFixed(2));
    setInput('editRigoriParati', stats.rigoriParati ?? 0);
    document.getElementById('editRigoriParati').value = player.stats?.rigoriParati || 0;

    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function savePlayerEdit() {
    if (!currentEditPlayer) return;

    // Aggiorna dati
    currentEditPlayer.squadra = document.getElementById('editSquadra').value;
    currentEditPlayer.titolarita = parseFloat(document.getElementById('editTitolarita').value);

    const stato = document.getElementById('editStato').value;
    currentEditPlayer.infortunato = stato === 'infortunato';
    currentEditPlayer.disponibile = stato === 'disponibile';

    // Aggiorna statistiche
    if (!currentEditPlayer.stats) currentEditPlayer.stats = {};
    currentEditPlayer.stats.goals = parseInt(document.getElementById('editGoals').value) || 0;
    currentEditPlayer.stats.assist = parseInt(document.getElementById('editAssist').value) || 0;
    currentEditPlayer.stats.minuti = parseInt(document.getElementById('editMinuti').value) || 0;
    currentEditPlayer.stats.mediaVoto = parseFloat(document.getElementById('editMediaVoto').value) || 0;
    currentEditPlayer.stats.mediaFantavoto = parseFloat(document.getElementById('editMediaFantavoto').value) || 0;
    // Dopo mediaFantavoto
    player.stats.cleanSheet = parseInt(document.getElementById('editCleanSheet').value) || 0;
    player.stats.golSubiti = parseInt(document.getElementById('editGolSubiti').value) || 0;
    player.stats.rigoriParati = parseInt(data["RigoriParati"]) || 0;
    player.stats.xgoals = parseFloat(document.getElementById('editXgoals').value) || 0;
    player.stats.xassist = parseFloat(document.getElementById('editXassist').value) || 0;


    // Aggiorna difficoltà
    const teamInfo = classifica.find(t => t.nome === currentEditPlayer.avversario);
    if (teamInfo) currentEditPlayer.difficolta = teamInfo.punti;

    // Salva
    salvaDati();
    renderDashboard();
    renderRosa();

    showNotification(`✓ ${currentEditPlayer.nome} aggiornato!`, 'success');
    cancelPlayerEdit();
}

function cancelPlayerEdit() {
    document.getElementById('editPlayerForm').style.display = 'none';
    document.getElementById('editPlayerSelect').value = '';
    currentEditPlayer = null;
}

// Popola select giocatori quando si apre gestione
function populatePlayerSelect() {
    const select = document.getElementById('editPlayerSelect');
    select.innerHTML = '<option value="">-- Seleziona --</option>' +
        rosa.map(p => `<option value="${p.nome}">${p.nome} (${ruoliMap[p.ruolo]})</option>`).join('');
}

// Editor classifica

function renderClassificaRows() {
    const tbody = document.getElementById('gestioneClassificaBody');
    if (!tbody) {
        console.error('❌ Tbody non trovato!');
        return;
    }

    tbody.innerHTML = '';

    classifica.forEach((team, index) => {
        const row = document.createElement('tr');
        row.draggable = true;
        row.className = 'classifica-row';
        row.dataset.index = index;
        row.dataset.team = team.nome;

        row.innerHTML = `
                <td>
                    <div style="display: flex; gap: 0.25rem;">
                        <button class="btn-icon" data-action="move-up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-up"></i>
                        </button>
                        <button class="btn-icon" data-action="move-down" data-index="${index}" ${index === classifica.length - 1 ? 'disabled' : ''}>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <i class="fas fa-grip-vertical drag-handle"></i>
                    <span class="position">${index + 1}</span>
                </td>
                <td class="team-name" style="font-weight: 600;">${team.nome}</td>
                <td>
                    <input type="number" 
                        class="team-points-input" 
                        value="${team.punti}" 
                        min="0" 
                        data-team-index="${index}" data-action="update-points"
                        style="width: 80px; padding: 0.5rem; border: 2px solid #e2e8f0; border-radius: 6px; text-align: center;">
                </td>
            `;

        tbody.appendChild(row);
    });

    enableClassificaDragDrop();
}

// Aggiungi le altre funzioni (moveTeamUp, moveTeamDown, updateTeamPoints, saveClassificaEdit, ecc.)
// che ti ho dato prima


function moveTeam(index, direction) {
    const canMove = (direction === 'up' && index > 0) ||
        (direction === 'down' && index < classifica.length - 1);

    if (!canMove) {
        // Effetto shake
        const row = document.getElementById(`team-${index}`);
        if (row) {
            row.style.animation = 'shake 0.5s ease';
            setTimeout(() => row.style.animation = '', 500);
        }
        showNotification('❌ Impossibile spostare ulteriormente!', 'warning');
        return;
    }
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === classifica.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const teamName = classifica[index].nome;

    // Elementi DOM
    const row1 = document.getElementById(`team-${index}`);
    const row2 = document.getElementById(`team-${targetIndex}`);

    if (!row1 || !row2) return;

    // Disabilita pulsanti
    document.querySelectorAll('.btn-arrow').forEach(btn => btn.disabled = true);

    // Calcola distanza movimento
    const moveDistance = direction === 'up' ? -row1.offsetHeight : row1.offsetHeight;

    // Animazione swap
    row1.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), background 0.3s ease';
    row1.style.transform = `translateY(${moveDistance}px)`;
    row1.style.background = 'linear-gradient(90deg, #dbeafe, #bfdbfe)';
    row1.style.zIndex = '10';

    row2.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), background 0.3s ease';
    row2.style.transform = `translateY(${-moveDistance}px)`;
    row2.style.background = 'linear-gradient(90deg, #fef3c7, #fde68a)';
    row2.style.zIndex = '5';

    // Dopo animazione
    setTimeout(() => {
        // Swap array
        [classifica[index], classifica[targetIndex]] = [classifica[targetIndex], classifica[index]];
        recalculatePoints();

        // Re-render
        renderClassificaEditor();

        // Highlight nuova posizione
        setTimeout(() => {
            const newRow = document.getElementById(`team-${targetIndex}`);
            if (newRow) {
                newRow.style.animation = 'highlightNew 1.5s ease';
                newRow.style.background = '#dbeafe';

                setTimeout(() => {
                    newRow.style.animation = '';
                    newRow.style.background = 'white';
                }, 1500);
            }

            // Riabilita pulsanti
            document.querySelectorAll('.btn-arrow').forEach(btn => btn.disabled = false);
        }, 50);

        // Notifica con emoji animata
        showNotification(`📊 ${teamName} ${direction === 'up' ? '⬆️' : '⬇️'} ${direction === 'up' ? 'salita' : 'scesa'} al ${targetIndex + 1}° posto!`, 'success');
    }, 500);
}


function recalculatePoints() {
    // Assegna punti in base alla posizione (1° = 20 punti, ultimo = 1 punto)
    classifica.forEach((team, index) => {
        team.punti = 20 - index;
    });
}
function saveClassificaEdit() {
    // Salva in localStorage
    localStorage.setItem('fantacalcio_classifica', JSON.stringify(classifica));

    // Aggiorna difficoltà per tutti i giocatori
    rosa.forEach(player => {
        player.difficolta = calcolaDifficolta(player.avversario);
    });

    // Salva rosa aggiornata
    salvaDati();

    // Aggiorna visualizzazioni
    renderClassifica();

    showNotification('✅ Classifica salvata! Ricalcola i punteggi per applicare le modifiche.', 'success');
}

function updateClassificaNome(index, nome) {
    classifica[index].nome = nome;
}

function updateClassificaPunti(index, punti) {
    classifica[index].punti = parseInt(punti);
}

function moveClassifica(index, direction) {
    if (index + direction < 0 || index + direction >= classifica.length) return;

    const temp = classifica[index];
    classifica[index] = classifica[index + direction];
    classifica[index + direction] = temp;

    renderClassificaEditor();
}

function saveClassificaEdit() {
    renderClassifica();

    // Aggiorna difficoltà per tutti i giocatori
    rosa.forEach(player => {
        const teamInfo = classifica.find(t => t.nome === player.avversario);
        if (teamInfo) player.difficolta = teamInfo.punti;
    });

    salvaDati();
    showNotification('✓ Classifica aggiornata!', 'success');
}

// Modifica showSection per inizializzare gestione
const originalShowSection = showSection;
showSection = function (sectionId) {
    originalShowSection(sectionId);

    if (sectionId === 'gestione') {
        populatePlayerSelect();
        renderClassificaEditor();
    }
};

// ============================================
// ORDINAMENTO ROSA
// ============================================

function sortRosaBy(field) {
    // Se clicco sullo stesso campo, inverto la direzione
    if (currentSortBy === field) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortBy = field;
        currentSortDirection = field === 'nome' || field === 'squadra' ? 'asc' : 'desc';
    }

    renderRosa();
}

function sortRosaBy(field) {
    // Se clicco sullo stesso campo, inverto la direzione
    if (currentSortBy === field) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortBy = field;
        currentSortDirection = field === 'nome' || field === 'squadra' ? 'asc' : 'desc';
    }

    renderRosa();
}

// Modifica la funzione renderRosa esistente
// Variabili per paginazione


function renderRosa() {
    const tbody = document.getElementById('rosaTableBody');
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationControls = document.getElementById('paginationControls');

    if (!tbody) {
        console.error('Elemento rosaTableBody non trovato!');
        return;
    }

    if (rosa.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 3rem;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                        <i class="fas fa-users" style="font-size: 3rem; color: var(--text-secondary);"></i>
                        <p style="color: var(--text-secondary); margin: 0;">Nessun giocatore nella rosa.</p>
                        <button class="btn btn-primary" data-action="import">
                            <i class="fas fa-file-import"></i> Importa Dati
                        </button>
                    </div>
                </td>
            </tr>
        `;
        const importBtn = tbody.querySelector('[data-action="import"]');
        if (importBtn) importBtn.addEventListener('click', () => showSection('import'));
        if (paginationInfo) paginationInfo.textContent = "";
        if (paginationControls) paginationControls.innerHTML = "";
        return;
    }

    // --- NORMALIZZAZIONE DATI ---
    // --- NORMALIZZAZIONE DATI ---
    const rosaOK = rosa.map(p => ({
        ...p,
        nome: p.nome || "Sconosciuto",
        ruolo: (typeof p.ruolo === "undefined" ? "D" : p.ruolo),
        squadra: p.squadra || "ND",
        titolarita: (typeof p.titolarita === "undefined" ? 0 : p.titolarita),
        punteggio: (typeof p.punteggio === "undefined" ? 0 : p.punteggio),
        // NON rimuovere difficolta qui, lascia che venga copiata come è
        // difficolta verrà sovrascritta dopo nel blocco rosaConAvversari
        avversario: p.avversario || "",
        infortunato: !!p.infortunato,
        disponibile: typeof p.disponibile === "undefined" ? true : !!p.disponibile,
        stats: p.stats || {}
    }));


    // --- CALCOLA AVVERSARI E DIFFICOLTÀ AUTOMATICAMENTE ---
    const rosaConAvversari = rosaOK.map(player => {
        const infoPartita = trovaProssimaPartita(player.squadra);

        let difficolta = 10; // default

        if (infoPartita.avversario !== "N/D") {
            const teamAvversario = classifica.find(t => t.nome === infoPartita.avversario);
            if (teamAvversario) {
                difficolta = teamAvversario.punti;
            }
        }

        return {
            ...player,
            avversario: infoPartita.avversario,
            prossima_giornata: infoPartita.giornata,
            data_partita: infoPartita.data,
            difficolta: difficolta  // Ora questo valore non viene più sovrascritto
        };
    });



    // --- ORDINAMENTO ---
    const sortedRosa = [...rosaConAvversari].sort((a, b) => {
        let valueA, valueB;
        switch (currentSortBy) {
            case 'punteggio': valueA = a.punteggio || 0; valueB = b.punteggio || 0; break;
            case 'ruolo':
                if (a.ruolo !== b.ruolo) return a.ruolo > b.ruolo ? 1 : -1;
                valueA = (a.nome || '').toLowerCase();
                valueB = (b.nome || '').toLowerCase();
                break;
            case 'nome':
                if ((a.nome || '').toLowerCase() !== (b.nome || '').toLowerCase()) {
                    valueA = (a.nome || '').toLowerCase();
                    valueB = (b.nome || '').toLowerCase();
                } else {
                    valueA = a.ruolo;
                    valueB = b.ruolo;
                }
                break;
            case 'squadra': valueA = (a.squadra || '').toLowerCase(); valueB = (b.squadra || '').toLowerCase(); break;
            case 'titolarita': valueA = a.titolarita || 0; valueB = b.titolarita || 0; break;
            default: valueA = a.punteggio || 0; valueB = b.punteggio || 0;
        }
        return currentSortDirection === 'asc'
            ? (valueA > valueB ? 1 : -1)
            : (valueA < valueB ? 1 : -1);
    });

    // --- PAGINAZIONE ---
    const itemsPerPage = 25;
    const totalPages = Math.ceil(sortedRosa.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRosa = sortedRosa.slice(startIndex, startIndex + itemsPerPage);

    // --- GENERAZIONE HTML ---
    // --- GENERAZIONE HTML ---
    const html = paginatedRosa.map((player, index) => {
        const ruolo = normalizzaRuolo(player.ruolo);
        const difficoltaClass = player.difficolta >= 15 ? 'difficolta-alta' : player.difficolta >= 10 ? 'difficolta-media' : 'difficolta-bassa';

        return `
    <tr data-player="${player.nome}" style="cursor: pointer; transition: all 0.2s;">
        <td style="font-weight: 600; color: var(--primary-color);">
            <i class="fas fa-user-circle" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
            ${player.nome}
        </td>
        <td>
            <span class="badge badge-${ruolo.toLowerCase()}" style="padding: 0.5rem 1rem; font-size: 0.9rem; border-radius: 20px;">
                ${ruolo}
            </span>
        </td>
        <td style="font-weight: 500;">
            <i class="fas fa-shield-alt" style="margin-right: 0.5rem; color: var(--text-secondary);"></i>
            ${player.squadra}
        </td>
        <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-star" style="color: #fbbf24;"></i>
                <strong style="font-size: 1.1rem; color: var(--primary-color);">${(player.punteggio || 0).toFixed(2)}</strong>
            </div>
        </td>
        <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 60px; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${player.titolarita || 0}%; height: 100%; background: linear-gradient(90deg, var(--success-color), #10b981); transition: width 0.3s;"></div>
                </div>
                <span style="font-weight: 600;">${player.titolarita || 0}%</span>
            </div>
        </td>
        <td style="font-weight: 500;">
            <i class="fas fa-crosshairs" style="margin-right: 0.5rem; color: var(--danger-color);"></i>
            ${player.avversario || 'N/D'}
        </td>
        <td>
            <span class="${difficoltaClass}" style="padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; display: inline-block;">
                <i class="fas fa-chart-line" style="margin-right: 0.3rem;"></i>
                ${player.difficolta || 10}/20
            </span>
        </td>
        <td>
            ${player.infortunato ?
                '<span class="badge badge-danger" style="padding: 0.5rem 1rem;"><i class="fas fa-ambulance"></i> Infortunato</span>' :
                player.disponibile ?
                    '<span class="badge badge-success" style="padding: 0.5rem 1rem;"><i class="fas fa-check-circle"></i> Disponibile</span>' :
                    '<span class="badge badge-warning" style="padding: 0.5rem 1rem;"><i class="fas fa-ban"></i> Non disponibile</span>'}
        </td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="showPlayerDetails('${player.nome}')" style="padding: 0.5rem 1rem; border-radius: 8px;">
                <i class="fas fa-eye"></i> Dettagli
            </button>
        </td>
    </tr>
    `;
    }).join('');



    tbody.innerHTML = html;

    // --- CONTROLLO ESISTENZA ELEMENTI PAGINAZIONE ---
    if (paginationInfo) {
        paginationInfo.textContent = `Pagina ${currentPage} di ${totalPages} | Giocatori totali: ${sortedRosa.length}`;
    }

    if (paginationControls) {
        paginationControls.innerHTML = `
        <button class="btn btn-sm" onclick="changePage(${currentPage - 1})" 
        ${currentPage === 1 ? 'disabled' : ''}>←</button>
        <button class="btn btn-sm" onclick="changePage(${currentPage + 1})" 
        ${currentPage === totalPages ? 'disabled' : ''}>→</button>
    `;
    }

    updateSortButtons();

} // <-- AGGIUNGI QUESTA PARENTESI GRAFFA QUI PER CHIUDERE LA FUNZIONE renderRosa()

document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', function () {
        let sortKey = this.getAttribute('data-sort');
        if (currentSortBy === sortKey) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortBy = sortKey;
            currentSortDirection = (sortKey === 'nome' || sortKey === 'squadra') ? 'asc' : 'desc';
        }
        renderRosa();
    });
});


function renderPagination(totalPages) {
    const info = document.getElementById('paginationInfo');
    const controls = document.getElementById('paginationControls');

    if (!info || !controls) return;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredRosa.length);

    info.textContent = `Mostrando ${startItem}-${endItem} di ${filteredRosa.length} giocatori`;

    // Genera pulsanti paginazione
    let html = '';

    // Pulsante precedente
    html += `<button class="pagination-btn" data-action="page" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>`;

    // Pulsanti numerici
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages <= 5 || i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-action="page" data-page="${i}">
                        ${i}
                    </button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span style="padding: 0 0.5rem;">...</span>`;
        }
    }

    // Pulsante successivo
    html += `<button class="pagination-btn" data-action="page" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>`;

    controls.innerHTML = html;
}

// Aggiorna filterRosa per usare la paginazione
function filterRosa(searchTerm) {
    if (!searchTerm) {
        currentPage = 1;
        renderRosa();
        return;
    }

    // Filtra rosa
    filteredRosa = rosa.filter(player =>
        player.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.squadra.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Applica filtro ruolo se attivo
    if (currentRoleFilter !== 'all') {
        filteredRosa = filteredRosa.filter(p => p.ruolo === parseInt(currentRoleFilter));
    }

    // Ordina
    filteredRosa.sort((a, b) => {
        let valueA, valueB;

        switch (currentSortBy) {
            case 'punteggio':
                valueA = a.punteggio || 0;
                valueB = b.punteggio || 0;
                break;
            case 'ruolo':
                if (a.ruolo === b.ruolo) {
                    return (b.punteggio || 0) - (a.punteggio || 0);
                }
                valueA = a.ruolo;
                valueB = b.ruolo;
                break;
            case 'nome':
                valueA = (a.nome || '').toLowerCase();
                valueB = (b.nome || '').toLowerCase();
                break;
            default:
                valueA = a.punteggio || 0;
                valueB = b.punteggio || 0;
        }

        if (currentSortDirection === 'asc') {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
    });

    currentPage = 1;

    // Renderizza
    const tbody = document.getElementById('rosaTableBody');
    const totalPages = Math.ceil(filteredRosa.length / itemsPerPage);
    const startIndex = 0;
    const endIndex = itemsPerPage;
    const paginatedRosa = filteredRosa.slice(startIndex, endIndex);

    if (filteredRosa.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 2rem;">
                            <i class="fas fa-search" style="font-size: 2rem; color: var(--text-secondary);"></i>
                            <p style="color: var(--text-secondary); margin: 0.5rem 0 0;">Nessun giocatore trovato per "${searchTerm}"</p>
                        </td>
                    </tr>
                `;
        document.getElementById('paginationInfo').textContent = '';
        document.getElementById('paginationControls').innerHTML = '';
        return;
    }

    const html = paginatedRosa.map((player, index) => `
                <tr data-player="${player.nome}">
                    <td style="color: var(--text-secondary); font-weight: 600;">#${index + 1}</td>
                    <td><strong style="font-size: 1.05rem;">${player.nome}</strong></td>
                    <td><span class="badge ${getBadgeClass(player.ruolo)}">${ruoliMap[player.ruolo]}</span></td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-shield-alt" style="color: #3b82f6; font-size: 0.9rem;"></i>
                            <span>${player.squadra}</span>
                        </div>
                    </td>
                    <td><span class="score-highlight">${(player.punteggio || 0).toFixed(2)}</span></td>
                    <td>
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div class="progress-bar-fill" style="width: ${player.titolarita}%; background: linear-gradient(90deg, #10b981, #059669);"></div>
                            </div>
                            <span style="font-size: 0.9rem; font-weight: 600;">${player.titolarita}%</span>
                        </div>
                    </td>
                    <td>
                        ${player.infortunato ?
            '<span class="badge badge-danger"><i class="fas fa-heartbeat"></i></span>' :
            player.disponibile ?
                '<span class="badge badge-success"><i class="fas fa-check"></i></span>' :
                '<span class="badge badge-warning"><i class="fas fa-times"></i></span>'}
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm" 
                                data-player="${player.nome}" data-stop-propagation="true">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

    tbody.innerHTML = html;
    renderPagination(totalPages);
    updateSortButtons();
}





function updateSortButtons() {
    document.querySelectorAll('#rosa .btn-primary').forEach(btn => {
        btn.style.background = 'var(--primary-color)';
        btn.style.fontWeight = 'normal';
        // Rimuove eventuale icona precedente
        const oldIcon = btn.querySelector('i[data-sort-icon]');
        if (oldIcon) oldIcon.remove();
    });

    // Cerca il pulsante col sort attivo
    const activeBtn = document.querySelector('#rosa .btn-primary[data-sort="' + currentSortBy + '"]');
    if (activeBtn) {
        activeBtn.style.background = 'var(--success-color)';
        activeBtn.style.fontWeight = '700';

        // Aggiungi indicatore direzione
        const icon = document.createElement('i');
        icon.setAttribute('data-sort-icon', 'true');
        icon.style.marginLeft = '6px';
        icon.className = currentSortDirection === 'asc'
            ? 'fas fa-sort-amount-up'
            : 'fas fa-sort-amount-down';
        activeBtn.appendChild(icon);
    }
}


// ============================================
// EXPORT MODIFICHE PER DATABASE C
// ============================================

function esportaModifiche() {
    // Crea JSON con formato compatibile col programma C
    const exportData = {
        players: rosa.map(p => ({
            nome: p.nome,
            ruolo: p.ruolo,
            squadra: p.squadra,
            punteggio: parseFloat(p.punteggio.toFixed(2)),
            titolarita: p.titolarita,
            avversario: p.avversario,
            difficolta: p.difficolta,
            infortunato: p.infortunato,
            disponibile: p.disponibile,
            stats: p.stats || {
                goals: 0,
                assist: 0,
                minuti: 0,
                cleanSheet: 0,
                golSubiti: 0,
                rigoriParati: 0,
                xgoals: 0,
                xassist: 0,
                mediaVoto: 0,
                mediaFantavoto: 0
            }
        }))
    };

    // Converti in JSON formattato
    const jsonString = JSON.stringify(exportData, null, 2);

    // Crea blob e download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rosa.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('✓ File esportato! Ora caricalo nel programma C', 'success');
}

// Filtro ricerca giocatore nella gestione
function filterPlayerSelect(searchTerm) {
    const select = document.getElementById('editPlayerSelect');
    const options = Array.from(select.options).slice(1); // Escludi la prima opzione

    options.forEach(option => {
        const playerName = option.textContent.toLowerCase();
        if (playerName.includes(searchTerm.toLowerCase())) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
}

// Stile per radio button stato


// Carica giocatore per modifica



// Salva modifiche giocatore
function savePlayerEdit() {
    const nome = document.getElementById('editNome').value;
    const player = rosa.find(p => p.nome === nome);

    if (!player) return;

    // Aggiorna dati base
    player.squadra = document.getElementById('editSquadra').value;
    player.titolarita = parseFloat(document.getElementById('editTitolarita').value);

    // Aggiorna stato
    const stato = document.querySelector('input[name="editStato"]:checked').value;
    player.infortunato = (stato === 'infortunato');
    player.disponibile = (stato === 'disponibile');

    // Aggiorna TUTTE le statistiche
    if (!player.stats) player.stats = {};
    player.stats.goals = parseInt(document.getElementById('editGoals').value) || 0;
    player.stats.assist = parseInt(document.getElementById('editAssist').value) || 0;
    player.stats.minuti = parseInt(document.getElementById('editMinuti').value) || 0;
    player.stats.cleanSheet = parseInt(document.getElementById('editCleanSheet').value) || 0;
    player.stats.golSubiti = parseInt(document.getElementById('editGolSubiti').value) || 0;
    player.stats.xgoals = parseFloat(document.getElementById('editXgoals').value) || 0;
    player.stats.xassist = parseFloat(document.getElementById('editXassist').value) || 0;
    player.stats.mediaVoto = parseFloat(document.getElementById('editMediaVoto').value) || 0;
    player.stats.mediaFantavoto = parseFloat(document.getElementById('editMediaFantavoto').value) || 0;

    // Aggiorna difficoltà avversario
    const teamAvversario = classifica.find(t => t.nome === player.avversario);
    if (teamAvversario) {
        player.difficolta = 20 - teamAvversario.punti;
    }

    // Salva in localStorage
    salvaDati();

    // Aggiorna visualizzazioni
    renderRosa();
    renderDashboard();
    renderFormazione();

    showNotification(`✓ ${nome} aggiornato con successo!`, 'success');

    // Nascondi form
    cancelPlayerEdit();
}

// Annulla modifica
function cancelPlayerEdit() {
    document.getElementById('editPlayerSelect').value = '';
    document.getElementById('searchPlayerEdit').value = '';
    document.getElementById('editPlayerForm').style.display = 'none';
}

// Renderizza editor classifica
function renderClassificaEditor() {
    const container = document.getElementById('classificaEditor');

    if (!container) {
        console.error('❌ Container classificaEditor non trovato!');
        return;
    }

    if (!classifica || classifica.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nessuna classifica disponibile</p>';
        return;
    }

    let html = `
            <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: linear-gradient(135deg, var(--warning-color), #d97706); color: white;">
                            <th style="padding: 1rem; text-align: center; width: 60px;">#</th>
                            <th style="padding: 1rem; text-align: left;">Squadra</th>
                            <th style="padding: 1rem; text-align: center; width: 120px;">Azioni</th>
                        </tr>
                    </thead>
                    <tbody id="classificaEditorBody">
        `;

    classifica.forEach((team, index) => {
        const isFirst = index === 0;
        const isLast = index === classifica.length - 1;

        html += `
                <tr id="team-${index}" 
                    draggable="true"
                    style="border-bottom: 1px solid #e5e7eb; transition: all 0.2s; cursor: move;" 
                    onmouseover="this.style.background='#f9fafb'" 
                    onmouseout="this.style.background='white'">
                    <td style="padding: 1rem; text-align: center; font-weight: 700; font-size: 1.1rem; color: var(--primary-color);">
                        ${index + 1}
                    </td>
                    <td style="padding: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 30px; height: 30px; background: linear-gradient(135deg, var(--primary-color), #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.9rem;">
                                ${team.nome[0]}
                            </div>
                            <span style="font-weight: 600; font-size: 1rem;">${team.nome}</span>
                            <span style="color: var(--text-secondary); font-size: 0.85rem; margin-left: auto;">${team.punti} pt</span>
                        </div>
                    </td>
                    <td style="padding: 1rem; text-align: center;">
                        <div style="display: flex; gap: 0.5rem; justify-content: center;">
                            <button class="btn-arrow" 
                                        data-action="move-up" data-index="${index}" 
                                    ${isFirst ? 'disabled' : ''}
                                    style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; ${isFirst ? 'background: #e5e7eb; color: #9ca3af; cursor: not-allowed;' : 'background: var(--success-color); color: white;'}"
                                    title="Sposta su">
                                <i class="fas fa-arrow-up" style="font-size: 1.2rem;"></i>
                            </button>
                            <button class="btn-arrow" 
                                    data-action="move-down" data-index="${index}" 
                                    ${isLast ? 'disabled' : ''}
                                    style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; ${isLast ? 'background: #e5e7eb; color: #9ca3af; cursor: not-allowed;' : 'background: var(--danger-color); color: white;'}"
                                    title="Sposta giù">
                                <i class="fas fa-arrow-down" style="font-size: 1.2rem;"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
    });

    html += `
                    </tbody>
                </table>
            </div>
            
            <div style="margin-top: 1.5rem; padding: 1.5rem; background: #fef3c7; border-radius: 8px; border-left: 4px solid var(--warning-color);">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas fa-info-circle" style="color: var(--warning-color); font-size: 1.5rem;"></i>
                    <div>
                        <p style="margin: 0; font-weight: 600; margin-bottom: 0.25rem;">Gestione Classifica</p>
                        <p style="margin: 0; font-size: 0.9rem;">Usa le frecce <i class="fas fa-arrow-up" style="color: var(--success-color);"></i> <i class="fas fa-arrow-down" style="color: var(--danger-color);"></i> per riordinare le squadre oppure trascina le righe.</p>
                    </div>
                </div>
            </div>
        `;

    container.innerHTML = html;

    // Abilita drag & drop dopo che il DOM si è aggiornato
    setTimeout(() => {
        const tbody = document.getElementById('classificaEditorBody');
        if (!tbody) return;

        const rows = tbody.querySelectorAll('tr');

        // FORZA draggable su tutte le righe
        rows.forEach(row => {
            row.draggable = true;
        });

        enableClassificaDragDropInEditor();
        console.log('✅ Drag & drop abilitato con', rows.length, 'righe');
    }, 100);
}



// Salva modifiche classifica
function saveClassificaEdit() {
    classifica.forEach((team, index) => {
        const input = document.getElementById(`team_${index}_punti`);
        if (input) {
            team.punti = parseInt(input.value) || 0;
        }
    });

    // Riordina per punti
    classifica.sort((a, b) => b.punti - a.punti);

    // Aggiorna difficoltà avversari per tutti i giocatori
    rosa.forEach(player => {
        const teamAvversario = classifica.find(t => t.nome === player.avversario);
        if (teamAvversario) {
            player.difficolta = 20 - teamAvversario.punti;
        }
    });

    salvaDati();
    renderClassifica();
    renderClassificaEditor();
    showNotification('✓ Classifica aggiornata!', 'success');
}

// Inizializza select giocatori nella gestione
function initGestioneSection() {
    const select = document.getElementById('editPlayerSelect');
    select.innerHTML = '<option value="">-- Seleziona giocatore --</option>' +
        rosa.map(p => `<option value="${p.nome}">${p.nome} (${ruoliMap[p.ruolo]})</option>`).join('');

    renderClassificaEditor();
}

// Chiama al caricamento

// ============================================
// TOP GIOCATORI PER RUOLO
// ============================================

function renderTopGiocatori() {
    const section = document.getElementById('topGiocatori');

    if (!section) {
        console.error('❌ Sezione topGiocatori non trovata!');
        return;
    }

    if (!rosa || rosa.length === 0) {
        section.innerHTML = `
                    <h1>Top Giocatori per Ruolo</h1>
                    <div class="card">
                        <div class="card-body" style="text-align: center; padding: 3rem;">
                            <i class="fas fa-users" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                            <p style="color: var(--text-secondary);">Nessun giocatore disponibile</p>
                        </div>
                    </div>
                `;
        return;
    }

    console.log('📊 Rendering top giocatori per ruolo...');

    // Dividi per ruolo e prendi i top
    const portieri = rosa.filter(p => p.ruolo === 0)
        .sort((a, b) => (b.punteggio || 0) - (a.punteggio || 0))
        .slice(0, 3);

    const difensori = rosa.filter(p => p.ruolo === 1)
        .sort((a, b) => (b.punteggio || 0) - (a.punteggio || 0))
        .slice(0, 8);

    const centrocampisti = rosa.filter(p => p.ruolo === 2)
        .sort((a, b) => (b.punteggio || 0) - (a.punteggio || 0))
        .slice(0, 8);

    const attaccanti = rosa.filter(p => p.ruolo === 3)
        .sort((a, b) => (b.punteggio || 0) - (a.punteggio || 0))
        .slice(0, 6);

    console.log(`✓ P:${portieri.length} D:${difensori.length} C:${centrocampisti.length} A:${attaccanti.length}`);

    // Inizio HTML
    let html = '<h1><i class="fas fa-star"></i> Top Giocatori per Ruolo</h1>';

    // Template per ogni ruolo
    const renderRuolo = (giocatori, nomeRuolo, icon, color) => {
        if (giocatori.length === 0) return '';

        return `
                    <div class="card" style="margin-bottom: 2rem;">
                        <div class="card-header" style="background: linear-gradient(135deg, ${color}, ${color}dd); color: white;">
                            <h2 style="margin: 0; font-size: 1.5rem;">
                                <i class="${icon}"></i> ${nomeRuolo}
                            </h2>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                                ${giocatori.map((player, index) => `
                                    <div class="player-card-role" style="position: relative; padding: 1.5rem; background: linear-gradient(135deg, #f8fafc, white); border-radius: 12px; border: 2px solid #e5e7eb; transition: all 0.3s; cursor: pointer;" 
                                        data-player="${player.nome}" 
                                        onmouseover="this.style.borderColor='${color}'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.15)';" 
                                        onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                                        
                                        <!-- Badge posizione -->
                                        <div style="position: absolute; top: -10px; left: -10px; width: 40px; height: 40px; background: ${color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                                            ${index + 1}
                                        </div>
                                        
                                        <!-- Info giocatore -->
                                        <div style="margin-top: 0.5rem;">
                                            <h3 style="margin: 0 0 0.5rem; font-size: 1.3rem; color: #111827;">${player.nome}</h3>
                                            
                                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                                                <i class="fas fa-shield-alt"></i>
                                                <span>${player.squadra}</span>
                                                ${player.infortunato ? '<span class="badge badge-danger" style="margin-left: 0.5rem;"><i class="fas fa-ambulance"></i></span>' : ''}
                                            </div>
                                            
                                            <!-- Punteggio -->
                                            <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                                    <span style="color: var(--text-secondary); font-weight: 600;">Punteggio</span>
                                                    <span style="font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, ${color}, ${color}dd); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                                        ${(player.punteggio || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <!-- Statistiche -->
                                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem;">
                                                <div style="background: #f3f4f6; padding: 0.5rem; border-radius: 6px;">
                                                    <span style="color: var(--text-secondary); display: block; font-size: 0.75rem; margin-bottom: 0.25rem;">Titolarità</span>
                                                    <strong style="font-size: 1.1rem; color: ${color};">${player.titolarita}%</strong>
                                                </div>
                                                <div style="background: #f3f4f6; padding: 0.5rem; border-radius: 6px;">
                                                    <span style="color: var(--text-secondary); display: block; font-size: 0.75rem; margin-bottom: 0.25rem;">Avversario</span>
                                                    <strong style="font-size: 0.95rem;">${player.avversario}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
    };

    // Render ogni ruolo
    html += renderRuolo(portieri, 'Portieri', 'fas fa-hands', '#3b82f6');
    html += renderRuolo(difensori, 'Difensori', 'fas fa-shield-alt', '#10b981');
    html += renderRuolo(centrocampisti, 'Centrocampisti', 'fas fa-running', '#f59e0b');
    html += renderRuolo(attaccanti, 'Attaccanti', 'fas fa-futbol', '#ef4444');

    section.innerHTML = html;

    console.log('✅ Top giocatori renderizzati');
}
// ============================================
// MOBILE SIDEBAR TOGGLE
// ============================================


// ============================================
// WIZARD SETUP PRIMO ACCESSO
// ============================================

const DEFAULT_CLASSIFICA = [
    { nome: "Milan", punti: 20 },
    { nome: "Napoli", punti: 19 },
    { nome: "Inter", punti: 18 },
    { nome: "Roma", punti: 17 },
    { nome: "Juventus", punti: 16 },
    { nome: "Atalanta", punti: 15 },
    { nome: "Bologna", punti: 14 },
    { nome: "Lazio", punti: 13 },
    { nome: "Como", punti: 12 },
    { nome: "Fiorentina", punti: 11 },
    { nome: "Torino", punti: 10 },
    { nome: "Udinese", punti: 9 },
    { nome: "Genoa", punti: 8 },
    { nome: "Cagliari", punti: 7 },
    { nome: "Parma", punti: 6 },
    { nome: "Sassuolo", punti: 5 },
    { nome: "Lecce", punti: 4 },
    { nome: "Cremonese", punti: 3 },
    { nome: "Verona", punti: 2 },
    { nome: "Pisa", punti: 1 }
];

function loadGestioneEditor() {
    console.log('📝 Caricamento editor gestione...');

    // Verifica che classifica esista
    if (!classifica || classifica.length === 0) {
        console.error('❌ Classifica non caricata!');
        showNotification('❌ Classifica non disponibile', 'error');
        return;
    }

    // Carica select giocatori
    populatePlayerSelect();

    // Rendering classifica con delay per sicurezza
    setTimeout(() => {
        console.log('🔄 Rendering classifica editor...');
        const container = document.getElementById('classificaEditor');

        if (!container) {
            console.error('❌ Container classificaEditor non trovato nell\'HTML!');
            return;
        }

        renderClassificaEditor();
        console.log('✅ Classifica editor renderizzato');
    }, 50);
}



function populatePlayerSelect() {
    const select = document.getElementById('editPlayerSelect');
    if (!select || !rosa) return;

    select.innerHTML = '<option value="">-- Seleziona giocatore --</option>';

    rosa.forEach(player => {
        const option = document.createElement('option');
        option.value = player.nome;
        option.textContent = `${player.nome} (${getRuoloName(player.ruolo)}) - ${player.squadra}`;
        select.appendChild(option);
    });
}

function getRuoloName(ruolo) {
    const nomi = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
    return nomi[ruolo] || 'Sconosciuto';
}
// ============================================
// WIZARD SETUP CON FORM MANUALE
// ============================================

function checkFirstTime() {
    const wizardCompleted = localStorage.getItem('wizardCompleted');
    const hasRosa = localStorage.getItem('fantacalciorosa');

    // Se wizard completato E ci sono dati rosa, NON è il primo accesso
    if (wizardCompleted === 'true' && hasRosa) {
        console.log('✅ Wizard già completato e dati presenti');
        return false; // NON mostrare wizard
    }

    // Altrimenti è primo accesso
    console.log('👋 Primo accesso rilevato');
    return true;
}


function showSetupWizard() {
    const wizardHTML = `
                <div id="setupWizard" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; overflow-y: auto; padding: 2rem;">
                    <div style="background: white; padding: 3rem; border-radius: 16px; max-width: 900px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.5); max-height: 90vh; overflow-y: auto;">
                        
                        <!-- Step 1: Benvenuto -->
                        <div id="wizardStep1" class="wizard-step">
                            <div style="text-align: center; margin-bottom: 2rem;">
                                <i class="fas fa-futbol" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                                <h1 style="color: var(--primary-color); margin-bottom: 1rem;">Benvenuto!</h1>
                                <p style="font-size: 1.2rem; color: var(--text-secondary);">Crea la tua rosa per iniziare</p>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #e0f2fe, #dbeafe); padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
                                <h3 style="margin-bottom: 1rem;"><i class="fas fa-info-circle"></i> Inizia da zero</h3>
                                <p style="margin-bottom: 1rem;">Importa i tuoi giocatori per gestire la tua squadra.</p>
                            </div>
                            
                            <button class="btn btn-primary" data-action="wizard-step" data-step="2" style="width: 100%; padding: 1.25rem; font-size: 1.1rem;">
                                <i class="fas fa-arrow-right"></i> Inizia Setup
                            </button>
                        </div>
                        
                        <!-- Step 2: Scelta metodo -->
                        <div id="wizardStep2" class="wizard-step" style="display: none;">
                            <h2 style="color: var(--primary-color); margin-bottom: 1.5rem;">
                                <i class="fas fa-users"></i> Come vuoi creare la rosa?
                            </h2>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0;">
                                <div data-action="import-method" data-method="csv" class="method-card" style="cursor: pointer; padding: 2rem; border: 3px solid #e5e7eb; border-radius: 12px; text-align: center; transition: all 0.3s;">
                                    <i class="fas fa-file-csv" style="font-size: 3rem; color: var(--success-color); margin-bottom: 1rem;"></i>
                                    <h3 style="margin-bottom: 0.5rem;">Importa CSV</h3>
                                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Carica file con tutti i dati</p>
                                </div>
                                
                                <div data-action="import-method" data-method="manual" class="method-card" style="cursor: pointer; padding: 2rem; border: 3px solid #e5e7eb; border-radius: 12px; text-align: center; transition: all 0.3s;">
                                    <i class="fas fa-plus-circle" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                                    <h3 style="margin-bottom: 0.5rem;">Aggiungi Manualmente</h3>
                                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Inserisci giocatori uno per uno</p>
                                </div>
                            </div>
                            
                            <button class="btn" data-action="wizard-step" data-step="1" style="width: 100%; margin-top: 1rem;">
                                <i class="fas fa-arrow-left"></i> Indietro
                            </button>
                        </div>
                        
                        <!-- Step 3: CSV Import -->
                        <div id="wizardStep3" class="wizard-step" style="display: none;">
                            <h2 style="color: var(--primary-color); margin-bottom: 1rem;">
                                <i class="fas fa-file-csv"></i> Importa da CSV
                            </h2>
                            
                            <div style="background: #fef3c7; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                                <h4 style="margin-bottom: 0.5rem;"><i class="fas fa-info-circle"></i> Formato CSV:</h4>
                                <code style="display: block; background: white; padding: 1rem; border-radius: 8px; font-size: 0.8rem; overflow-x: auto;">
        Nome;Squadra;Ruolo;Goals;Assist;Minuti;CleanSheet;GolSubiti;xGoals;xAssist;MediaVoto;MediaFantavoto;Titolarita;Infortunato;Avversario
                                </code>
                            </div>
                            
                            <div class="file-upload" style="margin: 2rem 0;">
                                <input type="file" id="wizardStatsCSV" accept=".csv" hidden>
                                <label for="wizardStatsCSV" style="cursor: pointer; display: block; padding: 3rem; border: 3px dashed var(--success-color); border-radius: 12px; text-align: center;">
                                    <i class="fas fa-cloud-upload-alt" style="font-size: 4rem; color: var(--success-color); display: block; margin-bottom: 1rem;"></i>
                                    <span style="font-weight: 700; font-size: 1.1rem;">Clicca per caricare CSV</span>
                                </label>
                            </div>
                            
                            <div style="display: flex; gap: 1rem;">
                                <button class="btn" data-action="wizard-step" data-step="2" style="flex: 1;">Indietro</button>
                                <button class="btn btn-success" id="wizardFinishCSV" disabled data-action="finish-wizard" style="flex: 2;">Completa</button>
                            </div>
                        </div>
                        
                        <!-- Step 4: Form Manuale -->
                        <div id="wizardStep4" class="wizard-step" style="display: none;">
                            <h2 style="color: var(--primary-color); margin-bottom: 1rem;">
                                <i class="fas fa-plus-circle"></i> Aggiungi Giocatore
                            </h2>
                            
                            <div id="manualPlayersList" style="background: #f9fafb; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; max-height: 200px; overflow-y: auto;">
                                <p style="text-align: center; color: var(--text-secondary);" id="emptyPlayersMsg">Nessun giocatore aggiunto</p>
                                <div id="addedPlayersList"></div>
                            </div>
                            
                            <form id="addPlayerForm" style="background: #fff; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--primary-color); margin-bottom: 1rem;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div>
                                        <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Nome *</label>
                                        <input type="text" id="playerNome" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;">
                                    </div>
                                    <div>
                                        <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Squadra *</label>
                                        <select id="playerSquadra" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;">
                                            ${DEFAULT_CLASSIFICA.map(t => `<option value="${t.nome}">${t.nome}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div>
                                        <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Ruolo *</label>
                                        <select id="playerRuolo" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;">
                                            <option value="0">Portiere</option>
                                            <option value="1">Difensore</option>
                                            <option value="2">Centrocampista</option>
                                            <option value="3">Attaccante</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Titolarità %</label>
                                        <input type="number" id="playerTitolarita" value="87.5" min="0" max="100" step="12.5" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;">
                                    </div>
                                </div>
                                
                                <h4 style="margin: 1.5rem 0 1rem 0; color: var(--primary-color);">Statistiche Complete</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            <!-- Riga 1 -->
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">Goals</label>
                <input type="number" id="playerGoals" value="0" min="0" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
            </div>
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">Assist</label>
                <input type="number" id="playerAssist" value="0" min="0" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
            </div>
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">Minuti</label>
                <input type="number" id="playerMinuti" value="0" min="0" step="90" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
            </div>
            
            <!-- Riga 2 -->
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">xGoals</label>
                <input type="number" id="playerXGoals" value="0" min="0" step="0.1" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
            </div>
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">xAssist</label>
                <input type="number" id="playerXAssist" value="0" min="0" step="0.1" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
            </div>
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">Media Voto</label>
                <input type="number" id="playerMediaVoto" value="6.0" min="0" max="10" step="0.1" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
            </div>
            
            <!-- Riga 3 -->
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">Media Fantavoto</label>
                <input type="number" id="playerMediaFV" value="6.0" min="0" max="10" step="0.1" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
            </div>
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">Clean Sheet</label>
                <input type="number" id="playerCS" value="0" min="0" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
            </div>
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">Gol Subiti</label>
                <input type="number" id="playerGolSubiti" value="0" min="0" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
            </div>
            
            <!-- Riga 4 (Altri) -->
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">Avversario</label>
                <select id="playerAvversario" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
                    ${DEFAULT_CLASSIFICA.map(t => `<option value="${t.nome}">${t.nome}</option>`).join('')}
                </select>
            </div>
            <div>
                <label style="font-weight: 600; font-size: 0.9rem;">Infortunato</label>
                <select id="playerInfortunato" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px;">
                    <option value="false">No</option>
                    <option value="true">Sì</option>
                </select>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; padding-top: 1.5rem;">
                <label style="font-size: 0.85rem; color: var(--text-secondary); text-align: center;">
                    <i class="fas fa-info-circle"></i> 9 campi statistici
                </label>
            </div>
        </div>

                                
                                <button type="button" data-action="add-player-manual" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; padding: 1rem;">
                                    <i class="fas fa-plus"></i> Aggiungi Giocatore
                                </button>
                            </form>
                            
                            <div style="display: flex; gap: 1rem;">
                                <button class="btn" data-action="wizard-step" data-step="2" style="flex: 1;">Indietro</button>
                                <button class="btn btn-success" id="wizardFinishManual" data-action="finish-wizard-manual" style="flex: 2;" disabled>
                                    <i class="fas fa-check"></i> Completa e Scarica
                                </button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            `;

    document.body.insertAdjacentHTML('beforeend', wizardHTML);
}

function selectImportMethod(method) {
    if (method === 'csv') {
        showWizardStep(3);
    } else if (method === 'manual') {
        showWizardStep(4);
    }
}

function showWizardStep(step) {
    document.querySelectorAll('.wizard-step').forEach(s => s.style.display = 'none');
    const stepEl = document.getElementById(`wizardStep${step}`);
    if (stepEl) stepEl.style.display = 'block';
}

// Array temporaneo per wizard
let tempRosa = [];

function addPlayerManual() {
    const nome = document.getElementById('playerNome').value.trim();
    const squadra = document.getElementById('playerSquadra').value;
    const ruolo = parseInt(document.getElementById('playerRuolo').value);
    const titolarita = parseFloat(document.getElementById('playerTitolarita').value) || 87.5;
    const avversario = document.getElementById('playerAvversario').value;
    const infortunato = document.getElementById('playerInfortunato').value === 'true';

    if (!nome) {
        showNotification('❌ Inserisci il nome!', 'error');
        return;
    }

    // ⚠️ CONTROLLO VALORI CON FALLBACK
    const player = {
        nome,
        squadra,
        ruolo,
        titolarita: parseFloat(titolarita.toFixed(2)),
        avversario,
        difficolta: calcolaDifficolta(avversario),
        punteggio: 0,
        infortunato,
        disponibile: !infortunato,
        stats: {
            goals: parseInt(document.getElementById('playerGoals').value) || 0,
            assist: parseInt(document.getElementById('playerAssist').value) || 0,
            minuti: parseInt(document.getElementById('playerMinuti').value) || 0,
            xgoals: parseFloat((parseFloat(document.getElementById('playerXGoals').value) || 0).toFixed(2)),
            xassist: parseFloat((parseFloat(document.getElementById('playerXAssist').value) || 0).toFixed(2)),
            mediaVoto: parseFloat((parseFloat(document.getElementById('playerMediaVoto').value) || 6.0).toFixed(2)),
            mediaFantavoto: parseFloat((parseFloat(document.getElementById('playerMediaFV').value) || 6.0).toFixed(2)),
            cleanSheet: parseInt(document.getElementById('playerCS').value) || 0,
            golSubiti: parseInt(document.getElementById('playerGolSubiti').value) || 0,
            rigoriParati: parseInt(document.getElementById('RigoriParati').value) || 0

        }
    };

    // DEBUG: Verifica stats
    console.log('Player aggiunto:', player.nome, 'Stats:', player.stats);

    tempRosa.push(player);
    updateAddedPlayersList();
    document.getElementById('addPlayerForm').reset();
    document.getElementById('playerNome').focus();
    document.getElementById('wizardFinishManual').disabled = false;
    showNotification(`✅ ${nome} aggiunto! (${tempRosa.length})`, 'success');
}



function updateAddedPlayersList() {
    const container = document.getElementById('addedPlayersList');
    const emptyMsg = document.getElementById('emptyPlayersMsg');

    if (tempRosa.length === 0) {
        emptyMsg.style.display = 'block';
        container.innerHTML = '';
        return;
    }

    emptyMsg.style.display = 'none';
    const ruoliMap = ['P', 'D', 'C', 'A'];

    container.innerHTML = tempRosa.map((p, i) => `
                <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: white; border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid #e5e7eb;">
                    <div><strong>${p.nome}</strong> <span style="color: var(--text-secondary);">(${ruoliMap[p.ruolo]}) - ${p.squadra}</span></div>
                    <button data-action="remove-player" data-index="${i}" class="btn btn-sm" style="background: var(--danger-color); color: white; padding: 0.5rem;"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
}

function removePlayer(index) {
    tempRosa.splice(index, 1);
    updateAddedPlayersList();
    if (tempRosa.length === 0) document.getElementById('wizardFinishManual').disabled = true;
    showNotification('🗑️ Rimosso', 'info');
}

function finishWizardManual() {
    if (tempRosa.length === 0) {
        showNotification('❌ Aggiungi almeno 1 giocatore!', 'error');
        return;
    }

    rosa = tempRosa;
    localStorage.setItem('fantacalcio_rosa', JSON.stringify({ players: rosa }));
    localStorage.setItem('fantacalcio_setup_completed', 'true');

    downloadRosa();
    document.getElementById('setupWizard').remove();
    showNotification(`✅ Rosa creata! File scaricato.`, 'success');
    location.reload();
}

function downloadRosa() {
    const blob = new Blob([JSON.stringify({ players: rosa }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mia_rosa.json';
    link.click();
    URL.revokeObjectURL(url);
}

function finishWizard() {
    localStorage.setItem('fantacalcio_setup_completed', 'true');
    document.getElementById('setupWizard').remove();
    showNotification('✅ Setup completato!', 'success');
    location.reload();
}

// Handler CSV wizard
document.addEventListener('change', function (e) {
    if (e.target.id === 'wizardStatsCSV') {
        handleWizardStatsCSV(e.target.files[0]);
    }
});

async function handleWizardStatsCSV(file) {
    try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        const dataLines = lines.slice(1); // Salta header

        rosa = [];

        dataLines.forEach(line => {
            const parts = line.split(';').map(p => p.trim()); // ✅ CAMBIATO DA ',' A ';'

            if (parts.length < 15) return;

            const [nome, squadra, ruoloStr, goals, assist, minuti, cleanSheet, golSubiti,
                xgoals, xassist, mediaVoto, mediaFantavoto, titolarita, infortunatoStr, rigoriParati] = parts;

            let ruolo = 0;
            if (ruoloStr === 'D') ruolo = 1;
            else if (ruoloStr === 'C') ruolo = 2;
            else if (ruoloStr === 'A') ruolo = 3;

            rosa.push({
                nome,
                squadra,
                ruolo,
                punteggio: 0,
                titolarita: parseFloat(titolarita) || 0,
                avversario: '',
                difficolta: 10,
                infortunato: infortunatoStr === 'TRUE',
                disponibile: infortunatoStr !== 'TRUE',
                stats: {
                    goals: parseInt(goals) || 0,
                    assist: parseInt(assist) || 0,
                    minuti: parseInt(minuti) || 0,
                    cleanSheet: parseInt(cleanSheet) || 0,
                    golSubiti: parseInt(golSubiti) || 0,
                    rigoriParati: parseInt(rigoriParati) || 0,
                    xgoals: parseFloat(xgoals) || 0,
                    xassist: parseFloat(xassist) || 0,
                    mediaVoto: parseFloat(mediaVoto) || 0,
                    mediaFantavoto: parseFloat(mediaFantavoto) || 0
                }
            });
        });

        localStorage.setItem('fantacalciorosa', JSON.stringify({ players: rosa }));
        document.getElementById('wizardFinishCSV').disabled = false;
        showNotification(`${rosa.length} giocatori caricati!`, 'success');

    } catch (error) {
        console.error('Errore CSV:', error);
        showNotification('Errore import CSV', 'error');
    }
}



// ============================================
// MOBILE MENU
// ============================================

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btn = document.getElementById('mobileMenuBtn');

    if (!sidebar) return;

    // Toggle classe
    const isActive = sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');

    // ⭐ FORZA posizione con JavaScript
    sidebar.style.left = isActive ? '0px' : '-100%';
    document.body.style.overflow = isActive ? 'hidden' : 'auto';

    // Cambia icona
    const icon = btn?.querySelector('i');
    if (icon) {
        icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
    }

    console.log('Menu toggled:', isActive, 'Left:', sidebar.style.left);
}


// Chiudi menu quando clicchi su una voce



// Chiudi menu quando si clicca su una voce


// Gestisci resize finestra
window.addEventListener('resize', function () {
    const btn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (window.innerWidth > 768) {
        // Desktop - rimuovi classi mobile
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = 'auto';

        const icon = btn?.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
    }
});
// ============================================
// MOBILE MENU TOGGLE
// ============================================

// ============================================
// 🎯 GESTIONE CLASSIFICA - SOLO FRECCE
// ============================================

function renderClassificaEditor() {
    const container = document.getElementById('classificaEditor');

    if (!container) {
        console.error('❌ Container classificaEditor non trovato!');
        return;
    }

    if (!classifica || classifica.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nessuna classifica disponibile</p>';
        return;
    }

    let html = `
            <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: linear-gradient(135deg, var(--warning-color), #d97706); color: white;">
                            <th style="padding: 1rem; text-align: center; width: 60px;">#</th>
                            <th style="padding: 1rem; text-align: left;">Squadra</th>
                            <th style="padding: 1rem; text-align: center; width: 120px;">Azioni</th>
                        </tr>
                    </thead>
                    <tbody id="classificaEditorBody">
        `;

    classifica.forEach((team, index) => {
        const isFirst = index === 0;
        const isLast = index === classifica.length - 1;

        html += `
                <tr id="team-${index}" 
                    style="border-bottom: 1px solid #e5e7eb; transition: all 0.2s;" 
                    onmouseover="this.style.background='#f9fafb'" 
                    onmouseout="this.style.background='white'">
                    <td style="padding: 1rem; text-align: center; font-weight: 700; font-size: 1.1rem; color: var(--primary-color);">
                        ${index + 1}
                    </td>
                    <td style="padding: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 30px; height: 30px; background: linear-gradient(135deg, var(--primary-color), #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.9rem;">
                                ${team.nome[0]}
                            </div>
                            <span style="font-weight: 600; font-size: 1rem;">${team.nome}</span>
                            <span style="color: var(--text-secondary); font-size: 0.85rem; margin-left: auto;">${team.punti} pt</span>
                        </div>
                    </td>
                    <td style="padding: 1rem; text-align: center;">
                        <div style="display: flex; gap: 0.5rem; justify-content: center;">
                            <button class="btn-arrow" 
                                    data-action="move-up" data-index="${index}" 
                                    ${isFirst ? 'disabled' : ''}
                                    style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; ${isFirst ? 'background: #e5e7eb; color: #9ca3af; cursor: not-allowed;' : 'background: var(--success-color); color: white;'}"
                                    title="Sposta su">
                                <i class="fas fa-arrow-up" style="font-size: 1.2rem;"></i>
                            </button>
                            <button class="btn-arrow" 
                                    data-action="move-down" data-index="${index}" 
                                    ${isLast ? 'disabled' : ''}
                                    style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; ${isLast ? 'background: #e5e7eb; color: #9ca3af; cursor: not-allowed;' : 'background: var(--danger-color); color: white;'}"
                                    title="Sposta giù">
                                <i class="fas fa-arrow-down" style="font-size: 1.2rem;"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
    });

    html += `
                    </tbody>
                </table>
            </div>
            
            <div style="margin-top: 1.5rem; padding: 1.5rem; background: #fef3c7; border-radius: 8px; border-left: 4px solid var(--warning-color);">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas fa-info-circle" style="color: var(--warning-color); font-size: 1.5rem;"></i>
                    <div>
                        <p style="margin: 0; font-weight: 600; margin-bottom: 0.25rem;">Gestione Classifica</p>
                        <p style="margin: 0; font-size: 0.9rem;">Usa le frecce <i class="fas fa-arrow-up" style="color: var(--success-color);"></i> <i class="fas fa-arrow-down" style="color: var(--danger-color);"></i> per riordinare le squadre.</p>
                    </div>
                </div>
            </div>
        `;

    container.innerHTML = html;
    console.log('✅ Classifica editor renderizzato');
}

function moveTeam(index, direction) {
    // ⭐ Salva i punti PRIMA di spostare (legati alla posizione)
    const puntipPerPosizione = classifica.map(t => t.punti);

    if (direction === 'up' && index > 0) {
        // Scambia le squadre
        const temp = classifica[index];
        classifica[index] = classifica[index - 1];
        classifica[index - 1] = temp;

        // ⭐ I punti restano nella posizione (non si spostano)
        classifica[index].punti = puntipPerPosizione[index];
        classifica[index - 1].punti = puntipPerPosizione[index - 1];

    } else if (direction === 'down' && index < classifica.length - 1) {
        // Scambia le squadre
        const temp = classifica[index];
        classifica[index] = classifica[index + 1];
        classifica[index + 1] = temp;

        // ⭐ I punti restano nella posizione (non si spostano)
        classifica[index].punti = puntipPerPosizione[index];
        classifica[index + 1].punti = puntipPerPosizione[index + 1];

    } else {
        return;
    }

    renderClassificaEditor();
    showNotification('✅ Squadra spostata', 'success');
}


// ============================================
// 🎯 FIX RESPONSIVE - Chiudi sidebar su resize
// ============================================

window.addEventListener('resize', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (window.innerWidth > 768) {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});
function renderGestioneRosa() {
    const container = document.getElementById('rosaManagementContainer');
    if (!container) return;

    container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                
                <!-- SEZIONE AGGIUNGI GIOCATORE -->
                <div style="background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h3 style="margin-top: 0; color: var(--success-color);">
                        <i class="fas fa-user-plus"></i> Aggiungi Giocatore
                    </h3>
                    
                    <form id="addPlayerForm" style="display: flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Nome</label>
                            <input type="text" id="newPlayerName" required 
                                style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;" 
                                placeholder="Es: Mario Rossi">
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Ruolo</label>
                            <select id="newPlayerRole" required 
                                    style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                                <option value="">Seleziona ruolo</option>
                                <option value="P">Portiere (P)</option>
                                <option value="D">Difensore (D)</option>
                                <option value="C">Centrocampista (C)</option>
                                <option value="A">Attaccante (A)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Squadra</label>
                            <select id="newPlayerTeam" required 
                                    style="width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                                <option value="">Seleziona squadra</option>
                                ${classifica.map(team => `<option value="${team.nome}">${team.nome}</option>`).join('')}
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-success" style="margin-top: 1rem;">
                            <i class="fas fa-plus"></i> Aggiungi alla Rosa
                        </button>
                    </form>
                </div>
                
                <!-- SEZIONE ROSA ATTUALE -->
                <div style="background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h3 style="margin-top: 0; color: var(--primary-color);">
                        <i class="fas fa-users"></i> Rosa Attuale (${rosa.length} giocatori)
                    </h3>
                    
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <input type="text" id="searchPlayer" 
                            placeholder="Cerca giocatore..." 
                            onkeyup="filterRosa()"
                            style="flex: 1; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                        <select id="filterRole" data-action="filter-rosa" 
                                style="padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px;">
                            <option value="">Tutti i ruoli</option>
                            <option value="P">Portieri</option>
                            <option value="D">Difensori</option>
                            <option value="C">Centrocampisti</option>
                            <option value="A">Attaccanti</option>
                        </select>
                    </div>
                    
                    <div id="rosaList" style="max-height: 400px; overflow-y: auto;">
                        <!-- Generato dinamicamente -->
                    </div>
                </div>
            </div>
        `;

    renderRosaList();
}
// ============================================
// 🎯 GESTIONE ROSA - VERSIONE CORRETTA
// ============================================
function getRuoloBadgeColor(ruolo) {
    const colors = {
        'P': '#f59e0b',  // Arancione per Portiere
        'D': '#10b981',  // Verde per Difensore
        'C': '#3b82f6',  // Blu per Centrocampista
        'A': '#ef4444'   // Rosso per Attaccante
    };
    return colors[ruolo] || '#6b7280';
}

function getRuoloCompleto(ruolo) {
    const ruoli = {
        'P': 'Portiere',
        'D': 'Difensore',
        'C': 'Centrocampista',
        'A': 'Attaccante'
    };
    return ruoli[ruolo] || ruolo;
}

function renderRosaList() {
    const container = document.getElementById('rosaList');
    if (!container) return;

    const searchTerm = document.getElementById('searchPlayer')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('filterRole')?.value || '';

    const filteredRosa = rosa.filter(player => {
        const matchSearch = player.nome.toLowerCase().includes(searchTerm);
        const ruoloNormalizzato = normalizzaRuolo(player.ruolo); // ⭐ Normalizza
        const matchRole = !roleFilter || ruoloNormalizzato === roleFilter;
        return matchSearch && matchRole;
    });

    if (filteredRosa.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Nessun giocatore trovato</p>';
        return;
    }

    container.innerHTML = filteredRosa.map(player => {
        const ruoloNormalizzato = normalizzaRuolo(player.ruolo); // ⭐ Normalizza
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border-bottom: 1px solid #e5e7eb; transition: all 0.2s;"
                onmouseover="this.style.background='#f9fafb'" 
                onmouseout="this.style.background='white'">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 40px; height: 40px; background: ${getRuoloBadgeColor(ruoloNormalizzato)}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
                        ${ruoloNormalizzato}
                    </div>
                    <div>
                        <div style="font-weight: 600;">${player.nome}</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">
                            ${player.squadra} • ${getRuoloCompleto(ruoloNormalizzato)}
                        </div>
                    </div>
                </div>
                <button data-action="remove-giocatore" data-player="${player.nome}" 
                        class="btn btn-danger" 
                        style="padding: 0.5rem 1rem;">
                    <i class="fas fa-trash"></i> Rimuovi
                </button>
            </div>
        `;
    }).join('');
}


function getRuoloCompleto(ruolo) {
    const ruoli = {
        'P': 'Portiere',
        'D': 'Difensore',
        'C': 'Centrocampista',
        'A': 'Attaccante'
    };
    return ruoli[ruolo] || ruolo;
}

// ============================================
// 🎯 NORMALIZZA RUOLO (converte numeri in lettere)
// ============================================

function normalizzaRuolo(ruolo) {
    // Se è già una lettera, restituiscila
    if (typeof ruolo === 'string' && ruolo.length === 1) {
        return ruolo.toUpperCase();
    }

    // Converte numeri in lettere
    const mappatura = {
        0: 'P',
        1: 'D',
        2: 'C',
        3: 'A',
        '0': 'P',
        '1': 'D',
        '2': 'C',
        '3': 'A'
    };

    return mappatura[ruolo] || ruolo;
}

// ============================================
// 🎯 AGGIUNGI GIOCATORE (con normalizzazione)
// ============================================

// ============================================
// 🎯 ORDINA ROSA PER RUOLO
// ============================================

function ordinaRosaPerRuolo() {
    // Ordine: Portieri, Difensori, Centrocampisti, Attaccanti
    const ordineRuoli = ['P', 'D', 'C', 'A'];

    rosa.sort((a, b) => {
        const ruoloA = normalizzaRuolo(a.ruolo);
        const ruoloB = normalizzaRuolo(b.ruolo);

        const indexA = ordineRuoli.indexOf(ruoloA);
        const indexB = ordineRuoli.indexOf(ruoloB);

        // Prima ordina per ruolo
        if (indexA !== indexB) {
            return indexA - indexB;
        }

        // Se stesso ruolo, ordina per nome alfabetico
        return a.nome.localeCompare(b.nome);
    });
}

// ============================================
// 🎯 AGGIUNGI GIOCATORE (con auto-ordinamento)
// ============================================

function aggiungiGiocatore(event) {
    event.preventDefault();

    if (rosa.length >= 25) {
        showNotification('❌ Rosa completa! Massimo 25 giocatori', 'error');
        return;
    }

    const nome = document.getElementById('newPlayerName').value.trim();
    const ruolo = document.getElementById('newPlayerRole').value;
    const squadra = document.getElementById('newPlayerTeam').value;

    const conteggioRuoli = {
        'P': rosa.filter(p => normalizzaRuolo(p.ruolo) === 'P').length,
        'D': rosa.filter(p => normalizzaRuolo(p.ruolo) === 'D').length,
        'C': rosa.filter(p => normalizzaRuolo(p.ruolo) === 'C').length,
        'A': rosa.filter(p => normalizzaRuolo(p.ruolo) === 'A').length
    };

    const limiti = {
        'P': 3,
        'D': 8,
        'C': 8,
        'A': 6
    };

    if (conteggioRuoli[ruolo] >= limiti[ruolo]) {
        const ruoloNome = getRuoloCompleto(ruolo);
        showNotification(`❌ Limite raggiunto per ${ruoloNome}! Hai ${conteggioRuoli[ruolo]}/${limiti[ruolo]}`, 'error');
        return;
    }

    if (rosa.some(p => p.nome.toLowerCase() === nome.toLowerCase())) {
        showNotification('❌ Giocatore già presente nella rosa', 'error');
        return;
    }

    const nuovoGiocatore = {
        nome: nome,
        ruolo: ruolo,
        squadra: squadra,
        media_voto: 0,
        gol: 0,
        assist: 0,
        ammonizioni: 0,
        espulsioni: 0,
        rigori_parati: 0,
        rigori_sbagliati: 0,
        autogol: 0,
        punteggio_totale: 0
    };

    rosa.push(nuovoGiocatore);

    // ⭐ ORDINA AUTOMATICAMENTE PER RUOLO
    ordinaRosaPerRuolo();

    document.getElementById('newPlayerName').value = '';
    document.getElementById('newPlayerRole').value = '';
    document.getElementById('newPlayerTeam').value = '';

    renderRosaList();
    renderGestioneRosa();

    try {
        localStorage.setItem('fantacalcio_rosa', JSON.stringify(rosa));
    } catch (e) {
        console.warn('Impossibile salvare');
    }

    showNotification(`✅ ${nome} aggiunto! (${getRuoloCompleto(ruolo)}: ${conteggioRuoli[ruolo] + 1}/${limiti[ruolo]})`, 'success');
}




// ============================================
// 🎯 CLASSIFICA EDITOR CON ANIMAZIONE
// ============================================

// ============================================
// 🎯 MOVE TEAM CON ANIMAZIONE
// ============================================

// ============================================
// 🎯 MOVE TEAM CON ANIMAZIONE FLUIDA
// ============================================

function moveTeam(index, direction) {
    const tbody = document.getElementById('classificaEditorBody');
    if (!tbody) return;

    const puntipPerPosizione = classifica.map(t => t.punti);
    let targetIndex;

    if (direction === 'up' && index > 0) {
        targetIndex = index - 1;
    } else if (direction === 'down' && index < classifica.length - 1) {
        targetIndex = index + 1;
    } else {
        return;
    }

    const row1 = tbody.children[index];
    const row2 = tbody.children[targetIndex];

    if (!row1 || !row2) return;

    // ⭐ Disabilita pulsanti durante l'animazione
    tbody.style.pointerEvents = 'none';

    // ⭐ Applica transizioni fluide
    row1.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    row2.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

    // ⭐ Evidenzia e scala
    row1.style.background = 'linear-gradient(135deg, #dbeafe, #93c5fd)';
    row2.style.background = 'linear-gradient(135deg, #fef3c7, #fcd34d)';
    row1.style.transform = 'scale(1.05) translateX(10px)';
    row2.style.transform = 'scale(1.05) translateX(10px)';
    row1.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
    row2.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';

    setTimeout(() => {
        // Scambia nell'array
        const temp = classifica[index];
        classifica[index] = classifica[targetIndex];
        classifica[targetIndex] = temp;

        classifica[index].punti = puntipPerPosizione[index];
        classifica[targetIndex].punti = puntipPerPosizione[targetIndex];

        // Re-renderizza
        renderClassificaEditor();

        // ⭐ Evidenzia le righe scambiate con effetto pulse
        setTimeout(() => {
            const newRow1 = tbody.children[targetIndex];
            const newRow2 = tbody.children[index];

            tbody.style.pointerEvents = 'auto';

            if (newRow1) {
                newRow1.style.transition = 'all 0.6s ease';
                newRow1.style.background = 'linear-gradient(135deg, #d1fae5, #6ee7b7)';
                newRow1.style.transform = 'scale(1.03)';

                setTimeout(() => {
                    newRow1.style.background = 'white';
                    newRow1.style.transform = 'scale(1)';
                }, 600);
            }

            if (newRow2) {
                newRow2.style.transition = 'all 0.6s ease';
                newRow2.style.background = 'linear-gradient(135deg, #d1fae5, #6ee7b7)';
                newRow2.style.transform = 'scale(1.03)';

                setTimeout(() => {
                    newRow2.style.background = 'white';
                    newRow2.style.transform = 'scale(1)';
                }, 600);
            }
        }, 50);

        showNotification('✅ Squadra spostata', 'success');
    }, 400);
}




function rimuoviGiocatore(nomeGiocatore) {
    if (!confirm(`Vuoi rimuovere ${nomeGiocatore} dalla rosa?`)) {
        return;
    }

    const index = rosa.findIndex(p => p.nome === nomeGiocatore);

    if (index !== -1) {
        rosa.splice(index, 1);
        renderRosaList();
        renderGestioneRosa(); // Aggiorna contatore

        // ⭐ Salva nel localStorage
        try {
            localStorage.setItem('fantacalcio_rosa', JSON.stringify(rosa));
        } catch (e) {
            console.warn('Impossibile salvare nel localStorage');
        }

        showNotification(`✅ ${nomeGiocatore} rimosso dalla rosa (${rosa.length}/25)`, 'success');
    }
}

function filterRosa() {
    renderRosaList();
}
// ============================================
// 🎯 INIT APP - CARICAMENTO PAGINA (UNIFICATO)
// ============================================
// ============================================
// 🎯 INIT APP - CARICAMENTO PAGINA (UNIFICATO)
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // 1️⃣ Inizializza app
    initializeApp();
    setupEventListeners();

    // 2️⃣ Rimuovi style inline dal pulsante mobile
    const btn = document.getElementById('mobileMenuBtn');
    if (btn) {
        btn.removeAttribute('style');
        console.log('✅ Style inline rimosso');
    }

    // 3️⃣ Pulsante calcola punteggi
    const calcPunteggiBtn = document.getElementById('calcPunteggi');
    if (calcPunteggiBtn) {
        calcPunteggiBtn.addEventListener('click', function () {
            if (confirm('⚠️ Ricalcolare i punteggi?\n\nSovrascriverà i punteggi attuali.')) {
                calcolaPunteggi();
            }
        });
    }

    // 4️⃣ Aggiungi CSS dinamico per stato option
    const style = document.createElement('style');
    style.textContent = `
        .stato-option:has(input:checked) {
            background: linear-gradient(135deg, var(--primary-color), #2563eb);
            border-color: var(--primary-color) !important;
            color: white;
        }
        
        .stato-option:has(input:checked) i {
            color: white !important;
        }
        
        .stato-option:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
    `;
    document.head.appendChild(style);

    // 5️⃣ Inizializza sezione gestione
    initGestioneSection();

    // 6️⃣ Menu mobile toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    // Crea overlay se non esiste
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebarOverlay';
        document.body.appendChild(overlay);
    }

    // Toggle sidebar
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }

    // Chiudi con overlay
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // 7️⃣ Chiudi menu quando clicchi un link sidebar (mobile)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                if (sidebar?.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');

                    const icon = btn?.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';

                    document.body.style.overflow = 'auto';
                }
            }
        });
    });

    // 8️⃣ Form submit
    const addPlayerForm = document.getElementById('addPlayerForm');
    if (addPlayerForm) {
        addPlayerForm.addEventListener('submit', aggiungiGiocatore);
    }

    // 9️⃣ Select change
    const filterRole = document.getElementById('filterRole');
    if (filterRole) {
        filterRole.addEventListener('change', filterRosa);
    }

    // 🔟 Event listener wizard
    const wizardCSVInput = document.getElementById('wizardCSVInput');
    if (wizardCSVInput) {
        wizardCSVInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) handleStatsImport(file);
        });
    }

    const wizardManualBtn = document.getElementById('wizardManualBtn');
    if (wizardManualBtn) {
        wizardManualBtn.addEventListener('click', function () {
            document.getElementById('firstTimeWizard').style.display = 'none';
            document.querySelector('.main-content').style.display = 'block';
            showSection('gestione');
        });
    }

    const finishBtn = document.getElementById('wizardFinishCSV');
    if (finishBtn) {
        finishBtn.addEventListener('click', function () {
            const rosaData = localStorage.getItem('fantacalciorosa');
            if (rosaData) {
                const parsed = JSON.parse(rosaData);
                rosa = parsed.players || [];
            }

            localStorage.setItem('wizardCompleted', 'true');

            document.getElementById('firstTimeWizard').style.display = 'none';
            document.querySelector('.main-content').style.display = 'block';

            showSection('dashboard');
            renderDashboard();
            renderRosa();

            console.log('✅ Wizard completato');
        });
    }

    console.log('✅ App inizializzata');
});


// ============================================
// 🎯 EVENT DELEGATION GLOBALE - RISOLVE CSP
// ============================================
document.addEventListener('click', function (e) {
    const target = e.target.closest('[data-action], [data-player]');
    if (!target) return;

    // ⭐ Stop propagation se richiesto
    if (target.dataset.stopPropagation === 'true') {
        e.stopPropagation();
    }

    const action = target.dataset.action;
    const player = target.dataset.player;

    // Player details
    if (player) {
        showPlayerDetails(player);
        return;
    }

    // Actions base (già esistenti nel primo listener)
    if (action === 'esporta') {
        esportaModifiche();
        return;
    }
    if (action === 'save-player') {
        savePlayerEdit();
        return;
    }
    if (action === 'cancel-edit') {
        cancelPlayerEdit();
        return;
    }
    if (action === 'save-classifica') {
        saveClassificaEdit();
        return;
    }

    // Actions aggiuntive
    switch (action) {
        case 'filter-rosa':
            filterRosa();
            break;
        case 'update-points':
            updateTeamPoints(parseInt(target.dataset.teamIndex), target.value);
            break;
        case 'move-up':
            moveTeam(parseInt(target.dataset.index), 'up');
            break;
        case 'move-down':
            moveTeam(parseInt(target.dataset.index), 'down');
            break;
        case 'page':
            changePage(parseInt(target.dataset.page));
            break;
        case 'wizard-step':
            showWizardStep(parseInt(target.dataset.step));
            break;
        case 'import-method':
            selectImportMethod(target.dataset.method);
            break;
        case 'load-json':
            document.getElementById('loadRosaJson').click();
            break;
        case 'finish-wizard':
            finishWizard();
            break;
        case 'finish-wizard-manual':
            finishWizardManual();
            break;
        case 'add-player-manual':
            addPlayerManual();
            break;
        case 'remove-player':
            removePlayer(parseInt(target.dataset.index));
            break;
        case 'remove-giocatore':
            rimuoviGiocatore(target.dataset.player);
            break;
    }
});
// Esporta tutte le statistiche giocatori in un unico CSV modificabile
function esportaGiocatoriCSV(giocatori) {
    const headers = [
        "Nome", "Squadra", "Ruolo", "Goals", "Assist", "Minuti", "CleanSheet",
        "GolSubiti", "xGoals", "xAssist", "MediaVoto", "MediaFantavoto",
        "Titolarita", "Infortunato", "RigoriParati"
    ];
    let rows = giocatori.map(g =>
        [
            g.nome,
            g.squadra,
            g.ruolo,
            g.stats.goals,
            g.stats.assist,
            g.stats.minuti,
            g.stats.cleanSheet,
            g.stats.golSubiti,
            g.stats.xgoals,
            g.stats.xassist,
            g.stats.mediaVoto,
            g.stats.mediaFantavoto,
            g.titolarita,
            g.infortunato,
            g.avversario,
            g.stats.rigoriParati // <-- AGGIUNTO qui
        ].join(";")
    );
    let csv = headers.join(";") + "\n" + rows.join("\n");
    let blob = new Blob([csv], { type: "text/csv" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "statistiche_giocatore.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function getBadgeClass(ruolo) {
    switch (String(ruolo)) {
        case "0": return "badge-portiere";       // personalizzato: es. blu
        case "1": return "badge-difensore";      // personalizzato: es. verde
        case "2": return "badge-centrocampista"; // personalizzato: es. arancione
        case "3": return "badge-attaccante";     // personalizzato: es. rosso
        default: return "badge-info";           // fallback generico
    }
}

// Trova la giornata corrente basata sulla data odierna
function getGiornataCorrente() {
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    
    // Trova l'ultima data di partita per ogni giornata
    const giornateConDate = [];
    for (let g = 1; g <= 38; g++) {
        const partiteGiornata = calendario.filter(p => p.giornata === g);
        if (partiteGiornata.length > 0) {
            // Prendi la data dell'ultima partita (tutte hanno stessa data nel tuo caso)
            const dataFine = new Date(partiteGiornata[0].data);
            giornateConDate.push({ numero: g, dataFine });
        }
    }
    
    // Trova la giornata corrente
    for (let i = 0; i < giornateConDate.length; i++) {
        if (oggi <= giornateConDate[i].dataFine) {
            return giornateConDate[i].numero;
        }
    }
    
    return 38; // Ultima giornata
}

// Trova la prossima partita per una squadra
function trovaProssimaPartita(nomeSquadra) {
    const giornataCorrente = getGiornataCorrente();
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    
    // Verifica se la giornata corrente è già finita
    const partiteGiornataCorrente = calendario.filter(p => p.giornata === giornataCorrente);
    let giornataDaUsare = giornataCorrente;
    
    if (partiteGiornataCorrente.length > 0) {
        const dataFine = new Date(partiteGiornataCorrente[0].data);
        if (oggi > dataFine) {
            // Giornata finita, usa la prossima
            giornataDaUsare = giornataCorrente + 1;
        }
    }
    
    // Cerca la partita della squadra
    const partita = calendario.find(p => 
        p.giornata === giornataDaUsare && 
        (p.casa === nomeSquadra || p.trasferta === nomeSquadra)
    );
    
    if (!partita) {
        return { giornata: giornataDaUsare, avversario: 'N/D', data: 'N/D' };
    }
    
    const avversario = partita.casa === nomeSquadra ? partita.trasferta : partita.casa;
    
    return {
        giornata: partita.giornata,
        avversario: avversario,
        data: partita.data
    };
}

// Aggiorna avversari automaticamente
function aggiornaAvversariAutomatico() {
    console.log('🔄 Aggiornamento avversari automatico...');
    
    let aggiornati = 0;
    
    rosa.forEach(player => {
        const infoPartita = trovaProssimaPartita(player.squadra);
        
        if (infoPartita.avversario !== 'N/D') {
            player.avversario = infoPartita.avversario;
            
            // Aggiorna difficoltà
            const teamInfo = classifica.find(t => t.nome === infoPartita.avversario);
            if (teamInfo) {
                player.difficolta = teamInfo.punti;
            }
            
            aggiornati++;
        }
    });
    
    if (aggiornati > 0) {
        console.log(`✅ ${aggiornati} giocatori aggiornati`);
        salvaDati();
    }
}

function renderRosaManagement() {
    const container = document.getElementById('rosaManagementContainer');
    if (!container) return;

    if (!rosa || rosa.length === 0) {
        container.innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <i class="fas fa-users" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">Nessun giocatore nella rosa</p>
            </div>
        `;
        return;
    }

    const html = `
        <div class="card" style="box-shadow: 0 4px 16px rgba(0,0,0,0.1); border-radius: 16px; overflow: hidden;">
            <div class="card-header" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 1.5rem; text-align: center; border-bottom: 3px solid #1d4ed8;">
                <h2 style="margin: 0; font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
                    <i class="fas fa-users" style="font-size: 1.8rem;"></i>
                    <span>Elenco Giocatori (${rosa.length})</span>
                </h2>
            </div>
            <div style="padding: 1.5rem; background: linear-gradient(135deg, #f8fafc, white);">
                <div style="display: grid; gap: 1rem;">
                    ${rosa.map((player, index) => `
                        <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.05);" 
                             onmouseover="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 4px 12px rgba(59,130,246,0.15)'; this.style.transform='translateY(-2px)';" 
                             onmouseout="this.style.borderColor='#e5e7eb'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; this.style.transform='translateY(0)';">
                            
                            <!-- Info giocatore -->
                            <div style="display: flex; align-items: center; gap: 1.5rem; flex: 1;">
                                <!-- Numero -->
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; box-shadow: 0 2px 8px rgba(59,130,246,0.3);">
                                    ${index + 1}
                                </div>
                                
                                <!-- Dettagli -->
                                <div style="flex: 1;">
                                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                                        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: #111827;">
                                            ${player.nome}
                                        </h3>
                                        <span class="badge badge-${normalizzaRuolo(player.ruolo).toLowerCase()}" style="padding: 0.35rem 0.75rem; font-size: 0.85rem; border-radius: 6px;">
                                            ${normalizzaRuolo(player.ruolo)}
                                        </span>
                                    </div>
                                    <div style="display: flex; gap: 1.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                                        <span style="display: flex; align-items: center; gap: 0.4rem;">
                                            <i class="fas fa-shield-alt"></i>
                                            <strong>${player.squadra}</strong>
                                        </span>
                                        <span style="display: flex; align-items: center; gap: 0.4rem;">
                                            <i class="fas fa-star" style="color: #fbbf24;"></i>
                                            <strong>${(player.punteggio || 0).toFixed(2)}</strong>
                                        </span>
                                        <span style="display: flex; align-items: center; gap: 0.4rem;">
                                            <i class="fas fa-percentage"></i>
                                            <strong>${player.titolarita || 0}% Titolarità</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Pulsante elimina -->
                            <button class="btn btn-danger" onclick="eliminaGiocatore('${player.nome}')" 
                                    style="padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; box-shadow: 0 2px 8px rgba(239,68,68,0.3); transition: all 0.2s;">
                                <i class="fas fa-trash-alt"></i> Elimina
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function eliminaGiocatore(nomeGiocatore) {
    if (confirm(`⚠️ Sei sicuro di voler eliminare ${nomeGiocatore} dalla rosa?\n\nQuesta azione non può essere annullata.`)) {
        rosa = rosa.filter(p => p.nome !== nomeGiocatore);

        // Mostra notifica di successo
        alert(`✅ ${nomeGiocatore} è stato eliminato dalla rosa`);

        // Aggiorna tutte le sezioni
        renderRosaManagement();
        renderRosa();
        renderDashboard();

        // Salva automaticamente
        salvaDati();
    }
}
// Aggiungi nuovo giocatore
// Aggiungi nuovo giocatore con controllo limiti
document.getElementById('addNewPlayerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const ruolo = parseInt(document.getElementById('newRuolo').value);

    // Conta giocatori per ruolo
    const conteggioRuoli = {
        0: rosa.filter(p => p.ruolo === 0).length, // Portieri
        1: rosa.filter(p => p.ruolo === 1).length, // Difensori
        2: rosa.filter(p => p.ruolo === 2).length, // Centrocampisti
        3: rosa.filter(p => p.ruolo === 3).length  // Attaccanti
    };

    // Limiti per ruolo
    const limiti = {
        0: 3,
        1: 8,
        2: 8,
        3: 6
    };

    const nomiRuoli = {
        0: 'Portieri',
        1: 'Difensori',
        2: 'Centrocampisti',
        3: 'Attaccanti'
    };

    // Verifica limite
    if (conteggioRuoli[ruolo] >= limiti[ruolo]) {
        showNotification(
            `❌ Limite raggiunto! Hai già ${conteggioRuoli[ruolo]} ${nomiRuoli[ruolo]} (max ${limiti[ruolo]})`,
            'error'
        );
        return;
    }

    const newPlayer = {
        nome: document.getElementById('newNome').value.trim(),
        squadra: document.getElementById('newSquadra').value,
        ruolo: ruolo,
        punteggio: 0,
        titolarita: parseFloat(document.getElementById('newTitolarita').value) || 90,
        avversario: '',
        difficolta: 10,
        infortunato: false,
        disponibile: true,
        stats: {
            goals: parseInt(document.getElementById('newGoals').value) || 0,
            assist: parseInt(document.getElementById('newAssist').value) || 0,
            minuti: parseInt(document.getElementById('newMinuti').value) || 0,
            cleanSheet: parseInt(document.getElementById('newCleanSheet').value) || 0,
            golSubiti: parseInt(document.getElementById('newGolSubiti').value) || 0,
            rigoriParati: parseInt(document.getElementById('newRigoriParati').value) || 0,
            xgoals: parseFloat(document.getElementById('newXgoals').value) || 0,
            xassist: parseFloat(document.getElementById('newXassist').value) || 0,
            mediaVoto: parseFloat(document.getElementById('newMediaVoto').value) || 6,
            mediaFantavoto: parseFloat(document.getElementById('newMediaFantavoto').value) || 6
        }
    };

    rosa.push(newPlayer);
    salvaDati();
    renderDashboard();
    renderRosa();

    const nuovoConteggio = conteggioRuoli[ruolo] + 1;
    showNotification(
        `✓ ${newPlayer.nome} aggiunto alla rosa! (${nomiRuoli[ruolo]}: ${nuovoConteggio}/${limiti[ruolo]})`,
        'success'
    );

    // Reset form
    this.reset();
});
function updateStatsCards() {
    const conteggio = {
        portieri: rosa.filter(p => p.ruolo === 0).length,
        difensori: rosa.filter(p => p.ruolo === 1).length,
        centrocampisti: rosa.filter(p => p.ruolo === 2).length,
        attaccanti: rosa.filter(p => p.ruolo === 3).length
    };

    document.getElementById('numPortieri').textContent = conteggio.portieri;
    document.getElementById('numDifensori').textContent = conteggio.difensori;
    document.getElementById('numCentrocampisti').textContent = conteggio.centrocampisti;
    document.getElementById('numAttaccanti').textContent = conteggio.attaccanti;
}
