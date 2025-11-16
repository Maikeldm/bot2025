// central_worker_manager.js
const { Worker } = require('worker_threads');
const path = require('path');
const os = require('os');

// ¡MÁXIMA VELOCIDAD! 6 Hilos para tus 6 vCPUs
const NUM_WORKERS = 7; 
console.log(`[JEFE DE COCINA] Iniciando Cocina Central con ${NUM_WORKERS} Chefs...`);

async function startKitchen() {

    for (let i = 0; i < NUM_WORKERS; i++) {
        launchWorker(i + 1); // Lanza un chef
    }
}

function launchWorker(id) {
    const worker = new Worker(path.resolve(__dirname, 'central_worker.js'), {
        workerData: { workerId: id }
    });
    
    // Monitoreo: Si un Chef muere, lo reemplazamos
    worker.on('error', (err) => {
        console.error(`[ERROR CHEF ${id}]`, err);
        console.warn(`[JEFE DE COCINA] Chef ${id} murió. Reemplazando...`);
        launchWorker(id);
    });
    
    worker.on('exit', (code) => {
        if (code !== 0) {
            console.warn(`[JEFE DE COCINA] Chef ${id} salió (code ${code}). Reemplazando...`);
            launchWorker(id);
        }
    });
}

startKitchen();