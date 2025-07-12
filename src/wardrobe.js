const clothes = [
  "backgrounds/cherryblossoms.png",
  "backgrounds/moonreflection.gif",
  "backgrounds/blossomcat.gif",
  "backgrounds/saturn-9-background-4.gif"
];

let settings = {
  selectedBackground: 0
};

window.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  const bgIndex = settings.selectedBackground ?? 0;
  const image = document.getElementById("overlay-image");
  if (image) {
    image.src = clothes[bgIndex];
  }
});

function switchBackground() {
  loadSettings();
  settings.selectedBackground = (settings.selectedBackground + 1) % clothes.length;
  const image = document.getElementById("overlay-image");

  if (image) {
    image.src = clothes[settings.selectedBackground];
  }

  saveSettings(settings);
}
