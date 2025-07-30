// lead.js

import { saveData, getData } from './data/localStorage.js';

export function postOpenCall({ title, description, deadline }) {
  const calls = getData('openCalls');
  const newCall = {
    id: Date.now(),
    title,
    description,
    deadline,
  };
  calls.push(newCall);
  saveData('openCalls', calls);
  renderOpenCalls(); // Refresh UI
}

export function renderOpenCalls() {
  const calls = getData('openCalls');
  const container = document.getElementById('openCallList');
  container.innerHTML = '';

  calls.forEach(call => {
    const card = document.createElement('div');
    card.className = 'border p-4 bg-white rounded shadow';
    card.innerHTML = `
      <h3 class="text-lg font-bold text-red-700">${call.title}</h3>
      <p class="text-sm text-gray-700">${call.description}</p>
      <p class="text-sm text-gray-500"><strong>Deadline:</strong> ${call.deadline}</p>
    `;
    container.appendChild(card);
  });
}

// Form listener
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postCallForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = form.querySelectorAll('input, textarea');
    const title = inputs[0].value;
    const description = inputs[1].value;
    const deadline = inputs[2].value;

    postOpenCall({ title, description, deadline });
    form.reset();
  });

  renderOpenCalls();
});
