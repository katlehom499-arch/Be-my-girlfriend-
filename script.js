// Playful "No" button script
(function(){
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const container = document.querySelector('.buttons');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');

  // ensure buttons are positioned absolutely relative to .buttons
  function setInitialPositions(){
    // if CSS absolute positions exist, keep them; this just ensures they are clickable area aware
    // Nothing required here for now
  }
  setInitialPositions();

  // Move "No" button to a random location within container bounds
  function moveNo(randomizeSwap=false){
    const contRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const padding = 8;
    const maxLeft = contRect.width - btnRect.width - padding;
    const maxTop = contRect.height - btnRect.height - padding;

    // If for some reason container is too small, just nudge
    const safeMaxLeft = Math.max(0, maxLeft);
    const safeMaxTop = Math.max(0, maxTop);

    const left = Math.random() * safeMaxLeft;
    const top = Math.random() * safeMaxTop;

    noBtn.style.left = `${left}px`;
    noBtn.style.top = `${top}px`;

    // Occasionally swap positions with Yes for extra trickiness
    if (randomizeSwap && Math.random() < 0.25) {
      const yesRect = yesBtn.getBoundingClientRect();
      // Move Yes to previous No location
      yesBtn.style.left = `${Math.min(safeMaxLeft, Math.max(0, parseFloat(noBtn.style.left))) }px`;
      yesBtn.style.top = `${Math.min(safeMaxTop, Math.max(0, parseFloat(noBtn.style.top))) }px`;
    }
  }

  // Prevent selecting "No". Intercept click and move it.
  function handleNoClick(e){
    e.preventDefault();
    e.stopPropagation();
    // playful reaction then move it again
    moveNo(true);
  }

  // On hover or focus or touch, move the "No" button
  noBtn.addEventListener('mouseenter', () => moveNo());
  noBtn.addEventListener('focus', () => moveNo());
  noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); }, {passive:false});
  noBtn.addEventListener('click', handleNoClick);
  // Also block keyboard Enter/Space on "No"
  noBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      moveNo();
    }
  });

  // Yes button shows the success modal
  yesBtn.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'false');
  });

  // Close modal
  closeModal.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
  });

  // Close by clicking outside modal content
  modal.addEventListener('click', (ev) => {
    if (ev.target === modal) modal.setAttribute('aria-hidden', 'true');
  });

  // Make sure the "No" button stays in bounds on resize
  window.addEventListener('resize', () => {
    // if the noBtn is out of visible container area, move it into view
    const contRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    let left = parseFloat(noBtn.style.left || 0);
    let top = parseFloat(noBtn.style.top || 0);
    const maxLeft = Math.max(0, contRect.width - btnRect.width - 8);
    const maxTop = Math.max(0, contRect.height - btnRect.height - 8);
    if (left > maxLeft) left = maxLeft;
    if (top > maxTop) top = maxTop;
    noBtn.style.left = `${left}px`;
    noBtn.style.top = `${top}px`;
  });

  // Small friendly initial wiggle so it's obvious the No button won't cooperate
  setTimeout(() => {
    moveNo();
  }, 600);

})();
