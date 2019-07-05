import * as THREE from 'three';
import { Component, Provide, Vue } from 'vue-property-decorator';

@Component({ name: 'Scene' })
export default class Scene extends Vue {
  protected $requestAnimationFrameId: number = 0;
  @Provide('timestamp') protected timestamp: { value: number} = { value: 0 };

  get renderer(): THREE.Renderer {
    return new THREE.WebGLRenderer({
      antialias: true,
    });
  }

  get camera(): THREE.Camera {
    const camera = new THREE.PerspectiveCamera();
    camera.position.z = 5;
    return camera;
  }

  @Provide('parentObject3D')
  get scene(): THREE.Scene {
    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    return scene;
  }

  protected render(createElement) {
    return createElement('div', this.$slots.default);
  }

  protected renderScene(timestamp?) {
    this.timestamp.value = timestamp;
    this.$requestAnimationFrameId = requestAnimationFrame(this.renderScene);

    const renderer = this.renderer;
    const camera: THREE.PerspectiveCamera = this.camera as THREE.PerspectiveCamera;
    const scene = this.scene;

    const width = this.$el.clientWidth;
    const height = this.$el.clientHeight;

    const aspect = width / height;

    if (renderer && scene && camera) {
      renderer.setSize(width, height);
      renderer.domElement.style.display = 'block';

      if (camera.aspect !== aspect) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }

      renderer.render(
        scene,
        camera,
      );
    }
  }

  protected mounted() {
    const renderer = this.renderer;
    renderer.domElement.style.display = 'block';
    if (renderer) {
      this.$el.append(renderer.domElement);
    }
    requestAnimationFrame(this.renderScene);
  }

  protected destroy() {
    if (this.$requestAnimationFrameId) {
      cancelAnimationFrame(this.$requestAnimationFrameId);
    }
  }
}
