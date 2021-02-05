export default class Card {
  constructor(title, translation, page, img) {
    this.title = title;
    this.wrapper = document.querySelector('.grid__wrapper');
    this.elem = document.createElement('div');
    this.front = document.createElement('div');
    this.back = document.createElement('div');
    this.rotateBtn = document.createElement('img');
    this.elem.classList.add('card');
    this.wrapper.append(this.elem);
    this.textElem = document.createElement('p');
    this.page = page;
    this.translation = translation;
    this.img = img;
  }

  init() {
    this.setImage();
  }

  setImage() {
    const img = new Image();
    if (this.page === 'main') {
      img.src = `./img/${this.title}.png`;
    } else {
      img.src = this.img;
    }
    img.classList.add('card__image');
    this.elem.append(img);
  }

  createTitle() {
    this.elem.append(this.textElem);
    this.setTitle(this.title);
  }

  setTitle(title) {
    this.textElem.classList.add('card-title');
    this.textElem.textContent = title.charAt(0).toUpperCase() + title.slice(1);
  }

  addRotateBtn() {
    this.rotateBtn.classList.add('rotate__btn');
    this.rotateBtn.src = './img/icons/paw.png';
    this.elem.append(this.rotateBtn);

    this.rotateBtn.addEventListener('click', () => {
      this.rotateCard();
    });
  }

  rotateCard() {
    this.elem.style.transform = 'rotateY(360deg)';
    this.rotateBtn.classList.add('hidden');
    this.setTitle(this.translation);
    this.removeRotate();
  }

  removeRotate() {
    this.elem.addEventListener('mouseleave', () => {
      this.elem.style.transform = 'rotateY(0deg)';
      this.rotateBtn.classList.remove('hidden');
      this.setTitle(this.title);
    });
  }

  trainModeCard() {
    this.addRotateBtn();
    this.createTitle(this.title);
  }
}
