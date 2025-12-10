// === LOGICA DEL CARICAMENTO (SPINNER TERMINALE) ===
const spinnerChars = ["|", "/", "-", "\\"];
let spinnerIndex = 0;
let loadingInterval;
const loadingStatusElement = document.getElementById("loading-status");

function startLoadingAnimation() {
  loadingInterval = setInterval(() => {
    const currentSpinner = spinnerChars[spinnerIndex];
    // Due pallini fissi + il cursore animato
    loadingStatusElement.textContent = `Caricamento in corso ${currentSpinner}`;
    spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
  }, 150); // Velocità dell'animazione: 150ms
}

// Inizia l'animazione non appena lo script è caricato
startLoadingAnimation();
