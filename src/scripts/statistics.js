import CardsData from './cards.data';

export default class Statistics {
  constructor() {
    this.tableElem = document.querySelector('.statistics');
    this.tableHeader = document.querySelector('.thead');
    this.resetBtn = document.querySelector('.reset');
    this.isSortAbc = false;
  }

  init() {
    document.querySelectorAll('.tr').forEach((e) => {
      e.remove();
    });

    this.createRows();
    this.tableHeader.addEventListener('click', (event) => {
      let elem = event.target;
      if (event.target.classList.contains('arrow')) {
        elem = event.target.parentNode;
      }
      const index = Array.from(elem.parentNode.children).indexOf(elem);
      if (index || index === 0) {
        this.sortRows(index);
      }
    });

    const trainedColumn = document.querySelectorAll('.trained');
    const correctColumn = document.querySelectorAll('.correct');
    const incorrectColumn = document.querySelectorAll('.incorrect');
    const percentColumn = document.querySelectorAll('.percent');

    this.resetBtn.addEventListener('click', () => {
      trainedColumn.forEach((e) => {
        e.textContent = '0';
      });
      correctColumn.forEach((e) => {
        e.textContent = '0';
      });
      incorrectColumn.forEach((e) => {
        e.textContent = '0';
      });
      percentColumn.forEach((e) => {
        e.textContent = '0';
      });
      localStorage.clear();
    });
  }

  createRows() {
    const appendElems = (elem, row, className) => {
      if (elem) {
        const data = document.createElement('td');
        data.classList.add(className);
        data.classList.add('td');
        row.append(data);
        data.innerText = elem.charAt(0).toUpperCase() + elem.slice(1);
      }
    };

    const difficultWords = [];

    let i = 0;
    Object.values(CardsData).forEach((category) => {
      category.forEach((card) => {
        if (typeof card === 'string') {
          return;
        }
        const row = document.createElement('tr');
        row.classList.add('tr');
        this.tableElem.append(row);
        appendElems(category[category.length - 1], row);
        appendElems(card.word, row);
        appendElems(card.translation, row);

        let correct = 0;
        let incorrect = 0;

        if (JSON.parse(localStorage.getItem('trained'))) {
          const arrTrained = JSON.parse(localStorage.getItem('trained'));
          appendElems(`${arrTrained[i]}`, row, 'trained');
        } else {
          appendElems('0', row, 'trained');
        }

        if (JSON.parse(localStorage.getItem('correct'))) {
          const arrCorrect = JSON.parse(localStorage.getItem('correct'));
          appendElems(`${arrCorrect[i]}`, row, 'correct');
          correct = arrCorrect[i];
        } else {
          appendElems('0', row, 'correct');
        }

        if (JSON.parse(localStorage.getItem('incorrect'))) {
          const arrIncorrect = JSON.parse(localStorage.getItem('incorrect'));
          appendElems(`${arrIncorrect[i]}`, row, 'incorrect');
          incorrect = arrIncorrect[i];
        } else {
          appendElems('0', row, 'incorrect');
        }

        let percent = 0;
        if (correct) {
          percent = Math.round((correct / (correct + incorrect)) * 100);
        }

        if (percent > 0 && percent < 100) {
          const newCard = {};
          Object.assign(newCard, card);
          newCard.percentAnswer = percent;
          difficultWords.push(newCard);
        }

        appendElems(`${percent}`, row, 'percent');
        i += 1;
      });
    });

    localStorage.setItem('difficult-words', JSON.stringify(difficultWords));
  }

  sortRows(ind) {
    const arrow = document.querySelectorAll('.arrow');
    let sortedRows = [];
    if (ind < 3) {
      sortedRows = Array.from(this.tableElem.rows)
        .slice(1)
        .sort((rowA, rowB) => {
          const x = rowA.cells[ind].innerHTML > rowB.cells[ind].innerHTML ? 1 : -1;
          return x;
        });
    } else {
      sortedRows = Array.from(this.tableElem.rows)
        .slice(1)
        .sort((rowA, rowB) => {
          const a = +(rowA.cells[ind].textContent);
          const b = +(rowB.cells[ind].textContent);
          const x = a > b ? 1 : -1;
          return x;
        });
    }

    if (this.isSortAbc === false) {
      this.isSortAbc = true;
      this.tableElem.tBodies[0].append(...sortedRows);
      arrow.forEach((e) => {
        e.classList.add('rotate180');
      });
    } else {
      arrow.forEach((e) => {
        e.classList.remove('rotate180');
      });
      this.isSortAbc = false;
      this.tableElem.tBodies[0].append(...sortedRows.reverse());
    }
  }
}
