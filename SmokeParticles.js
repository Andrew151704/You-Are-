import * as THREE from 'three';

export class SmokeParticles {
  constructor() {
    this.count = 3000;
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    this.velocities = [];

    for (let i = 0; i < this.count; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 140;
      positions[idx + 1] = Math.random() * 35;
      positions[idx + 2] = (Math.random() - 0.5) * 140;

      this.velocities.push({
        x: (Math.random() - 0.5) * 0.03,
        y: Math.random() * 0.03 + 0.015,
        z: (Math.random() - 0.5) * 0.03
      });
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.material = new THREE.PointsMaterial({
      color: 0x44444e,
      size: 0.7,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  update(progress) {
    this.material.opacity = progress * 0.85;

    const posAttr = this.geometry.attributes.position;
    const array = posAttr.array;

    for (let i = 0; i < this.count; i++) {
      const idx = i * 3;
      array[idx + 1] += this.velocities[i].y * (1 + progress * 2);

      if (array[idx + 1] > 40) {
        array[idx + 1] = 0;
      }
    }

    posAttr.needsUpdate = true;
    this.points.rotation.y += 0.0006;
  }
}
