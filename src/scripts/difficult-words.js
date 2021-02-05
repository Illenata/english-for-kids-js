export default function difficultWords() {
  const arrayWords = JSON.parse(localStorage.getItem('difficult-words'));
  let result = [];

  if (arrayWords) {
    arrayWords.sort((a, b) => (a.percentAnswer > b.percentAnswer ? 1 : -1));
    result = arrayWords.slice(0, 8);
  }
  return result;
}
