import Scene from './components/scenes/Scene';

export default {
  Scene,
  install(Vue, options) {
    Vue.component('v3c-scene', Scene);
  },
};
