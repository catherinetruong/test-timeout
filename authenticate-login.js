// authenticate-login.js
// -----------------------------------------------------
// This script handles a mock login system for testing.
// When a user enters the correct credentials, they’re
// redirected to home.html. Otherwise, an error appears.
// -----------------------------------------------------

const form = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');

// Listen for form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload

  // Get entered username & password
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Simple mock login check (replace with real API later)
  if (username === 'admin' && password === '1234') {
    // Store user info in localStorage (simulates a session)
    localStorage.setItem('loggedInUser', username);

    // Redirect to main UI
    window.location.href = 'home.html';
  } else {
    // Show error message
    message.textContent = 'Invalid credentials. Try admin / 1234.';
    message.style.color = 'red';
  }
});
