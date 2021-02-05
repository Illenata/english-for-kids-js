const starsContainer = document.querySelector('.stars');

export default function addStars(type) {
  if (type === 'star') {
    const star = new Image();
    star.classList.add('star');
    star.src = './img/icons/Star.png';
    starsContainer.append(star);
  } else {
    const starEmpty = new Image();
    starEmpty.classList.add('star');
    starsContainer.append(starEmpty);
    starEmpty.src = './img/icons/Star_empty.png';
  }
}
