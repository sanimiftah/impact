// volunteer.js

import { getData, saveData } from './data/localStorage.js';

export function renderOpenCallsForVolunteers() {
  const calls = getData('openCalls');
  const container = document.getElementById('openCallList');
  container.innerHTML = '';

  if (calls.length === 0) {
    container.innerHTML = `<p class="text-gray-500 italic">No open calls at the moment.</p>`;
    return;
  }

  calls.forEach(call => {
    const card = document.createElement('div');
    card.className = 'border p-4 bg-white rounded shadow';
    card.innerHTML = `
      <h3 class="text-lg font-bold text-red-700">${call.title}</h3>
      <p class="text-sm text-gray-700">${call.description}</p>
      <p class="text-sm text-gray-500"><strong>Deadline:</strong> ${call.deadline}</p>
      <button class="respond-btn mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" data-id="${call.id}">Respond</button>
    `;
    container.appendChild(card);
  });

  // Attach event listeners to respond buttons
  document.querySelectorAll('.respond-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const callId = btn.getAttribute('data-id');
      handleResponse(callId);
    });
  });
}

// Handle volunteer response
function handleResponse(callId) {
  const responses = getData('responses') || [];
  const newResponse = {
    callId,
    timestamp: new Date().toISOString(),
    volunteer: 'Anonymous', // Replace with actual user info if available
  };
  responses.push(newResponse);
  saveData('responses', responses);
  alert('Thank you for responding! 🌱');
}

// Update notification badge for new OpenCalls
function updateNotificationBadge() {
  const calls = getData('openCalls');
  const lastCount = getData('lastOpenCallCount') || 0;
  const badge = document.getElementById('openCallBadge');

  if (calls.length > lastCount) {
    badge.textContent = calls.length - lastCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  saveData('lastOpenCallCount', calls.length);
}

// Call functions on page load
document.addEventListener('DOMContentLoaded', () => {
  renderOpenCallsForVolunteers();
  updateNotificationBadge();
});
