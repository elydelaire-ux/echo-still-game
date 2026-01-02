import './style.css'
import { Engine } from './game/Engine'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <canvas id="gameCanvas"></canvas>
`

const canvas = document.querySelector<HTMLCanvasElement>('#gameCanvas')!
// Set a fixed internal resolution for consistency, scale with CSS
canvas.width = 800; // 4:3 Aspect roughly, or 16:9 
canvas.height = 450;

// Simple resize handler to fit window (optional)
function resize() {
  const scale = Math.min(window.innerWidth / canvas.width, window.innerHeight / canvas.height);
  canvas.style.width = `${canvas.width * scale * 0.9}px`;
  canvas.style.height = `${canvas.height * scale * 0.9}px`;
}
window.addEventListener('resize', resize);
resize();

const engine = new Engine(canvas);
engine.start();
