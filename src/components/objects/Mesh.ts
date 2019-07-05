import Object3D from '../core/Object3D';
import * as THREE from 'three';
import { Component, Provide, Prop, Watch } from 'vue-property-decorator';
import UnReactiveObj from '../core/UnReactiveObj';

@Component({ name: 'Mesh' })
export default class Mesh extends Object3D {
  public static defaultGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
  public static defaultMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  @Provide('geometrySlots') private geometrySlots: Array<UnReactiveObj<THREE.Geometry>> = [];
  @Provide('materialSlots') private materialSlots: Array<UnReactiveObj<THREE.Material>> = [];

  get object3D() {
    const mesh = new THREE.Mesh( this.geometry, this.material );
    return mesh;
  }

  get geometry() {
    if (this.geometrySlots.length) {
      const unReactiveObj = this.geometrySlots[this.geometrySlots.length - 1];
      return unReactiveObj.get();
    }
    return Mesh.defaultGeometry;
  }

  get material() {
    return Mesh.defaultMaterial;
  }

  @Watch('geometry', { immediate: true, deep: true })
  protected geometryChange(geometry: THREE.Geometry, oldGeometry: THREE.Geometry) {
    this.object3D.geometry = geometry;
    this.object3D.geometry.verticesNeedUpdate = true;
  }
}
