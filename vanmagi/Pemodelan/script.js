const G = 6.67430e-11; 
const M = 5.972e24; 
const dt = 10; 
const SCALE = 1e-5; 


const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;


const positionIndicator = document.getElementById('positionIndicator');


const earthRadius = 6371e3 * SCALE; 

let position = { x: 0, y: 1.0e7 }; 
let velocity = { x: 7.8e3, y: 0 }; 
let trail = [];

function gravity(pos) {
    const r = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    const accel = -G * M / Math.pow(r, 3);
    return { 
        ax: accel * pos.x, 
        ay: accel * pos.y 
    };
}

function euler(pos, vel, dt) {
    const a = gravity(pos);
    const newVel = {
        x: vel.x + a.ax * dt,
        y: vel.y + a.ay * dt
    };
    const newPos = {
        x: pos.x + vel.x * dt,
        y: pos.y + vel.y * dt
    };
    return { newPos, newVel };
}

function drawEarth() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, earthRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#3366FF';
    ctx.fill();
    ctx.closePath();
}


function drawObject(pos) {
    const canvasX = centerX + pos.x * SCALE;
    const canvasY = centerY - pos.y * SCALE; 
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 8, 0, 2 * Math.PI); 
    ctx.fillStyle = '#FF3333';
    ctx.fill();
    ctx.closePath();

    positionIndicator.innerText = `Posisi Satelit: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}) m`;
}

function drawTrail() {
    if (trail.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(centerX + trail[0].x * SCALE, centerY - trail[0].y * SCALE);
    for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(centerX + trail[i].x * SCALE, centerY - trail[i].y * SCALE);
    }
    ctx.strokeStyle = '#FFCC00';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEarth();
    drawTrail();
    drawObject(position);
    console.log(`Rendering posisi: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}) m`);
}

function resetSimulation() {
    position = { x: 0, y: 1.0e7 }; // Memulai dari jarak 1.0e7 m (100 piksel)
    velocity = { x: 7.8e3, y: 0 };
    running = false;
    trail = [{ x: position.x, y: position.y }]; // Mulai jejak
    render();
    console.log('Simulasi di-reset:', position, velocity);
}

function simulate() {
    if (!running) return;
    const stepsPerFrame = 10;
    for (let i = 0; i < stepsPerFrame; i++) {
        const result = euler(position, velocity, dt);
        position = result.newPos;
        velocity = result.newVel;
        trail.push({ x: position.x, y: position.y });
        // Batasi panjang jejak
        if (trail.length > 1000) {
            trail.shift();
        }
    }

    render();
    requestAnimationFrame(simulate);
}

// Event Listeners
document.getElementById('startButton').addEventListener('click', () => {
    if (!running) {
        running = true;
        simulate();
        console.log('Simulasi dimulai');
    }
});

document.getElementById('resetButton').addEventListener('click', () => {
    resetSimulation();
    console.log('Simulasi di-reset melalui tombol');
});

// Inisialisasi
resetSimulation();
