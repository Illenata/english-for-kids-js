export default function modalMessage() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay-dark');
  document.body.prepend(overlay);

  const div = document.createElement('div');
  div.classList.add('modal-message');
  document.body.append(div);

  const text = document.createElement('div');
  text.innerHTML = `<p> You don't have difficult words yet.
  <br> Complete the game for them to appear </p>`;
  div.append(text);

  const closeBtn = document.createElement('p');
  closeBtn.classList.add('close-btn');
  closeBtn.innerText = 'x';
  div.prepend(closeBtn);

  document.body.style.overflow = 'hidden';

  const close = () => {
    document.body.addEventListener('click', (event) => {
      if (overlay && (event.target !== div || event.target === closeBtn)) {
        div.remove();
        overlay.remove();
        // document.body.style.overflow = 'auto';
      }
    });
  };

  setTimeout(close, 0);
}
