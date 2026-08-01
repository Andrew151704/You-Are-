import gsap from 'gsap';

export class UIController {
  constructor() {
    this.yearEl = document.getElementById('year-num');
    this.healthBar = document.getElementById('health-bar-fill');
    this.hudEl = document.getElementById('hud');
    this.undoContainer = document.getElementById('undo-container');
    this.introOverlay = document.getElementById('intro-overlay');
  }

  hideIntro() {
    gsap.to(this.introOverlay, {
      opacity: 0,
      duration: 1.5,
      ease: 'power3.inOut',
      onComplete: () => {
        this.introOverlay.style.display = 'none';
        gsap.to(this.hudEl, { opacity: 1, duration: 1 });
      }
    });
  }

  updateUI(progress) {
    const currentYear = Math.round(2026 + progress * (2100 - 2026));
    this.yearEl.innerText = currentYear;

    // Dynamic Health Bar percentage & color shift
    const healthPercent = Math.max(0, Math.round((1 - progress) * 100));
    this.healthBar.style.width = `${healthPercent}%`;

    if (healthPercent < 30) {
      this.healthBar.style.backgroundColor = '#ff3355';
    } else {
      this.healthBar.style.backgroundColor = '#00ff88';
    }

    // Act III Prompt Reveal at maximum degradation
    if (progress > 0.94) {
      this.undoContainer.style.opacity = '1';
      this.undoContainer.style.pointerEvents = 'all';
    } else {
      this.undoContainer.style.opacity = '0';
      this.undoContainer.style.pointerEvents = 'none';
    }
  }

  hideUndoPrompt() {
    gsap.to(this.undoContainer, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        this.undoContainer.style.pointerEvents = 'none';
      }
    });
  }
}
