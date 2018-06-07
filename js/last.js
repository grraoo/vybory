import load from "./lib/load"
import numberWithSpaces from "./lib/numberWithSpaces";

const columns = document.querySelector(`.columns`);
const bigNum = document.querySelector(`#last .big-num`);

const buildLast = (periods) => {
  const to = periods.find(period => (new Date() < period.timeStamp)) || periods[periods.length - 1];
  const index = periods.indexOf(to);
  const periods8 = [];
  for (let i = index - 8; i < index; i++) {
    if (periods[i]) {
      periods8.push(periods[i].number);
    }
  }
  return periods8;

}

const showLast = (current) => {
  const max = Math.max(...current) * 5;
  const average = current[current.length - 1];
  const diff = current[current.length - 1] - current[current.length - 2];
  columns.innerHTML = ``;
  current.forEach(number => {
    const column = document.createElement(`div`);
    const innerColumn = document.createElement(`div`);
    column.classList.add(`column`);
    innerColumn.style = `height: calc(5 * ${(number) * 23 / max}vh)`;
    column.appendChild(innerColumn);
    columns.appendChild(column);
  });
  if (diff >= 0) {
    bigNum.classList.remove(`big-num--down`);
    bigNum.classList.add(`big-num--up`);
  } else {
    bigNum.classList.remove(`big-num--up`);
    bigNum.classList.add(`big-num--down`);
  }
  bigNum.dataset.average = average * (0.8 + (Math.random() * 0.2));
};

export default {
  build: buildLast,
  show: showLast
}
