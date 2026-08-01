import * as THREE from 'three';

export class PostProcessing {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }
    );

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: this.renderTarget.texture },
        uProgress: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform sampler2D tDiffuse;
        uniform float uProgress;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          
          float offset = uProgress * 0.008;
          float r = texture2D(tDiffuse, uv + vec2(offset, 0.0)).r;
          float g = texture2D(tDiffuse, uv).g;
          float b = texture2D(tDiffuse, uv - vec2(offset, 0.0)).b;

          float dist = distance(uv, vec2(0.5));
          float vignette = smoothstep(0.8, 0.2 + (1.0 - uProgress) * 0.3, dist);

          vec3 color = vec3(r, g, b) * vignette;
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.shaderMaterial);
    this.postScene.add(quad);
  }

  update(progress) {
    this.shaderMaterial.uniforms.uProgress.value = progress;
  }

  render() {
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.postScene, this.postCamera);
  }

  onResize() {
    this.renderTarget.setSize(window.innerWidth, window.innerHeight);
  }
}
