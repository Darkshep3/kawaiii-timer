function switchToSettings(){
    document.getElementById('intro').style.display = 'none';
    document.getElementById('back').style.display = 'block';
    document.getElementById('settings').style.display = 'block';

}

function setTime() {
  const input = document.getElementById('time-input').value.trim();
  const errorMsg = document.getElementById('time-error');

  const valid = /^[0-9]{1,2}:[0-5][0-9]$/.test(input);

  if (!valid) {
    errorMsg.style.display = 'block';
    return;
  } else {
    errorMsg.style.display = 'none';
  }

  time = input;
  document.getElementById('time').textContent = time;
  alert('Time set to ' + time);
}

function isMinigamesEnabled() {
  return document.getElementById('minigames-toggle').checked;
}