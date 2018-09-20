import _Vue from 'vue';

const ContextMenuPlugin = {
  event: new _Vue(),
  install(Vue: typeof _Vue, options: any = {}) {
    this.event = new Vue();

    Vue.prototype.$contextMenu = {
      open(name: string, clickEvent: MouseEvent, params: any) {
        ContextMenuPlugin.event.$emit('toggle', name, clickEvent, params);
      },
      close(name: string) {
        ContextMenuPlugin.event.$emit('toggle', name);
      }
    };
  }
};

export default ContextMenuPlugin;
