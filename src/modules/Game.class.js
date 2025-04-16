'use strict';

export class Game {
  constructor() {
    this._size = 4;
    this._board = [];
    this._score = 0;
    this._status = 'idle'; // 'idle', 'inProgress', 'win', 'lose'
    this.restart();
  }

  restart() {
    Array.from({ length: this._size }, () => Array(this._size).fill(0));

    this._score = 0;
    this._status = 'inProgress';
    this._addRandomTile();
    this._addRandomTile();
  }

  getState() {
    return this._board.map((row) => [...row]);
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

  moveLeft() {
    if (this._status !== 'inProgress') {
      return;
    }

    const moved = this._move((row) => row);

    if (moved) {
      this._afterMove();
    }
  }

  moveRight() {
    if (this._status !== 'inProgress') {
      return;
    }

    const moved = this._move((row) => row.reverse(), true);

    if (moved) {
      this._afterMove();
    }
  }

  moveUp() {
    if (this._status !== 'inProgress') {
      return;
    }

    const moved = this._moveColumns((col) => col);

    if (moved) {
      this._afterMove();
    }
  }

  moveDown() {
    if (this._status !== 'inProgress') {
      return;
    }

    const moved = this._moveColumns((col) => col.reverse(), true);

    if (moved) {
      this._afterMove();
    }
  }

  _afterMove() {
    this._addRandomTile();

    if (this._checkWin()) {
      this._status = 'win';
    } else if (!this._canMove()) {
      this._status = 'lose';
    }
  }

  _move(transformFn, reverseBack = false) {
    let moved = false;

    for (let i = 0; i < this._size; i++) {
      let row = [...this._board[i]];

      row = transformFn(row);

      const { newRow, score: gained } = this._mergeRow(row);
      const finalRow = reverseBack ? newRow.reverse() : newRow;

      if (!this._arraysEqual(this._board[i], finalRow)) {
        this._board[i] = finalRow;
        this._score += gained;
        moved = true;
      }
    }

    return moved;
  }

  _moveColumns(transformFn, reverseBack = false) {
    let moved = false;

    for (let col = 0; col < this._size; col++) {
      let column = [];

      for (let row = 0; row < this._size; row++) {
        column.push(this._board[row][col]);
      }

      column = transformFn(column);

      const { newRow: mergedCol, score: gained } = this._mergeRow(column);
      const finalCol = reverseBack ? mergedCol.reverse() : mergedCol;

      for (let row = 0; row < this._size; row++) {
        if (this._board[row][col] !== finalCol[row]) {
          this._board[row][col] = finalCol[row];
          moved = true;
        }
      }

      this._score += gained;
    }

    return moved;
  }

  _mergeRow(row) {
    const nonZero = row.filter((n) => n !== 0);
    const merged = [];
    let i = 0;
    let score = 0;

    while (i < nonZero.length) {
      if (nonZero[i] === nonZero[i + 1]) {
        const mergedValue = nonZero[i] * 2;

        merged.push(mergedValue);
        score += mergedValue;
        i += 2;
      } else {
        merged.push(nonZero[i]);
        i++;
      }
    }

    while (merged.length < this._size) {
      merged.push(0);
    }

    return { newRow: merged, score };
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this._size; r++) {
      for (let c = 0; c < this._size; c++) {
        if (this._board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this._board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  _checkWin() {
    return this._board.some((row) => row.includes(2048));
  }

  _canMove() {
    for (let row = 0; row < this._size; row++) {
      for (let col = 0; col < this._size; col++) {
        const curr = this._board[row][col];

        if (curr === 0) {
          return true;
        }

        if (
          (col < this._size - 1 && this._board[row][col + 1] === curr) ||
          (row < this._size - 1 && this._board[row + 1][col] === curr)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  _arraysEqual(a, b) {
    return a.every((val, i) => val === b[i]);
  }
}
