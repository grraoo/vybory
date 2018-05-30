(function () {
'use strict';

// import regHiglight from "./regHiglight";
// import numberWithSpaces from "./numberWithSpaces";
// const currentState = window.currentState;
// const map = document.querySelector(`.svg-map g`);
// const reg00 = document.getElementById(`reg00`);
// const rusReg = document.getElementById(`Russia`);
// const colors = [
//   `#D94D4D`,
//   `#e59695`,
//   `#F3F1F1`,
//   `#abe1a2`,
//   `#78D66D`,
// ];

// const numColors = [
//   `#D94D4D`,
//   `#D94D4D`,
//   `#575757`,
//   `#64b454`,
//   `#64b454`,
// ];

// function paintMap() {
//   if (currentState.region !== `Russia`) {
//     regHiglight(map, currentState.region, `active`);
//   }

//   const reg00total = currentState.currentTotal[currentState.subject].month.reg00.all;

//   reg00.querySelector(`.regions__posts`).innerHTML = `${numberWithSpaces(reg00total.total())} /`;
//   reg00.querySelector(`.regions__rate`).innerText = reg00total.getRate();
//   reg00.querySelector(`.regions__rate`).style.color = numColors[Math.round(reg00total.getRate() * (numColors.length - 1))];

//   const rusTotal = currentState.currentTotal[currentState.subject].month.Russia.all;

//   rusReg.querySelector(`.regions__posts`).innerHTML = `${numberWithSpaces(rusTotal.total())} /`;
//   rusReg.querySelector(`.regions__rate`).innerText = rusTotal.getRate();
//   rusReg.querySelector(`.regions__rate`).style.color = numColors[Math.round(rusTotal.getRate() * (numColors.length - 1))];
//   window.data.regIds.forEach((id) => {

//     if (id !== `Russia` && id !== `reg00`) {
//       const currentList = currentState.getCurrentRegList(id);

//       const allThemes = currentList[`all`];

//       const rate = allThemes.getRate();

//       const path = map.querySelector(`#${id}`);
//       path.dataset.rate = rate;
//       path.dataset.posts = allThemes.total();
//       const color = colors[Math.round(rate * (colors.length - 1))] || `#fff`;
//       if (color === `#fff`) {
//         path.classList.add(`disabled`);
//       }
//       path.setAttribute(`fill`, color);
//     }
//   });
// }

// export default paintMap;

}());

//# sourceMappingURL=paintMap.js.map
