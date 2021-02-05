export default function incrementStorageCounter(counterName, number) {
  let counters = 0;

  let arr = [];

  if (JSON.parse(localStorage.getItem(counterName))) {
    arr = JSON.parse(localStorage.getItem(counterName));
  } else {
    for (let i = 0; i < 64; i += 1) {
      arr.push(0);
    }
  }
  counters += 1;
  arr[number] += counters;

  localStorage.setItem(counterName, JSON.stringify(arr));
}
