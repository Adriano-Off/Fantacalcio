// CONFIGURAZIONE
const API_BASE = 'http://localhost/cgi-bin/api.cgi';
const USE_BACKEND = false;      // ← Non usa CGI
const USE_JSON_FILES = true;
const AUTO_CALCULATE = false;
let currentSortBy = 'punteggio';
let currentSortDirection = 'desc';
const PUNTONEUTRO = 10.0;
const COEFFPORTIERE = 0.035;
const COEFFDIFENSORE = 0.025;
const COEFFCENTROCAMPISTA = 0.030;
const COEFFATTACCANTE = 0.040;


let rosa = [];
let classifica = [
    {nome: "Milan", punti: 20},
    {nome: "Napoli", punti: 19},
    {nome: "Inter", punti: 18},
    {nome: "Roma", punti: 17},
    {nome: "Juventus", punti: 16},
    {nome: "Atalanta", punti: 15},
    {nome: "Bologna", punti: 14},
    {nome: "Lazio", punti: 13},
    {nome: "Como", punti: 12},
    {nome: "Fiorentina", punti: 11},
    {nome: "Torino", punti: 10},
    {nome: "Udinese", punti: 9},
    {nome: "Genoa", punti: 8},
    {nome: "Cagliari", punti: 7},
    {nome: "Parma", punti: 6},
    {nome: "Sassuolo", punti: 5},
    {nome: "Lecce", punti: 4},
    {nome: "Cremonese", punti: 3},
    {nome: "Verona", punti: 2},
    {nome: "Pisa", punti: 1}
];

const ruoliMap = ["Portiere", "Difensore", "Centrocampista", "Attaccante"];

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

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
            showNotification('Dati aggiornati dal programma C', 'success');
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
    
    // Carica dati
    await loadData();
    
    // ⚠️ CONTROLLA SE È IL PRIMO ACCESSO
    if (checkFirstTime()) {
        console.log('👋 Primo accesso - mostra wizard');
        return; // Il wizard gestisce tutto
    }
    
    // Se ci sono dati, renderizza normalmente
    console.log('✅ Dati esistenti - carica interfaccia');
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
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            
            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('searchPlayer').addEventListener('input', function(e) {
    filterRosa(e.target.value);
});
        });
    });
    
    // Menu toggle
    document.getElementById('menuToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Calcola punteggi
    document.getElementById('calcPunteggi').addEventListener('click', calcolaPunteggi);
    
    // Salva dati
    document.getElementById('salvaDati').addEventListener('click', salvaDati);
    
    // Search
    document.getElementById('searchPlayer').addEventListener('input', function(e) {
        filterRosa(e.target.value);
    });
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const role = this.dataset.role;
            filterByRole(role);
        });
    });
    
    // Modal close
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('playerModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // File imports
    document.getElementById('importStats').addEventListener('change', handleStatsImport);
    document.getElementById('importClassifica').addEventListener('change', handleClassificaImport);

    document.getElementById('resetData').addEventListener('click', function() {
    if (confirm('Cancellare tutti i dati salvati localmente?')) {
        localStorage.removeItem('fantasoccerData');
        rosa = [];
        renderDashboard();
        renderRosa();
        showNotification('Dati locali cancellati', 'success');
    }
});
}

function showSection(sectionName) {
    console.log('📄 Cambio sezione:', sectionName);
    
    // Nascondi tutte le sezioni
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostra sezione richiesta
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Carica contenuto specifico DOPO aver mostrato la sezione
        if (sectionName === 'gestione') {
            loadGestioneEditor();
        } else if (sectionName === 'classifica') {
            renderClassifica();
        } else if (sectionName === 'rosa') {
            renderRosa();
        } else if (sectionName === 'formazione') {
            renderFormazione();
        } else if (sectionName === 'topGiocatori') {
            renderTopGiocatori();
        } else if (sectionName === 'dashboard') {
            renderDashboard();
        }
    } else {
        console.error('❌ Sezione non trovata:', sectionName);
    }
    
    // Aggiorna menu attivo
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        }
    });
}



// NON caricare rosa.json da file, usa SOLO localStorage
async function loadData() {
    console.log('📦 Caricamento dati...');
    
    // Carica classifica (predefinita)
    const savedClassifica = localStorage.getItem('fantacalcio_classifica');
    if (savedClassifica) {
        classifica = JSON.parse(savedClassifica);
        console.log('✓ Classifica caricata da localStorage');
    } else {
        // Usa classifica predefinita
        classifica = [
    {nome: "Milan", punti: 20},
    {nome: "Napoli", punti: 19},
    {nome: "Inter", punti: 18},
    {nome: "Roma", punti: 17},
    {nome: "Juventus", punti: 16},
    {nome: "Atalanta", punti: 15},
    {nome: "Bologna", punti: 14},
    {nome: "Lazio", punti: 13},
    {nome: "Como", punti: 12},
    {nome: "Fiorentina", punti: 11},
    {nome: "Torino", punti: 10},
    {nome: "Udinese", punti: 9},
    {nome: "Genoa", punti: 8},
    {nome: "Cagliari", punti: 7},
    {nome: "Parma", punti: 6},
    {nome: "Sassuolo", punti: 5},
    {nome: "Lecce", punti: 4},
    {nome: "Cremonese", punti: 3},
    {nome: "Verona", punti: 2},
    {nome: "Pisa", punti: 1}
        ];
        localStorage.setItem('fantacalcio_classifica', JSON.stringify(classifica));
        console.log('✓ Classifica predefinita creata');
    }
    
    // Carica rosa (SOLO da localStorage, NON da file)
    const savedRosa = localStorage.getItem('fantacalcio_rosa');
    if (savedRosa) {
        const data = JSON.parse(savedRosa);
        rosa = data.players || data;
        console.log(`✓ Rosa caricata: ${rosa.length} giocatori`);
    } else {
        rosa = []; // Array vuoto = primo accesso
        console.log('⚠️ Nessuna rosa trovata - primo avvio');
    }
    
    console.log(`📊 Dati caricati: ${rosa.length} giocatori, ${classifica.length} squadre`);
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
        <button onclick="document.getElementById('loadRosaJson').click()" 
                class="btn btn-primary">
            <i class="fas fa-file-import"></i> Carica rosa.json
        </button>
    `;
    document.body.appendChild(prompt);
    
    document.getElementById('loadRosaJson').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
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
            <div class="player-item" onclick="showPlayerDetails('${player.nome}')">
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

// Rosa Rendering
function renderRosa() {
    const tbody = document.getElementById('rosaTableBody');
    
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
                        <button class="btn btn-primary" onclick="showSection('import')">
                            <i class="fas fa-file-import"></i> Importa Dati
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // APPLICA ORDINAMENTO
    const sortedRosa = [...rosa].sort((a, b) => {
        let valueA, valueB;
        
        switch(currentSortBy) {
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
            case 'squadra':
                valueA = (a.squadra || '').toLowerCase();
                valueB = (b.squadra || '').toLowerCase();
                break;
            case 'titolarita':
                valueA = a.titolarita || 0;
                valueB = b.titolarita || 0;
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
    
    const html = sortedRosa.map((player, index) => `
        <tr onclick="showPlayerDetails('${player.nome}')">
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 0.9rem; width: 25px; color: var(--text-secondary); font-weight: 600;">#${index + 1}</span>
                    <strong>${player.nome}</strong>
                </div>
            </td>
            <td><span class="badge badge-info">${ruoliMap[player.ruolo]}</span></td>
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
                    <span style="font-size: 0.9rem; font-weight: 600; min-width: 40px;">${player.titolarita}%</span>
                </div>
            </td>
            <td><span style="font-weight: 500;">${player.avversario}</span></td>
            <td>
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${(player.difficolta / 20) * 100}%; background: ${
                            player.difficolta > 15 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 
                            player.difficolta > 10 ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 
                            'linear-gradient(90deg, #10b981, #059669)'
                        };"></div>
                    </div>
                    <span style="font-size: 0.9rem; font-weight: 600; min-width: 40px;">${player.difficolta}/20</span>
                </div>
            </td>
            <td>
                ${player.infortunato ? 
                    '<span class="badge badge-danger"><i class="fas fa-heartbeat"></i> Infortunato</span>' : 
                  player.disponibile ? 
                    '<span class="badge badge-success"><i class="fas fa-check-circle"></i> OK</span>' : 
                    '<span class="badge badge-warning"><i class="fas fa-exclamation-circle"></i> N/D</span>'}
            </td>
            <td>
                <button class="btn btn-primary" style="padding: 0.6rem 1rem; font-size: 0.85rem; white-space: nowrap;" 
                        onclick="event.stopPropagation(); showPlayerDetails('${player.nome}')">
                    <i class="fas fa-chart-line"></i> Dettagli
                </button>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
    updateSortButtons();
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
        
        switch(currentSortBy) {
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
            <div class="campo-player" onclick="showPlayerDetails('${player.nome}')" 
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
        <div class="formation-player" onclick="showPlayerDetails('${player.nome}')">
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
        {dif: 3, cen: 4, att: 3},
        {dif: 3, cen: 5, att: 2},
        {dif: 4, cen: 3, att: 3},
        {dif: 4, cen: 4, att: 2},
        {dif: 4, cen: 5, att: 1},
        {dif: 5, cen: 3, att: 2},
        {dif: 5, cen: 4, att: 1}
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
        moduloMigliore = {dif: 4, cen: 4, att: 2};
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
            <div style="display: inline-block; padding: 0.5rem 1rem; background: var(--warning-color); color: white; border-radius: 8px; margin-bottom: 1rem;">
                <i class="fas fa-exclamation-triangle"></i> Formazione calcolata localmente
            </div>
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
        <div class="player-card" onclick="showPlayerDetails('${player.nome}')">
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
    const player = rosa.find(p => p.nome === nomeGiocatore);
    if (!player) return;
    
    const forza = classifica.find(s => s.nome === player.squadra)?.punti || 10;
    const stats = player.stats || {};
    
    const modalHtml = `
        <div style="display: grid; gap: 1.5rem;">
            <!-- Info Principali -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div class="stat-box">
                    <i class="fas fa-user-tag" style="color: var(--primary-color); font-size: 1.5rem;"></i>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0 0.25rem;">Ruolo</p>
                    <p style="font-size: 1.2rem; font-weight: 700; margin: 0;">${ruoliMap[player.ruolo]}</p>
                </div>
                <div class="stat-box">
                    <i class="fas fa-shield-alt" style="color: var(--primary-color); font-size: 1.5rem;"></i>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0 0.25rem;">Squadra</p>
                    <p style="font-size: 1.2rem; font-weight: 700; margin: 0;">${player.squadra}</p>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">Forza: ${forza}/20</p>
                </div>
                <div class="stat-box" style="background: linear-gradient(135deg, var(--primary-color), #7c3aed);">
                    <i class="fas fa-star" style="color: white; font-size: 1.5rem;"></i>
                    <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0.25rem;">Punteggio</p>
                    <p style="font-size: 2rem; font-weight: 700; margin: 0; color: white;">${player.punteggio.toFixed(2)}</p>
                </div>
                <div class="stat-box">
                    <i class="fas fa-percentage" style="color: var(--success-color); font-size: 1.5rem;"></i>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0 0.25rem;">Titolarità</p>
                    <div style="margin-top: 0.5rem;">
                        <div style="width: 100%; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden;">
                            <div style="width: ${player.titolarita}%; height: 100%; background: var(--success-color); transition: width 0.3s;"></div>
                        </div>
                        <p style="font-size: 1.2rem; font-weight: 700; margin: 0.5rem 0 0;">${player.titolarita}%</p>
                    </div>
                </div>
            </div>
            
            <!-- Statistiche Dettagliate -->
            <div style="padding: 1.5rem; background: linear-gradient(135deg, #f0f9ff, white); border-radius: 12px; border: 2px solid var(--primary-color);">
                <h3 style="margin-bottom: 1rem; color: var(--primary-color);">
                    <i class="fas fa-chart-bar"></i> Statistiche Stagionali
                </h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                    <div class="mini-stat">
                        <i class="fas fa-futbol"></i>
                        <span class="mini-stat-label">Goals</span>
                        <span class="mini-stat-value">${stats.goals || 0}</span>
                    </div>
                    <div class="mini-stat">
                        <i class="fas fa-hands-helping"></i>
                        <span class="mini-stat-label">Assist</span>
                        <span class="mini-stat-value">${stats.assist || 0}</span>
                    </div>
                    <div class="mini-stat">
                        <i class="fas fa-clock"></i>
                        <span class="mini-stat-label">Minuti</span>
                        <span class="mini-stat-value">${stats.minuti || 0}'</span>
                    </div>
                    ${player.ruolo === 0 ? `
                        <div class="mini-stat">
                            <i class="fas fa-shield"></i>
                            <span class="mini-stat-label">Clean Sheet</span>
                            <span class="mini-stat-value">${stats.cleanSheet || 0}</span>
                        </div>
                        <div class="mini-stat">
                            <i class="fas fa-circle-notch"></i>
                            <span class="mini-stat-label">Gol Subiti</span>
                            <span class="mini-stat-value">${stats.golSubiti || 0}</span>
                        </div>
                    ` : ''}
                    <div class="mini-stat">
                        <i class="fas fa-chart-line"></i>
                        <span class="mini-stat-label">xGoals</span>
                        <span class="mini-stat-value">${(stats.xgoals || 0).toFixed(2)}</span>
                    </div>
                    <div class="mini-stat">
                        <i class="fas fa-arrow-trend-up"></i>
                        <span class="mini-stat-label">xAssist</span>
                        <span class="mini-stat-value">${(stats.xassist || 0).toFixed(2)}</span>
                    </div>
                    <div class="mini-stat">
                        <i class="fas fa-star-half-alt"></i>
                        <span class="mini-stat-label">Media Voto</span>
                        <span class="mini-stat-value">${(stats.mediaVoto || 0).toFixed(2)}</span>
                    </div>
                    <div class="mini-stat">
                        <i class="fas fa-trophy"></i>
                        <span class="mini-stat-label">Fantavoto</span>
                        <span class="mini-stat-value">${(stats.mediaFantavoto || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Prossima Partita -->
            <div style="padding: 1.5rem; background: var(--light); border-radius: 12px;">
                <h3 style="margin-bottom: 1rem;">
                    <i class="fas fa-calendar-alt"></i> Prossima Partita
                </h3>
                <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center;">
                    <div style="text-align: center;">
                        <p style="font-size: 1.5rem; font-weight: 700; margin: 0;">${player.squadra}</p>
                    </div>
                    <div style="text-align: center;">
                        <p style="font-size: 2rem; font-weight: 700; color: var(--primary-color); margin: 0;">VS</p>
                    </div>
                    <div style="text-align: center;">
                        <p style="font-size: 1.5rem; font-weight: 700; margin: 0;">${player.avversario}</p>
                        <p style="color: var(--text-secondary); margin: 0.5rem 0 0;">Difficoltà: ${player.difficolta}/20</p>
                    </div>
                </div>
            </div>
            
            <!-- Stato -->
            <div style="padding: 1.5rem; background: var(--light); border-radius: 12px;">
                <h3 style="margin-bottom: 1rem;">
                    <i class="fas fa-heartbeat"></i> Stato Attuale
                </h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${player.infortunato ? '<span class="badge badge-danger" style="font-size: 1rem; padding: 0.75rem 1.5rem;"><i class="fas fa-ambulance"></i> Infortunato</span>' : ''}
                    ${player.disponibile ? '<span class="badge badge-success" style="font-size: 1rem; padding: 0.75rem 1.5rem;"><i class="fas fa-check-circle"></i> Disponibile</span>' : 
                      '<span class="badge badge-warning" style="font-size: 1rem; padding: 0.75rem 1.5rem;"><i class="fas fa-exclamation-triangle"></i> Non disponibile</span>'}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modalPlayerName').textContent = player.nome;
    document.getElementById('modalPlayerBody').innerHTML = modalHtml;
    document.getElementById('playerModal').classList.add('active');
}


function closeModal() {
    document.getElementById('playerModal').classList.remove('active');
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
                    switch(player.ruolo) {
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
    switch(ruolo) {
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
async function salvaDati() {
    // Salva sempre in localStorage come backup
    localStorage.setItem('fantasoccerData', JSON.stringify(rosa));
    
    if (USE_BACKEND) {
        try {
            // Se vuoi implementare il salvataggio sul backend
            // const response = await fetch(`${API_BASE}?action=salva`, {
            //     method: 'POST',
            //     body: JSON.stringify({players: rosa})
            // });
            console.log('✓ Dati salvati in localStorage');
        } catch (error) {
            console.log('⚠ Backend non disponibile per il salvataggio');
        }
    }
    
    showNotification('Dati salvati con successo!', 'success');
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
        switch(type) {
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
function handleStatsImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
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
                const infortunato = fields[13].trim() === '1';
                const avversario = fields[14].trim();
                
                let ruolo;
                switch(ruoloChar.toUpperCase()) {
                    case 'P': ruolo = 0; break;
                    case 'D': ruolo = 1; break;
                    case 'C': ruolo = 2; break;
                    case 'A': ruolo = 3; break;
                    default: continue;
                }
                
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
                    // AGGIUNGI STATISTICHE
                    stats: {
                        goals: goals,
                        assist: assist,
                        minuti: minuti,
                        cleanSheet: cleanSheet,
                        golSubiti: golSubiti,
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
                showNotification(`✓ ${successCount} giocatori importati!`, 'success');
            }
            
        } catch (error) {
            console.error('Errore import:', error);
            showNotification('Errore nell\'importazione: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = '';
}


// IMPORT CLASSIFICA - Versione CORRETTA
function handleClassificaImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
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
    
    reader.onerror = function() {
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
    reader.onload = function(e) {
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
    const playerNome = select.value;
    
    if (!playerNome) {
        document.getElementById('editPlayerForm').style.display = 'none';
        return;
    }
    
    currentEditPlayer = rosa.find(p => p.nome === playerNome);
    if (!currentEditPlayer) return;
    
    // Popola i campi
    document.getElementById('editNome').value = currentEditPlayer.nome;
    document.getElementById('editSquadra').value = currentEditPlayer.squadra;
    document.getElementById('editTitolarita').value = currentEditPlayer.titolarita;
    
    // Popola dropdown avversari
    const avversarioSelect = document.getElementById('editAvversario');
    avversarioSelect.innerHTML = classifica.map(s => 
        `<option value="${s.nome}" ${s.nome === currentEditPlayer.avversario ? 'selected' : ''}>${s.nome}</option>`
    ).join('');
    
    // Stato
    const stato = currentEditPlayer.infortunato ? 'infortunato' : 
                  currentEditPlayer.disponibile ? 'disponibile' : 'squalificato';
    document.getElementById('editStato').value = stato;
    
    // Statistiche
    if (currentEditPlayer.stats) {
        document.getElementById('editGoals').value = currentEditPlayer.stats.goals || 0;
        document.getElementById('editAssist').value = currentEditPlayer.stats.assist || 0;
        document.getElementById('editMinuti').value = currentEditPlayer.stats.minuti || 0;
        document.getElementById('editMediaVoto').value = currentEditPlayer.stats.mediaVoto || 0;
        document.getElementById('editMediaFantavoto').value = currentEditPlayer.stats.mediaFantavoto || 0;
        // Dopo editMediaFantavoto
document.getElementById('editCleanSheet').value = stats.cleanSheet || 0;
document.getElementById('editGolSubiti').value = stats.golSubiti || 0;
document.getElementById('editXgoals').value = (stats.xgoals || 0).toFixed(2);
document.getElementById('editXassist').value = (stats.xassist || 0).toFixed(2);

    }
    
    document.getElementById('editPlayerForm').style.display = 'block';
}

function savePlayerEdit() {
    if (!currentEditPlayer) return;
    
    // Aggiorna dati
    currentEditPlayer.squadra = document.getElementById('editSquadra').value;
    currentEditPlayer.titolarita = parseFloat(document.getElementById('editTitolarita').value);
    currentEditPlayer.avversario = document.getElementById('editAvversario').value;
    
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
function renderClassificaEditor() {
    const container = document.getElementById('classificaEditor');
    
    if (!container) {
        console.error('❌ Container classificaEditor non trovato!');
        return;
    }
    
    // FORZA VISIBILITÀ
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    
    if (!classifica || classifica.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nessuna classifica disponibile</p>';
        return;
    }
    
    // ... resto del codice esistente ...
    
    console.log('✅ HTML inserito. Lunghezza:', container.innerHTML.length);
}

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
showSection = function(sectionId) {
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

function updateSortButtons() {
    // Trova tutti i pulsanti nella sezione rosa
    const buttons = document.querySelectorAll('#rosa .btn-primary');
    
    // Rimuovi stato attivo da tutti
    buttons.forEach(btn => {
        btn.style.background = 'var(--primary-color)';
        btn.style.fontWeight = 'normal';
    });
    
    // Mappa dei pulsanti per indice
    const buttonMap = {
        'punteggio': 0,
        'ruolo': 1,
        'nome': 2,
        'squadra': 3,
        'titolarita': 4
    };
    
    const activeIndex = buttonMap[currentSortBy];
    if (activeIndex !== undefined && buttons[activeIndex]) {
        buttons[activeIndex].style.background = 'var(--success-color)';
        buttons[activeIndex].style.fontWeight = '700';
    }
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
let currentPage = 1;
let itemsPerPage = 15;
let filteredRosa = [];
let currentRoleFilter = 'all';

function renderRosa() {
    const tbody = document.getElementById('rosaTableBody');
    
    if (!tbody) {
        console.error('Elemento rosaTableBody non trovato!');
        return;
    }
    
    if (rosa.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
                        <i class="fas fa-users" style="font-size: 3rem; color: var(--text-secondary);"></i>
                        <p style="color: var(--text-secondary); margin: 0;">Nessun giocatore nella rosa.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Applica filtro ruolo
    filteredRosa = currentRoleFilter === 'all' ? 
        [...rosa] : 
        rosa.filter(p => p.ruolo === parseInt(currentRoleFilter));
    
    // Applica ordinamento
    filteredRosa.sort((a, b) => {
        let valueA, valueB;
        
        switch(currentSortBy) {
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
    
    // Calcola paginazione
    const totalPages = Math.ceil(filteredRosa.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRosa = filteredRosa.slice(startIndex, endIndex);
    
    // Renderizza righe
    const html = paginatedRosa.map((player, index) => {
        const actualIndex = startIndex + index + 1;
        return `
            <tr onclick="showPlayerDetails('${player.nome}')">
                <td style="color: var(--text-secondary); font-weight: 600;">#${actualIndex}</td>
                <td><strong style="font-size: 1.05rem;">${player.nome}</strong></td>
                <td><span class="badge badge-info">${ruoliMap[player.ruolo]}</span></td>
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
                            onclick="event.stopPropagation(); showPlayerDetails('${player.nome}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = html;
    renderPagination(totalPages);
    updateSortButtons();
}

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
    html += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Pulsanti numerici
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages <= 5 || i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span style="padding: 0 0.5rem;">...</span>`;
        }
    }
    
    // Pulsante successivo
    html += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    controls.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredRosa.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderRosa();
}

function changeItemsPerPage(value) {
    itemsPerPage = parseInt(value);
    currentPage = 1;
    renderRosa();
}

function filterByRole(role) {
    currentRoleFilter = role;
    currentPage = 1;
    renderRosa();
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
        
        switch(currentSortBy) {
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
        <tr onclick="showPlayerDetails('${player.nome}')">
            <td style="color: var(--text-secondary); font-weight: 600;">#${index + 1}</td>
            <td><strong style="font-size: 1.05rem;">${player.nome}</strong></td>
            <td><span class="badge badge-info">${ruoliMap[player.ruolo]}</span></td>
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
                        onclick="event.stopPropagation(); showPlayerDetails('${player.nome}')">
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
    // Rimuovi stato attivo da tutti i pulsanti
    document.querySelectorAll('#rosa .btn-primary').forEach(btn => {
        btn.style.background = 'var(--primary-color)';
        btn.style.fontWeight = 'normal';
    });
    
    // Trova il pulsante attivo e evidenzialo
    const buttons = {
        'punteggio': 0,
        'ruolo': 1,
        'nome': 2,
        'squadra': 3,
        'titolarita': 4
    };
    
    const activeIndex = buttons[currentSortBy];
    if (activeIndex !== undefined) {
        const activeBtn = document.querySelectorAll('#rosa .btn-primary')[activeIndex];
        if (activeBtn) {
            activeBtn.style.background = 'var(--success-color)';
            activeBtn.style.fontWeight = '700';
            
            // Aggiungi freccia per indicare direzione
            const icon = activeBtn.querySelector('i');
            if (icon) {
                icon.className = currentSortDirection === 'asc' ? 
                    'fas fa-sort-amount-up' : 'fas fa-sort-amount-down';
            }
        }
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
document.addEventListener('DOMContentLoaded', function() {
    const calcPunteggiBtn = document.getElementById('calcPunteggi');
    if (calcPunteggiBtn) {
        calcPunteggiBtn.addEventListener('click', function() {
            if (confirm('⚠️ Ricalcolare i punteggi di tutti i giocatori?\n\nQuesta operazione sovrascriverà i punteggi attuali.')) {
                calcolaPunteggi();
            }
        });
    }
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
});

// Carica giocatore per modifica
function loadPlayerForEdit() {
    const select = document.getElementById('editPlayerSelect');
    const selectedName = select.value;
    
    if (!selectedName) {
        document.getElementById('editPlayerForm').style.display = 'none';
        return;
    }
    
    const player = rosa.find(p => p.nome === selectedName);
    if (!player) return;
    
    // Mostra form
    document.getElementById('editPlayerForm').style.display = 'block';
    
    // Popola campi base
    document.getElementById('editNome').value = player.nome;
    document.getElementById('editSquadra').value = player.squadra;
    document.getElementById('editTitolarita').value = player.titolarita;
    
    // Popola select avversari
    const avvSelect = document.getElementById('editAvversario');
    avvSelect.innerHTML = classifica.map(team => 
        `<option value="${team.nome}" ${team.nome === player.avversario ? 'selected' : ''}>${team.nome}</option>`
    ).join('');
    
    // Imposta stato
    if (player.infortunato) {
        document.querySelector('input[value="infortunato"]').checked = true;
    } else if (player.disponibile) {
        document.querySelector('input[value="disponibile"]').checked = true;
    } else {
        document.querySelector('input[value="squalificato"]').checked = true;
    }
    
    // Popola TUTTE le statistiche
    const stats = player.stats || {};
    document.getElementById('editGoals').value = stats.goals || 0;
    document.getElementById('editAssist').value = stats.assist || 0;
    document.getElementById('editMinuti').value = stats.minuti || 0;
    document.getElementById('editCleanSheet').value = stats.cleanSheet || 0;
    document.getElementById('editGolSubiti').value = stats.golSubiti || 0;
    document.getElementById('editXgoals').value = (stats.xgoals || 0).toFixed(2);
    document.getElementById('editXassist').value = (stats.xassist || 0).toFixed(2);
    document.getElementById('editMediaVoto').value = (stats.mediaVoto || 0).toFixed(2);
    document.getElementById('editMediaFantavoto').value = (stats.mediaFantavoto || 0).toFixed(2);
    
    // Scroll al form
    document.getElementById('editPlayerForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// Salva modifiche giocatore
function savePlayerEdit() {
    const nome = document.getElementById('editNome').value;
    const player = rosa.find(p => p.nome === nome);
    
    if (!player) return;
    
    // Aggiorna dati base
    player.squadra = document.getElementById('editSquadra').value;
    player.titolarita = parseFloat(document.getElementById('editTitolarita').value);
    player.avversario = document.getElementById('editAvversario').value;
    
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
            <tr id="team-${index}" style="border-bottom: 1px solid #e5e7eb; transition: all 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
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
                                onclick="moveTeam(${index}, 'up')" 
                                ${isFirst ? 'disabled' : ''}
                                style="width: 40px; height: 40px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; ${isFirst ? 'background: #e5e7eb; color: #9ca3af; cursor: not-allowed;' : 'background: var(--success-color); color: white;'}"
                                title="Sposta su">
                            <i class="fas fa-arrow-up" style="font-size: 1.2rem;"></i>
                        </button>
                        <button class="btn-arrow" 
                                onclick="moveTeam(${index}, 'down')" 
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
                    <p style="margin: 0; font-size: 0.9rem;">Usa le frecce <i class="fas fa-arrow-up" style="color: var(--success-color);"></i> <i class="fas fa-arrow-down" style="color: var(--danger-color);"></i> per riordinare le squadre. La posizione determina la forza e la difficoltà delle partite.</p>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // FORZA VISIBILITÀ
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    
    console.log('✅ Classifica editor renderizzato e visibile');
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
document.addEventListener('DOMContentLoaded', function() {
    // ... altre inizializzazioni ...
    initGestioneSection();
});
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
                                 onclick="showPlayerDetails('${player.nome}')" 
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

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    // Crea overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Toggle sidebar
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }
    
    // Chiudi con overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Chiudi quando clicchi un link della sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
});
// ============================================
// WIZARD SETUP PRIMO ACCESSO
// ============================================

const DEFAULT_CLASSIFICA = [
    {nome: "Milan", punti: 20},
    {nome: "Napoli", punti: 19},
    {nome: "Inter", punti: 18},
    {nome: "Roma", punti: 17},
    {nome: "Juventus", punti: 16},
    {nome: "Atalanta", punti: 15},
    {nome: "Bologna", punti: 14},
    {nome: "Lazio", punti: 13},
    {nome: "Como", punti: 12},
    {nome: "Fiorentina", punti: 11},
    {nome: "Torino", punti: 10},
    {nome: "Udinese", punti: 9},
    {nome: "Genoa", punti: 8},
    {nome: "Cagliari", punti: 7},
    {nome: "Parma", punti: 6},
    {nome: "Sassuolo", punti: 5},
    {nome: "Lecce", punti: 4},
    {nome: "Cremonese", punti: 3},
    {nome: "Verona", punti: 2},
    {nome: "Pisa", punti: 1}
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
    const hasData = localStorage.getItem('fantacalcio_rosa');
    
    if (!hasData) {
        // Carica classifica predefinita se non esiste
        if (!localStorage.getItem('fantacalcio_classifica')) {
            classifica = DEFAULT_CLASSIFICA;
            localStorage.setItem('fantacalcio_classifica', JSON.stringify(classifica));
        }
        showSetupWizard();
        return true;
    }
    return false;
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
                    
                    <button class="btn btn-primary" onclick="showWizardStep(2)" style="width: 100%; padding: 1.25rem; font-size: 1.1rem;">
                        <i class="fas fa-arrow-right"></i> Inizia Setup
                    </button>
                </div>
                
                <!-- Step 2: Scelta metodo -->
                <div id="wizardStep2" class="wizard-step" style="display: none;">
                    <h2 style="color: var(--primary-color); margin-bottom: 1.5rem;">
                        <i class="fas fa-users"></i> Come vuoi creare la rosa?
                    </h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0;">
                        <div onclick="selectImportMethod('csv')" class="method-card" style="cursor: pointer; padding: 2rem; border: 3px solid #e5e7eb; border-radius: 12px; text-align: center; transition: all 0.3s;">
                            <i class="fas fa-file-csv" style="font-size: 3rem; color: var(--success-color); margin-bottom: 1rem;"></i>
                            <h3 style="margin-bottom: 0.5rem;">Importa CSV</h3>
                            <p style="color: var(--text-secondary); font-size: 0.9rem;">Carica file con tutti i dati</p>
                        </div>
                        
                        <div onclick="selectImportMethod('manual')" class="method-card" style="cursor: pointer; padding: 2rem; border: 3px solid #e5e7eb; border-radius: 12px; text-align: center; transition: all 0.3s;">
                            <i class="fas fa-plus-circle" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                            <h3 style="margin-bottom: 0.5rem;">Aggiungi Manualmente</h3>
                            <p style="color: var(--text-secondary); font-size: 0.9rem;">Inserisci giocatori uno per uno</p>
                        </div>
                    </div>
                    
                    <button class="btn" onclick="showWizardStep(1)" style="width: 100%; margin-top: 1rem;">
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
                        <button class="btn" onclick="showWizardStep(2)" style="flex: 1;">Indietro</button>
                        <button class="btn btn-success" id="wizardFinishCSV" disabled onclick="finishWizard()" style="flex: 2;">Completa</button>
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

                        
                        <button type="button" onclick="addPlayerManual()" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; padding: 1rem;">
                            <i class="fas fa-plus"></i> Aggiungi Giocatore
                        </button>
                    </form>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn" onclick="showWizardStep(2)" style="flex: 1;">Indietro</button>
                        <button class="btn btn-success" id="wizardFinishManual" onclick="finishWizardManual()" style="flex: 2;" disabled>
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
            golSubiti: parseInt(document.getElementById('playerGolSubiti').value) || 0
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
            <button onclick="removePlayer(${i})" class="btn btn-sm" style="background: var(--danger-color); color: white; padding: 0.5rem;"><i class="fas fa-trash"></i></button>
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
    localStorage.setItem('fantacalcio_rosa', JSON.stringify({players: rosa}));
    localStorage.setItem('fantacalcio_setup_completed', 'true');
    
    downloadRosa();
    document.getElementById('setupWizard').remove();
    showNotification(`✅ Rosa creata! File scaricato.`, 'success');
    location.reload();
}

function downloadRosa() {
    const blob = new Blob([JSON.stringify({players: rosa}, null, 2)], {type: 'application/json'});
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
document.addEventListener('change', function(e) {
    if (e.target.id === 'wizardStatsCSV') {
        handleWizardStatsCSV(e.target.files[0]);
    }
});

async function handleWizardStatsCSV(file) {
    try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        const dataLines = lines.slice(1);
        
        rosa = [];
        dataLines.forEach(line => {
            const parts = line.split(';').map(p => p.trim());
            if (parts.length < 15) return;
            
            const [nome, squadra, ruoloStr, goals, assist, minuti, cleanSheet, golSubiti, 
                   xgoals, xassist, mediaVoto, mediaFantavoto, titolarita, infortunatoStr, avversario] = parts;
            
            let ruolo = 0;
            if (ruoloStr === 'D') ruolo = 1;
            else if (ruoloStr === 'C') ruolo = 2;
            else if (ruoloStr === 'A') ruolo = 3;
            
            rosa.push({
                nome, squadra, ruolo,
                punteggio: 0,
                titolarita: parseFloat(titolarita) || 0,
                avversario, difficolta: 10,
                infortunato: infortunatoStr.toLowerCase() === 'true',
                disponibile: infortunatoStr.toLowerCase() !== 'true',
                stats: {
                    goals: parseInt(goals) || 0,
                    assist: parseInt(assist) || 0,
                    minuti: parseInt(minuti) || 0,
                    cleanSheet: parseInt(cleanSheet) || 0,
                    golSubiti: parseInt(golSubiti) || 0,
                    xgoals: parseFloat(xgoals) || 0,
                    xassist: parseFloat(xassist) || 0,
                    mediaVoto: parseFloat(mediaVoto) || 0,
                    mediaFantavoto: parseFloat(mediaFantavoto) || 0
                }
            });
        });
        
        localStorage.setItem('fantacalcio_rosa', JSON.stringify({players: rosa}));
        document.getElementById('wizardFinishCSV').disabled = false;
        showNotification(`✅ ${rosa.length} giocatori caricati!`, 'success');
    } catch (error) {
        console.error('Errore CSV:', error);
        showNotification('❌ Errore import CSV', 'error');
    }
}
// ============================================
// MOBILE MENU
// ============================================

// Mostra pulsante hamburger su mobile
window.addEventListener('resize', checkMobileMenu);
window.addEventListener('load', checkMobileMenu);

function checkMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    if (window.innerWidth <= 768) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
        closeMobileMenu();
    }
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Blocca scroll quando menu aperto
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Chiudi menu quando si clicca su una voce
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });
});
// ============================================
// MOBILE MENU
// ============================================

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const btn = document.getElementById('mobileMenuBtn');
    
    if (!sidebar || !overlay || !btn) {
        console.error('Elementi menu mobile non trovati!');
        return;
    }
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Cambia icona
    const icon = btn.querySelector('i');
    if (sidebar.classList.contains('active')) {
        icon.className = 'fas fa-times';
        document.body.style.overflow = 'hidden';
    } else {
        icon.className = 'fas fa-bars';
        document.body.style.overflow = 'auto';
    }
}

// Chiudi menu quando si clicca su una voce
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebarOverlay');
                const btn = document.getElementById('mobileMenuBtn');
                
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    
                    const icon = btn.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                    
                    document.body.style.overflow = 'auto';
                }
            }
        });
    });
});

// Gestisci resize finestra
window.addEventListener('resize', function() {
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
