// Renders the brand wordmark as themable blocks and plays one of three intros.
// The brand SVG is a pure pixel grid (81 x 19 cells of rects), so the exact
// wordmark can be rebuilt from CSS-colored blocks — which means every theme
// recolors the logo, and the intro can move the pixels around.

const SVG_URL = '/public/site/images/brand/omarchy-wordmark.svg';
const CELL_W = 51;
const CELL_H = 50;

async function loadRuns() {
  const text = await fetch(SVG_URL).then((response) => response.text());
  const svg = new DOMParser().parseFromString(text, 'image/svg+xml');
  const [, , width, height] = svg.documentElement.getAttribute('viewBox').split(' ').map(Number);
  const cols = Math.round(width / CELL_W);
  const rows = Math.round(height / CELL_H);
  const runs = [...svg.querySelectorAll('rect')].map((rect) => ({
    col: Math.round(Number(rect.getAttribute('x')) / CELL_W),
    row: Math.round(Number(rect.getAttribute('y')) / CELL_H),
    span: Math.round(Number(rect.getAttribute('width')) / CELL_W),
  }));
  return { cols, rows, runs };
}

function place(el, col, row, span, cols, rows) {
  el.style.left = `${(col / cols) * 100}%`;
  el.style.top = `${(row / rows) * 100}%`;
  el.style.width = `${(span / cols) * 100}%`;
  el.style.height = `${(1 / rows) * 100}%`;
}

// Tetris: split each horizontal run into pieces of at most four cells and
// drop them in, bottom rows first, with a little scatter in the timing.
function fall(container, { cols, rows, runs }) {
  for (const run of runs) {
    for (let start = 0; start < run.span; start += 4) {
      const span = Math.min(4, run.span - start);
      const piece = document.createElement('i');
      piece.className = 'wm-piece wm-piece--fall';
      place(piece, run.col + start, run.row, span, cols, rows);
      const delay = (rows - 1 - run.row) * 90 + Math.random() * 260;
      piece.style.setProperty('--delay', `${delay}ms`);
      piece.style.setProperty('--drop', `${40 + Math.random() * 40}vh`);
      container.append(piece);
    }
  }
  container.dataset.introDuration = String(rows * 90 + 900);
}

// Letters: contiguous occupied column ranges. Each letter slides in from an
// alternating side with a CRT flicker, then locks.
function slide(container, { cols, rows, runs }) {
  const occupied = new Array(cols).fill(false);
  for (const run of runs) {
    for (let c = run.col; c < run.col + run.span; c += 1) occupied[c] = true;
  }
  const letters = [];
  let start = null;
  for (let c = 0; c <= cols; c += 1) {
    if (occupied[c] && start === null) start = c;
    if (!occupied[c] && start !== null) {
      letters.push({ start, end: c });
      start = null;
    }
  }
  letters.forEach((letter, index) => {
    const box = document.createElement('span');
    box.className = 'wm-letter';
    box.style.left = `${(letter.start / cols) * 100}%`;
    box.style.width = `${((letter.end - letter.start) / cols) * 100}%`;
    box.style.setProperty('--from', index % 2 === 0 ? '-120vw' : '120vw');
    box.style.setProperty('--delay', `${index * 140}ms`);
    const width = letter.end - letter.start;
    for (const run of runs) {
      if (run.col < letter.start || run.col >= letter.end) continue;
      const cell = document.createElement('i');
      cell.className = 'wm-piece';
      place(cell, run.col - letter.start, run.row, run.span, width, rows);
      box.append(cell);
    }
    container.append(box);
  });
  container.dataset.introDuration = String(letters.length * 140 + 900);
}

// Rise: rows light up from the bottom, a quiet etch.
function rise(container, { cols, rows, runs }) {
  for (const run of runs) {
    const piece = document.createElement('i');
    piece.className = 'wm-piece wm-piece--rise';
    place(piece, run.col, run.row, run.span, cols, rows);
    piece.style.setProperty('--delay', `${(rows - 1 - run.row) * 60 + run.col * 6}ms`);
    container.append(piece);
  }
  container.dataset.introDuration = String(rows * 60 + cols * 6 + 600);
}

const INTROS = { fall, slide, rise };

document.addEventListener('DOMContentLoaded', async () => {
  const containers = document.querySelectorAll('.wordmark');
  if (containers.length === 0) return;
  const grid = await loadRuns();
  for (const container of containers) {
    container.style.aspectRatio = `${grid.cols * CELL_W} / ${grid.rows * CELL_H}`;
    const intro = INTROS[container.dataset.intro] ?? rise;
    intro(container, grid);
    const total = Number(container.dataset.introDuration);
    window.setTimeout(() => document.documentElement.classList.add('intro-done'), total);
  }
});
