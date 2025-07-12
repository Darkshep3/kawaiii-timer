  document.getElementById("back-button").addEventListener("click", goBack);

  function goBack() {
    document.getElementById('intro').style.display = 'block';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('back').style.display = 'none';
    document.getElementById('settings').style.display = 'none';
    document.getElementById('minigames').style.display = 'none';
    document.getElementById("background").style.display = 'block';

    if (window._canvasInstance) {
      window._canvasInstance.remove();
      window._canvasInstance = null;
    }

    minigameOPEN = false;
    gameStarted = false;
  }