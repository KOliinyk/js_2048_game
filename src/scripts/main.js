'use strict';

import { Game } from '../modules/Game.class.js';

const boardElement = document.querySelector('.field');
const scoreElement = document.querySelector('.score');
const statusElement = document.querySelector('.status');
const startButton = document.querySelector('.start');

const game = new Game();

function updateUI() {
  const state = game.getState();

  boardElement.innerHTML = '';

  for (const row of state) {
    for (const cell of row) {
      const div = document.createElement('div');

      div.className = 'field-cell';

      if (cell !== 0) {
        div.classList.add(`field-cell--${cell}`);
        div.textContent = cell;
      }
      boardElement.appendChild(div);
    }
  }

  scoreElement.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    statusElement.textContent = 'You win!';
    statusElement.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    statusElement.textContent = 'Game over!';
    statusElement.classList.remove('hidden');
  } else {
    statusElement.classList.add('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'inProgress') {
    return;
  }

  const keyMap = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (keyMap[e.key]) {
    keyMap[e.key]();
    updateUI();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }
});

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
});
