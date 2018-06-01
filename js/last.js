import getData from "./lib/fetch"
import numberWithSpaces from "./lib/numberWithSpaces";

const columns = document.querySelector(`.columns`);
const bigNum = document.querySelector(`.big-num`);
const growNum = (node, num) => {
  console.log(node, num)
  let temp = 0;
  let grow = setInterval(() => {
    if(temp++ <= num) {
      node.innerHTML = numberWithSpaces(temp);
    } else {
      clearInterval(grow);
      let temp = 0;
    }
  }, 5);
}
const adoptTotal = (json => {
  const periods = json.properties[`10min_dynamics`];
  const data = [];
  for (const period in periods) {
    if (periods.hasOwnProperty(period)) {
      const timeStamp = new Date();
      const time = period.split(`:`);
      const [hours, minutes] = time;
      timeStamp.setHours(hours);
      timeStamp.setMinutes(minutes);
      timeStamp.setSeconds(0);
      const number = parseInt(periods[period], 10);
      data.push({
        timeStamp: timeStamp,
        number: number
      })
    }
  }
  return data;

});

const buildLast = () => {
  getData.then(adoptTotal).then(periods => {
    const to = periods.find(period => (new Date() < period.timeStamp)) || periods[periods.length - 1];
    const index = periods.indexOf(to);
    const periods8 = [];
    for (let i = index - 8; i < index; i++) {
      if (periods[i]) {
        periods8.push(periods[i].number);
      }
    }
    return periods8;
  }).then(current => {
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
    bigNum.dataset.average = average;
  }).catch(error => {
    console.error(error);
  });
}
buildLast();
setTimeout(() => {
  buildLast();
}, 60000);
