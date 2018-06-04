import getData from "./fetch";
import totalScreen from "../total";
import last from "../last";
import map from "../map";

const adoptTotal = (json => {
  console.log(`loaded`);
  const periods = {total:[], last:[], map:[]};
  const mapArr = [];
  const total = json.datasheets.map(period => {
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

    const periodRegions = period.sheetData.regions.russia;
    const regions = periodRegions;

    mapArr.push({
      timeStamp: timeStamp,
      regions: regions
    });

    return {
      timeStamp: timeStamp,
      _sum: parseInt(sum, 10),
      total() {
        return this._sum;
      }
    };
  });
  periods.total = total;
  periods.map = mapArr;

  const periodsLast = json.properties[`10min_dynamics`];
  const last = [];
  for (const period in periodsLast) {
    if (periodsLast.hasOwnProperty(period)) {
      const timeStamp = new Date();
      const time = period.split(`:`);
      const [hours, minutes] = time;
      timeStamp.setHours(hours);
      timeStamp.setMinutes(minutes);
      timeStamp.setSeconds(0);
      const number = parseInt(periodsLast[period], 10);
      last.push({
        timeStamp: timeStamp,
        number: number
      })
    }
  }
  periods.last = last;

  return periods;

});

const reNew = () => {
  getData.then(adoptTotal).then(total => {
    totalScreen.reCountTotal(total.total);
    last.show(last.build(total.last));
    return total.map
  }).then(map.adopt).then(map.paint).then(map.startSlide)
  .catch(error => {console.error(error)})
  }


const dataStorage = {
  reNew() {
    reNew();
    setInterval(reNew, 60000);
  }
}

export default dataStorage;
