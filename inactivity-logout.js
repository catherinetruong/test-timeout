// inactivity-logout.js
// -----------------------------------------------------
// Tracks inactivity, shows live countdown, and triggers
// a modal at 30s warning before logout.
// -----------------------------------------------------

window.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('inactivity-timer');
  const modal = document.getElementById('inactivity-modal');
  const modalCountdown = document.getElementById('modal-countdown');
  const stayLoggedInBtn = document.getElementById('stayLoggedInBtn');

  const INACTIVITY_LIMIT = 60000; // 1 min for testing
  const WARNING_TIME = 30000;     // Show modal in last 30s

  let remainingTime = INACTIVITY_LIMIT;
  let countdownInterval;
  let logoutTimeout;
  let modalInterval;

  if (!localStorage.getItem('loggedInUser')) return;

  startTracking();

  // Start listening for user actions
  function startTracking() {
    ['mousemove', 'keypress', 'scroll', 'click', 'touchstart'].forEach(evt =>
      document.addEventListener(evt, resetTimer, false)
    );
    resetTimer();
  }

  // Reset inactivity timer on any user activity
  function resetTimer() {
    clearTimeout(logoutTimeout);
    clearInterval(countdownInterval);
    clearInterval(modalInterval);
    hideModal();

    remainingTime = INACTIVITY_LIMIT;
    updateCountdown();

    // Countdown timer display
    countdownInterval = setInterval(() => {
      remainingTime -= 1000;
      updateCountdown();

      // Show modal when 30s remain
      if (remainingTime === WARNING_TIME) {
        showModal();
      }

      // Stop interval if time expires
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Schedule logout
    logoutTimeout = setTimeout(() => {
      logoutUser();
    }, INACTIVITY_LIMIT);
  }

  // Update countdown display (bottom-right)
  function updateCountdown() {
    const seconds = Math.max(Math.ceil(remainingTime / 1000), 0);
    if (timerDisplay) timerDisplay.textContent = `Inactivity timer: ${seconds}s`;
  }

  // Show modal and start 30s warning countdown
  function showModal() {
    modal.classList.remove('hidden');
    let modalTime = WARNING_TIME / 1000; // 30 seconds
    modalCountdown.textContent = modalTime;

    modalInterval = setInterval(() => {
      modalTime--;
      modalCountdown.textContent = modalTime;
      if (modalTime <= 0) {
        clearInterval(modalInterval);
      }
    }, 1000);
  }

  // Hide modal
  function hideModal() {
    modal.classList.add('hidden');
  }

  // Handle "Stay Logged In" button
  stayLoggedInBtn.addEventListener('click', () => {
    hideModal();
    resetTimer(); // fully reset everything
  });

  // Auto logout
  function logoutUser() {
    hideModal();
    alert('You have been logged out due to inactivity.');
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
  }
});
