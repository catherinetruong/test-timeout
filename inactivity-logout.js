// =======================
// CONFIGURATION
// =======================
const INACTIVITY_LIMIT = 60; // total inactivity seconds (testing)
const MODAL_WARNING = 30;    // seconds before timeout to show modal

// =======================
// STATE VARIABLES
// =======================
let remainingTime = INACTIVITY_LIMIT;
let countdownInterval = null;
let modalInterval = null;
let isModalVisible = false;

// =======================
// DOM ELEMENTS
// =======================
const timerDisplay = document.getElementById('inactivity-timer');
const modal = document.getElementById('inactivity-modal');
const modalCountdown = document.getElementById('modal-countdown');
const stayLoggedInBtn = document.getElementById('stayLoggedInBtn');

// =======================
// FUNCTIONS
// =======================

// Update bottom-right timer display
function updateTimerDisplay() {
  timerDisplay.textContent = `Inactivity timer: ${remainingTime}s`;
}

// Show modal with countdown
function showModal() {
  if (isModalVisible) return;

  isModalVisible = true;
  modal.classList.remove('hidden');
  modalCountdown.textContent = remainingTime;

  // Update modal countdown every second
  modalInterval = setInterval(() => {
    modalCountdown.textContent = remainingTime;
  }, 1000);
}

// Hide modal
function hideModal() {
  if (!isModalVisible) return;

  isModalVisible = false;
  modal.classList.add('hidden');
  clearInterval(modalInterval);
}

// Reset inactivity timer
function resetTimer() {
  remainingTime = INACTIVITY_LIMIT;
  updateTimerDisplay();
  hideModal();
}

// Logout user
function logoutUser() {
  clearInterval(countdownInterval);
  clearInterval(modalInterval);
  localStorage.removeItem('loggedInUser');
  alert('You have been logged out due to inactivity.');
  window.location.href = 'index.html';
}

// Start main countdown
function startCountdown() {
  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();

    // Show modal if in warning period
    if (remainingTime <= MODAL_WARNING && !isModalVisible) {
      showModal();
    }

    // Timeout
    if (remainingTime <= 0) {
      logoutUser();
    }
  }, 1000);
}

// =======================
// EVENT LISTENERS
// =======================

// Reset timer on user activity
['mousemove', 'keydown', 'click', 'scroll'].forEach(evt => {
  document.addEventListener(evt, resetTimer);
});

// Stay logged in button
stayLoggedInBtn.addEventListener('click', () => {
  resetTimer();
});

// Pause timers when tab hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(countdownInterval);
    clearInterval(modalInterval);
  } else {
    startCountdown();
    if (remainingTime <= MODAL_WARNING) showModal();
  }
});

// =======================
// INITIALIZATION
// =======================

// Only start timer if logged in
if (localStorage.getItem('loggedInUser')) {
  resetTimer();
  startCountdown();
} else {
  window.location.href = 'index.html';
}
