import * as THREE from 'three';
import { Component, Prop, Provide, Inject, Vue, Watch } from 'vue-property-decorator';
import UnReactiveObj from './UnReactiveObj';
import remove from 'lodash.remove';

@Component({ name: 'Geometry' })
export default class Geometry extends Vue {

  get geometry() {
    const geometry = new THREE.Geometry();
    return geometry;
  }
  @Inject('geometrySlots') public geometrySlots: Array<UnReactiveObj<THREE.Geometry>>;

  protected unReactiveObj = new UnReactiveObj<THREE.Geometry>();

  public render(createElement) {
    return createElement('span', { style: { display: 'none' } }, this.$slots.default);
  }

  @Watch('geometry', { immediate: true })
  protected geometryChange(geometry: THREE.Geometry, oldGeometry: THREE.Geometry) {
    this.unReactiveObj.set(geometry);
    if (oldGeometry) {
      oldGeometry.dispose();
    }
  }

  protected created() {
    const removeIndex = this.geometrySlots.indexOf(this.unReactiveObj);
    if (removeIndex === -1) {
      this.geometrySlots.push(this.unReactiveObj);
    }
  }

  protected beforeDestroy() {
    this.geometry.dispose();
    const removeIndex = this.geometrySlots.indexOf(this.unReactiveObj);

    if (removeIndex > -1) {
      this.geometrySlots.splice(removeIndex, 1);
    }
  }

  protected deactivated() {
    const removeIndex = this.geometrySlots.indexOf(this.unReactiveObj);

    if (removeIndex > -1) {
      this.geometrySlots.splice(removeIndex, 1);
    }
  }

  protected activated() {
    const removeIndex = this.geometrySlots.indexOf(this.unReactiveObj);
    if (removeIndex === -1) {
      this.geometrySlots.push(this.unReactiveObj);
    }
  }
}
