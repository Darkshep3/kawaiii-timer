let startingTime;
let intervalId = null;
let remainingTime = 0;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("set-time-button").addEventListener("click", setTime);
  document.getElementById("start-timer").addEventListener("click", startCountdown);
  document.getElementById("resume-timer").addEventListener("click", resumeCountdown);
  document.getElementById("stop-timer").addEventListener("click", stopCountdown);
  document.getElementById("end-timer").addEventListener("click", endCountdown);
});

function goToTimer() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('back').style.display = 'block';
  document.getElementById('settings').style.display = 'none';
  document.getElementById('timer').style.display = 'block';
  document.getElementById('background').style.display = 'block';

  const display = document.getElementById('time');

  const savedSettings = loadSettings();
  startingTime = savedSettings.timerDuration || display.textContent;

  const isRunning = localStorage.getItem("timerRunning") === "true";
  const savedTime = parseInt(localStorage.getItem("timerRemaining") || "0", 10);

  if (isRunning && savedTime > 0) {
    remainingTime = savedTime;
    updateDisplay(remainingTime, display);
    runTimer(remainingTime, display);

    document.getElementById('start-timer').style.display = 'none';
    document.getElementById('resume-timer').style.display = 'none';
    document.getElementById('stop-timer').style.display = 'block';
    document.getElementById('end-timer').style.display = 'none';

  } else if (!isRunning && savedTime > 0) {
    remainingTime = savedTime;
    updateDisplay(remainingTime, display);

    document.getElementById('start-timer').style.display = 'none';
    document.getElementById('resume-timer').style.display = 'block';
    document.getElementById('stop-timer').style.display = 'none';
    document.getElementById('end-timer').style.display = 'block';

  } else {
    remainingTime = parseTime(startingTime);
    updateDisplay(remainingTime, display);

    clearInterval(intervalId);

    document.getElementById('start-timer').style.display = 'block';
    document.getElementById('resume-timer').style.display = 'none';
    document.getElementById('stop-timer').style.display = 'none';
    document.getElementById('end-timer').style.display = 'none';

    saveTimerState(false, remainingTime);
  }
}

function runTimer(duration, display) {
  clearInterval(intervalId);
  let timer = duration;
  updateDisplay(timer, display);
  remainingTime = timer;

  intervalId = setInterval(function () {
    timer--;
    if (timer < 0) {
      clearInterval(intervalId);
      display.textContent = "00:00";
      saveTimerState(false, 0);

      const toggle = document.getElementById('minigames-toggle');
      document.getElementById('stop-timer').style.display = 'none';
      document.getElementById('end-timer').style.display = 'block';

      if (!toggle.checked) {
        for (let i = 0; i < 15; i++) {
          startFlare();
        }
      } else {
        startMinigames();
      }

    } else {
      updateDisplay(timer, display);
      remainingTime = timer;
      saveTimerState(true, timer);
    }
  }, 1000);
}

function updateDisplay(seconds, display) {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  secs = secs < 10 ? "0" + secs : secs;

  display.textContent = `${minutes}:${secs}`;
}

function startCountdown() {
  const display = document.getElementById('time');
  const duration = parseTime(display.textContent);

  runTimer(duration, display);
  saveTimerState(true, duration);

  document.getElementById('start-timer').style.display = 'none';
  document.getElementById('resume-timer').style.display = 'none';
  document.getElementById('stop-timer').style.display = 'block';
  document.getElementById('end-timer').style.display = 'none';
}

function stopCountdown() {
  clearInterval(intervalId);
  saveTimerState(false, remainingTime);

  document.getElementById('stop-timer').style.display = 'none';
  document.getElementById('resume-timer').style.display = 'block';
  document.getElementById('end-timer').style.display = 'block';
}

function resumeCountdown() {
  const display = document.getElementById('time');
  runTimer(remainingTime, display);
  saveTimerState(true, remainingTime);

  document.getElementById('resume-timer').style.display = 'none';
  document.getElementById('stop-timer').style.display = 'block';
}

function endCountdown() {
  clearInterval(intervalId);

  const settings = loadSettings();
  startingTime = settings.timerDuration || "01:00";
  remainingTime = parseTime(startingTime);

  const display = document.getElementById('time');
  updateDisplay(remainingTime, display);

  saveTimerState(false, remainingTime);

  document.getElementById('start-timer').style.display = 'block';
  document.getElementById('resume-timer').style.display = 'none';
  document.getElementById('stop-timer').style.display = 'none';
  document.getElementById('end-timer').style.display = 'none';
}

function parseTime(time) {
  const parts = time.split(":");
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  return minutes * 60 + seconds;
}

function setTime() {
  const input = document.getElementById("time-input").value;
  const successMsg = document.getElementById("time-success");

  if (/^\d{1,2}:\d{2}$/.test(input)) {
    const settings = loadSettings();
    settings.timerDuration = input;
    saveSettings(settings);

    startingTime = input;
    remainingTime = parseTime(input);

    const display = document.getElementById("time");
    display.textContent = input;

    document.getElementById("time-error").style.display = "none";

    successMsg.style.display = "block";
    successMsg.style.animation = "none";
    void successMsg.offsetWidth; 
    successMsg.style.animation = "fadePop 1s ease-out";

    setTimeout(() => {
      successMsg.style.display = "none";
    }, 1000);

  } else {
    document.getElementById("time-error").style.display = "block";
    successMsg.style.display = "none";
  }
}

function loadSettings() {
  const saved = localStorage.getItem("appSettings");
  if (saved) return JSON.parse(saved);
  return {
    timerDuration: "01:00",
    minigamesEnabled: true,
    selectedBackground: 0,
  };
}

function saveSettings(settings) {
  localStorage.setItem("appSettings", JSON.stringify(settings));
}

function saveTimerState(running, remaining) {
  localStorage.setItem("timerRunning", running ? "true" : "false");
  localStorage.setItem("timerRemaining", remaining.toString());
}

function setQuickTime(timeString) {
  const input = document.getElementById("time-input");
  input.value = timeString;
  setTime();
}
