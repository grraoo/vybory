(function () {
'use strict';

var getData = fetch(`https://dashboard.sn-mg.ru/service/monitoring/dashboards?reportId=12253`).then(response => response.json());

/**
 * makes space-divided number
 * @param {number} x
 * @return {string}
 */
function numberWithSpaces(x) {
  if (x !== null && typeof x !== `undefined` && x !== ``) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `&thinsp;`);
  }
  return `н/д`;
}

const totalNumber = document.getElementById(`total-number`);

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
    const to = periods.find(period => (new Date() < period.timeStamp));
    const from = [...periods].reverse().find(period => (new Date() >= period.timeStamp));
    const current = {
      from: from,
      to: to,
      get time() {
        return new Date()
      },
      get length() {
        return this.to.timeStamp - this.from.timeStamp
      },
      get percent() {
        return (this.time - this.from.timeStamp) / this.length
      },
      get total() {
        return this.from.total() + (this.to.total() - this.from.total()) * this.percent;
      },

      get rest() {
        return this.to.total() - this.total
      },
    };
    clearInterval(interval);
    interval = setInterval(() => {
      totalNumber.innerHTML = numberWithSpaces(Math.round(current.total));
    }, 1000);
  }).catch(error => {
    console.error(error);
  });
};
reCountTotal();
setInterval(reCountTotal, 60000);

}());

//# sourceMappingURL=total.js.map
