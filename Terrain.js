import * as THREE from 'three';

export class Terrain {
  constructor() {
    this.pristineColor = new THREE.Color(0x1a4331);
    this.pollutedColor = new THREE.Color(0x201511);

    const geometry = new THREE.PlaneGeometry(160, 160, 128, 128);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const elevation = Math.sin(x * 0.06) * Math.cos(z * 0.06) * 5 + Math.sin(x * 0.02) * 3;
      pos.setY(i, elevation);
    }
    geometry.computeVertexNormals();

    this.material = new THREE.MeshStandardMaterial({
      color: this.pristineColor.clone(),
      roughness: 0.8,
      metalness: 0.2,
      flatShading: true
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  update(progress) {
    this.material.color.lerpColors(this.pristineColor, this.pollutedColor, progress);
  }
}
