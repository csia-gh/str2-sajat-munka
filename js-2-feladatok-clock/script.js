const display = document.getElementById('display');

const setExactTime = () => {
  const date = new Date();
  let hour = date.getHours().toString();
  let min = date.getMinutes().toString();
  let sec = date.getSeconds().toString();
  display.textContent = `${hour.padStart(2, '0')}:${min.padStart(
    2,
    '0'
  )}:${sec.padStart(2, '0')}`;
};

setInterval(setExactTime, 1000);
