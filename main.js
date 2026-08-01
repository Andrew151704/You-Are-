import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SceneManager } from './scene/SceneManager.js';
import { SoundEngine } from './audio/SoundEngine.js';
import { UIController } from './ui/UIController.js';

gsap.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.sceneManager = new SceneManager(this.canvas);
    this.soundEngine = new SoundEngine();
    this.uiController = new UIController();

    this.state = { progress: 0 };
    this.isRestoring = false;

    this.init();
  }

  init() {
    document.getElementById('start-btn').addEventListener('click', () => this.startExperience());
    document.getElementById('undo-btn').addEventListener('click', () => this.triggerRestoration());

    this.animate();
  }

  startExperience() {
    this.soundEngine.init();

    // Pulse intro beat sequence
    this.soundEngine.playHeartbeat();
    setTimeout(() => this.soundEngine.playHeartbeat(), 1000);
    setTimeout(() => this.soundEngine.playHeartbeat(), 2000);

    setTimeout(() => {
      this.uiController.hideIntro();
      this.bindScrollTimeline();
    }, 2500);
  }

  bindScrollTimeline() {
    gsap.to(this.state, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          if (!this.isRestoring) {
            this.onProgressUpdate(self.progress);
          }
        }
      }
    });
  }

  onProgressUpdate(progress) {
    this.state.progress = progress;
    this.sceneManager.update(progress);
    this.soundEngine.updateAudioState(progress);
    this.uiController.updateUI(progress);
  }

  triggerRestoration() {
    this.isRestoring = true;
    this.uiController.hideUndoPrompt();

    gsap.to(this.state, {
      progress: 0,
      duration: 6,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.onProgressUpdate(this.state.progress);
      },
      onComplete: () => {
        this.isRestoring = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.sceneManager.render();
  }
}

new App();
