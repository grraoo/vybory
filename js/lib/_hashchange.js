export default () => {
  const hash = window.location.hash;
  if(hash && hash.length > 1) {
    console.log(hash);
  }
};
