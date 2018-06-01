import getData from "./lib/fetch"
import numberWithSpaces from "./lib/numberWithSpaces";

const totalNumber = document.getElementById(`total-number`);
const dataV = {
  numberArr: [], numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  setPosition: (num) => {
    return `transform: translateY(-${num * 100}%); transition-duration: .3s;`;
  }
};
const counter = new Vue({
  el: `#total-number`,
  data: dataV
});

const adoptTotal = (json => {
  const periods = json.datasheets.map(period => {
    const timeStamp = new Date();
    const time = period.title.split(`:`);
    const [hours, minutes] = time;
    timeStamp.setHours(hours);
    timeStamp.setMinutes(minutes);
    timeStamp.setSeconds(0);
    const periodTotal = period.sheetData.snetwork.total;
    let sum = 0;
    for (const sn in periodTotal) {
      if (periodTotal.hasOwnProperty(sn)) {
        sum += parseInt(periodTotal[sn], 10);
      }
    }
    return {
      timeStamp: timeStamp,
      _sum: parseInt(sum, 10),
      total() {
        return this._sum;
      }
    };
  });

  return periods;

});
let interval;
const reCountTotal = () => {
  getData.then(adoptTotal).then(periods => {
    const prev = [...periods].reverse().find(period => (new Date() >= period.timeStamp));
    const to = periods.find(period => (new Date() < period.timeStamp)) || prev;
    const current = {
      prev: prev,
      to: to,
      get time() {
        return new Date()
      },
      get length() {
        return this.to.timeStamp - this.prev.timeStamp
      },
      get percent() {
        return (this.time - this.prev.timeStamp) / this.length
      },
      get total() {
        return this.prev.total() + (this.to.total() - this.prev.total()) * this.percent;
      },
    };
    clearInterval(interval);
    interval = setInterval(() => {
      dataV.numberArr = (Math.round(current.total).toString().split(``)).map(num => parseInt(num));
    }, 1000)
  }).catch(error => {
    console.error(error)
  });
}
reCountTotal();
setInterval(reCountTotal, 60000);

