import * as THREE from 'three';
import { Component, Prop, Provide, Inject, Vue, Watch } from 'vue-property-decorator';

type XYZ = [number, number, number];

function xyzDefaultValueFn(defaultValue: number = 0): () => XYZ {
  return () => {
    return [defaultValue, defaultValue, defaultValue];
  };
}

@Component({ name: 'Object3D' })
export default class Object3D extends Vue {

  @Provide('parentObject3D') get object3D(): THREE.Object3D | null {
    return new THREE.Object3D();
  }
  protected name = 'Object3D';

  @Inject({ default: null }) protected parentObject3D!: THREE.Object3D;
  @Inject({ default: 0 }) protected timestamp!: { value: number};
  @Prop({ default: xyzDefaultValueFn(0) }) private position!: XYZ;
  @Prop({ default: xyzDefaultValueFn(0) }) private rotation!: XYZ;
  @Prop({ default: xyzDefaultValueFn(1) }) private scale!: XYZ;

  protected render(createElement) {
    return createElement('span', { style: { display: 'none' } }, this.$slots.default);
  }

  @Watch('object3D', { immediate: true })
  protected object3DChange(object3D, oldObject3D) {
    if (this.parentObject3D) {
      this.parentObject3D.add(object3D);
      this.parentObject3D.remove(oldObject3D);
    }
  }

  @Watch('position', { immediate: true, deep: true })
  protected updatePosition(val?: string, oldVal?: string) {
    const object3D = this.object3D;
    const [x, y, z] = this.position;
    if (object3D) {
      object3D.position.x = Number(x);
      object3D.position.y = Number(y);
      object3D.position.z = Number(z);
    }
  }

  @Watch('scale', { immediate: true, deep: true })
  protected updateScale(val?: string, oldVal?: string) {
    const object3D = this.object3D;
    const [x, y, z] = this.scale;
    if (object3D) {
      object3D.scale.x = Number(x);
      object3D.scale.y = Number(y);
      object3D.scale.z = Number(z);
    }
  }

  @Watch('rotation', { immediate: true, deep: true })
  protected updateRotation(val?: string, oldVal?: string) {
    const object3D = this.object3D;
    const [x, y, z] = this.rotation;
    if (object3D) {
      object3D.rotation.x = Number(x);
      object3D.rotation.y = Number(y);
      object3D.rotation.z = Number(z);
    }
  }

  @Watch('timestamp.value', { immediate: true, deep: true })
  protected timestampChange(timestamp, oldTimestamp = 0) {
    this.updateFn(timestamp, oldTimestamp, timestamp - oldTimestamp);
  }

  protected updateFn(timestamp, oldTimestamp, timestampDiff) {
    // Do no thing
  }

  protected lookAt(x: number | THREE.Vector3, y: number , z: number) {
    if (!this.object3D) {
      return;
    }
    this.object3D.lookAt(x, y, z);
    this.$emit('update:rotation', [
      this.object3D.rotation.x,
      this.object3D.rotation.y,
      this.object3D.rotation.z,
    ]);
  }

  protected beforeDestroy() {
    if (this.object3D || this.parentObject3D) {
      this.parentObject3D.remove(this.object3D);
    }
  }

  protected deactivated() {
    if (this.object3D || this.parentObject3D) {
      this.parentObject3D.remove(this.object3D);
    }
  }

  protected activated() {
    if (this.parentObject3D) {
      this.parentObject3D.add(this.object3D);
    }
  }
}
