export default function endGame(result) {
  const wrapper = document.querySelector('.grid__wrapper');
  const endGameElement = document.querySelector('.endGame');
  const endGameSound = document.createElement('audio');
  const imgWin = document.querySelector('.victory');
  const imgFail = document.querySelector('.fail');

  wrapper.classList.add('delete-block');
  endGameElement.classList.remove('delete-block');

  if (result === 'win') {
    endGameSound.src = './sounds/victory.mp3';
    imgWin.classList.remove('delete-block');
  } else {
    endGameSound.src = './sounds/fail.mp3';
    imgFail.classList.remove('delete-block');
  }

  endGameSound.play();

  setTimeout(() => {
    wrapper.classList.remove('delete-block');
    endGameElement.classList.add('delete-block');
    imgWin.classList.add('delete-block');
    imgFail.classList.add('delete-block');
  }, 2500);
}
