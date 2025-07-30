document.getElementById('seedForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // Collect form data
  const formData = {
    title: this.title.value,
    description: this.description.value,
    tags: this.tags.value.split(',').map(tag => tag.trim()),
    emotion: this.emotion.value,
    location: this.location.value,
    timestamp: new Date().toISOString()
  };

  // Save to localStorage
  const seeds = JSON.parse(localStorage.getItem('seeds')) || [];
  seeds.push(formData);
  localStorage.setItem('seeds', JSON.stringify(seeds));

  // Animate confirmation message
  const confirmation = document.getElementById('confirmation');
  confirmation.classList.remove('opacity-0', 'scale-95');
  confirmation.classList.add('opacity-100', 'scale-100');

  // Animate progress bar (optional)
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = '100%';

    // Reset progress bar after 3 seconds
    setTimeout(() => {
      progressBar.style.width = '0%';
    }, 3000);
  }

  // Reset form
  this.reset();
});
