import numberWithSpaces from "./lib/numberWithSpaces";

const socnets = document.querySelector(`.socnets`);

const buildStatsSn = (periods) => {
  console.log(periods);
  const prev = [...periods].reverse().find(period => (new Date() >= period.timeStamp));
  const to = periods.find(period => (new Date() < period.timeStamp)) || prev;
  const current = {
    from: prev,
    to: to,
    get diff() {
      return this.to.total() - this.from.total();
    },
    get percent() {
      return (new Date() - this.from.timeStamp) / ( this.to.timeStamp - this.from.timeStamp);
    },
    get total() {
      const total = {
        sum: 0,
        snets: {}
      };
      let max = 0;
      for (const sn in this.to.snets) {
        if (this.to.snets.hasOwnProperty(sn)) {
          const percent = Math.round(100*(this.from.snets[sn] + ((this.to.snets[sn] - this.from.snets[sn]) * this.percent)) / (this.from.total() + this.diff * this.percent ));
          if (percent > max) {
            total.max = sn;
            max = percent;
          }
          total.snets[sn] = `${percent}%`;
          total.sum += percent;
        }
      }
      const percentSum = 0;
      const percentArr = [];
      if (total.sum !== 100) {
        total.snets[total.max] = `${parseInt(total.snets[total.max], 10) - (total.sum - 100)}%`;
      }
      return total;
    }
  };
  console.log(current, current.total.snets);
  return current.total.snets;
};

const printStatsSn = (total) => {
  for (const sn in total) {
    if (sn !== undefined && total.hasOwnProperty(sn)) {
      console.log(sn, socnets.querySelector(`#${sn}`))
      if(socnets.querySelector(`#${sn}`)){
      socnets.querySelector(`#${sn}`).innerText = total[sn];}
    }
  }
  socnets.classList.add(`animated`);
}


export default {
  build: buildStatsSn,
  print: printStatsSn
}
