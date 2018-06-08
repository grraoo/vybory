export default fetch(`https://dashboard.sn-mg.ru/service/monitoring/dashboards?reportId=12253`)
.then(response => response.json())
.catch(err => {
  console.error(err);

})
