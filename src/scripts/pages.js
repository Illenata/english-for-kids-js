import Card from './card';
import CardsData from './cards.data';
import endGame from './endGame';
import incrementStorageCounter from './increment.storage.counter';
import addStars from './add.stars';
import difficultWords from './difficult-words';

export default class Page {
  constructor() {
    this.cards = CardsData.mainPage;
    this.page = 'main';
    this.startGameBtn = document.querySelector('.start__game__btn');
    this.slider = document.querySelector('.slider');
    this.sliderText = document.querySelector('.slider__text');

    this.mode = 'train';

    this.sounds = [];
    this.correctSound = document.createElement('audio');
    this.correctSound.src = './sounds/correct.mp3';
    this.incorrectSound = document.createElement('audio');
    this.incorrectSound.src = './sounds/incorrect.mp3';
    this.currentSound = '';

    this.playModeClickCounter = 0;
    this.failChoice = 0;
    this.countCards = 8;

    this.stars = document.querySelector('.stars');
    this.indexArr = [];

    this.numbersForDataAttribute = 0;
  }

  init() {
    this.addCards(this.countCards);
    this.randomIndexArr(this.countCards);
  }

  listener() {
    window.addEventListener('click', (event) => {
      if (event.target === this.slider) {
        this.switchMode();
      } else if (event.target === this.startGameBtn) {
        this.startGameFunction();
      }
    });
  }

  switchMode() {
    if (this.slider.checked) {
      this.mode = 'train';
      this.trainMode();
    } else {
      this.mode = 'play';
      this.playMode();
    }
  }

  randomIndexArr(count) {
    this.indexArr = [...Array(count).keys()];
    for (let i = this.indexArr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.indexArr[i], this.indexArr[j]] = [this.indexArr[j], this.indexArr[i]];
    }
  }

  playMode() {
    this.sliderText.textContent = 'Play';
    this.sliderText.style.marginLeft = '3rem';

    if (this.page !== 'main') {
      this.stars.classList.remove('stars-hidden');
      this.startGameBtn.classList.remove('hidden');
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => {
        card.classList.add('play-mode');
      });
    }
  }

  startGameFunction() {
    if (this.startGameBtn.textContent === 'Start game') {
      this.sounds[this.indexArr[0]].play();
      this.currentSound = this.cards[this.indexArr[0]].audioSrc;
      this.startGameBtn.textContent = 'Repeat';
      this.startGameBtn.classList.add('repeat-btn');
    } else if (this.playModeClickCounter < this.countCards) {
      this.sounds[this.indexArr[this.playModeClickCounter]].play();
    }
  }

  trainMode() {
    this.sliderText.textContent = 'Train';
    this.sliderText.style.marginLeft = '1rem';
    this.startGameBtn.classList.add('hidden');
    this.stars.classList.add('stars-hidden');
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.classList.remove('play-mode');
    });
  }

  addCards(count) {
    for (let i = 0; i < count; i += 1) {
      if (this.page === 'main') {
        this.mainPage(i);
      } else {
        this.categoryPages(i);
      }
    }
  }

  mainPage(i) {
    this.startGameBtn.classList.add('hidden');
    this.stars.classList.add('stars-hidden');
    const card = new Card(this.cards[i], false, this.page, this.cards[i].image, false);
    card.init();
    card.createTitle();

    card.elem.addEventListener('click', () => {
      this.selectCategory(card.elem.children[1].innerText.toLowerCase());
    });
  }

  categoryPages(i) {
    const card = new Card(this.cards[i].word, this.cards[i].translation,
      this.page, this.cards[i].image);

    const soundWord = new Audio(this.cards[i].audioSrc);
    soundWord.classList.add('sound-word');
    this.sounds.push(soundWord);

    card.init();
    if (this.mode === 'train') {
      card.trainModeCard();
    } else {
      card.trainModeCard();
      this.startGameBtn.classList.remove('hidden');
      card.elem.classList.add('play-mode');
    }

    card.elem.addEventListener('click', (event) => {
      if (this.mode === 'train') {
        if (!event.target.classList.contains('rotate__btn')) {
          this.sounds[i].play();
        }
        incrementStorageCounter('trained', this.cards[i].id);
      } else {
        if (this.startGameBtn.textContent === 'Repeat' && this.playModeClickCounter < this.countCards) {
          if (this.currentSound === this.cards[i].audioSrc) {
            card.elem.classList.add('correct-choise');
            this.correctChoice();
            incrementStorageCounter('correct', this.cards[i].id);
          } else {
            let numberCard;
            Object.values(CardsData).forEach((category) => {
              category.forEach((word) => {
                if (word.audioSrc === this.currentSound) {
                  numberCard = word.id;
                }
              });
            });
            this.incorrectChoice();
            incrementStorageCounter('incorrect', numberCard);
          }
        }

        if (this.playModeClickCounter === this.countCards) {
          const loadMain = () => {
            this.selectCategory('main');
          };

          if (this.failChoice === 0) {
            endGame('win');
            setTimeout(loadMain, 2500);
          } else {
            endGame('fail');
            setTimeout(loadMain, 2500);
          }
        }
      }
    });
  }

  correctChoice() {
    this.correctSound.play();
    addStars('star');

    this.playModeClickCounter += 1;

    if (this.playModeClickCounter < this.countCards) {
      const playNextWord = () => {
        this.sounds[this.indexArr[this.playModeClickCounter]].play();
      };
      setTimeout(playNextWord, 1000);
      this.currentSound = this.cards[this.indexArr[this.playModeClickCounter]].audioSrc;
    }
  }

  incorrectChoice() {
    this.failChoice += 1;
    this.incorrectSound.play();

    addStars('empty');
  }

  selectCategory(category) {
    document.querySelectorAll('.card').forEach((e) => {
      e.remove();
    });

    this.abortGame();

    if (category === 'repeat-words') {
      this.countCards = difficultWords().length;
    } else {
      this.countCards = 8;
    }

    this.page = category;
    switch (category) {
      case 'animals':
        this.cards = CardsData.pageAnimals;
        break;
      case 'feelings':
        this.cards = CardsData.pageFeelings;
        break;
      case 'clothes':
        this.cards = CardsData.pageClothes;
        break;
      case 'actions':
        this.cards = CardsData.pageActions;
        break;
      case 'food':
        this.cards = CardsData.pageFood;
        break;
      case 'weather':
        this.cards = CardsData.pageWeather;
        break;
      case 'hollydays':
        this.cards = CardsData.pageHollydays;
        break;
      case 'objects':
        this.cards = CardsData.pageObjects;
        break;
      case 'repeat-words':
        this.cards = difficultWords();
        break;
      default:
        this.cards = CardsData.mainPage;
    }

    this.randomIndexArr(this.countCards);
    this.addCards(this.countCards);

    const menuItems = document.querySelectorAll('.menu__item > p');
    menuItems.forEach((item) => {
      item.classList.remove('active');
      if (category === item.textContent.toLowerCase()) {
        item.classList.add('active');
      }
    });
  }

  abortGame() {
    this.playModeClickCounter = 0;
    this.failChoice = 0;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star) => {
      star.remove();
    });

    this.startGameBtn.textContent = 'Start game';
    this.startGameBtn.classList.remove('repeat-btn');
    this.switchMode();

    for (let i = 0; i < this.sounds.length; i += 1) {
      this.sounds.pop();
    }
    this.sounds.length = 0;

    document.querySelectorAll('.sound-word').forEach((e) => {
      e.remove();
    });
  }
}
