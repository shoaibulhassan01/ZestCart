  // Subtle parallax on the hero visual, following the cursor
  const visual = document.getElementById('heroVisual');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches === false && window.innerWidth > 980) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      visual.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    });
  }

  // Cart badge micro-bounce on click, for a bit of playful feedback
  document.querySelectorAll('.nav-action').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      el.style.transform = 'scale(0.94)';
      setTimeout(() => { el.style.transform = ''; }, 140);
    });
  });