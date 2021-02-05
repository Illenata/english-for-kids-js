import Pages from './pages';
import Statistics from './statistics';
import difficultWords from './difficult-words';
import modalMessage from './message-empty';

export default class Menu {
  constructor() {
    this.isMenuOpen = false;
    this.cardWrapper = document.querySelector('.grid__wrapper');
    this.statisticsWrapper = document.querySelector('.statistics-wrapper');
    this.menuWrapper = document.querySelector('.menu__wrapper');
    this.menuBtn = document.querySelector('.menu__btn');
    this.menu = document.querySelector('.menu');
    this.menuItems = document.querySelectorAll('.menu__item > p');
    this.overlay = document.createElement('div');
    this.repeatWords = document.querySelector('.repeat-dif-words');

    this.pages = new Pages();
  }

  init() {
    this.pages.init();
    this.pages.listener();

    this.createOverlay();
    this.menuBtn.addEventListener('click', () => {
      this.toggleMenu();
    });
    this.selectPage();
  }

  createOverlay() {
    document.body.prepend(this.overlay);
    this.overlay.classList.add('overlay');
    this.overlay.addEventListener('click', () => {
      this.toggleMenu();
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuBtn.classList.toggle('open');

    if (this.isMenuOpen) {
      this.menuWrapper.style.width = '17rem';
      this.overlay.style.visibility = 'visible';
    } else {
      this.menuWrapper.style.width = '0';
      this.overlay.style.visibility = 'hidden';
    }
  }

  selectPage() {
    const openPage = (category) => {
      this.pages.abortGame();
      if (!this.statisticsWrapper.classList.contains('delete-block')) {
        this.statisticsWrapper.classList.add('delete-block');
        this.cardWrapper.classList.remove('delete-block');
        this.pages.init();
        this.pages.switchMode();
      }
      this.pages.selectCategory(category);
    };

    const openStatistics = () => {
      this.pages.abortGame();
      this.cardWrapper.classList.add('delete-block');
      this.statisticsWrapper.classList.remove('delete-block');
      const statistics = new Statistics();
      statistics.init();
    };

    this.repeatWords.addEventListener('click', () => {
      if (difficultWords().length) {
        openPage('repeat-words');
      } else {
        modalMessage();
      }
    });

    this.menuItems.forEach((elem) => {
      elem.addEventListener('click', () => {
        this.removeHighlight();
        this.toggleMenu();
        elem.classList.add('active');
        if (elem.textContent !== 'Statistics') {
          openPage(elem.textContent.toLowerCase());
        } else {
          openStatistics();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  removeHighlight() {
    this.menuItems.forEach((elem) => {
      elem.classList.remove('active');
    });
  }
}
