import * as THREE from 'three';
import { Terrain } from './Terrain.js';
import { SmokeParticles } from './SmokeParticles.js';
import { PostProcessing } from './PostProcessing.js';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;

    this.pristineFog = new THREE.Color(0x88bbff);
    this.pollutedFog = new THREE.Color(0x0e0e12);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(this.pristineFog.clone(), 0.01);
    this.scene.background = this.pristineFog.clone();

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 20, 36);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.setupLighting();

    this.terrain = new Terrain();
    this.scene.add(this.terrain.mesh);

    this.smoke = new SmokeParticles();
    this.scene.add(this.smoke.points);

    this.postProcessing = new PostProcessing(this.renderer, this.scene, this.camera);

    window.addEventListener('resize', () => this.onResize());
  }

  setupLighting() {
    this.ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambient);

    this.directional = new THREE.DirectionalLight(0xffffff, 0.9);
    this.directional.position.set(30, 50, 30);
    this.scene.add(this.directional);
  }

  update(progress) {
    this.scene.fog.color.lerpColors(this.pristineFog, this.pollutedFog, progress);
    this.scene.background.lerpColors(this.pristineFog, this.pollutedFog, progress);
    this.scene.fog.density = 0.01 + progress * 0.045;

    this.terrain.update(progress);
    this.smoke.update(progress);
    this.postProcessing.update(progress);

    this.camera.position.y = 20 - progress * 8;
    this.camera.lookAt(0, 0, 0);
  }

  render() {
    this.postProcessing.render();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.postProcessing.onResize();
  }
}
