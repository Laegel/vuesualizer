import Vue from 'vue';
import App from './App.vue';
import { bus } from '@/components/Bus';
import SidebarTop from '@/components/SidebarTop.vue';
import BackButton from '@/components/BackButton.vue';
import Vuesualizer from './vuesualizer';
import Node from '@/types/Node';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSave, faFileImport, faGripVertical, faChevronLeft, faChevronRight,
  faChevronDown, faChevronUp, faPlus, faTrash, faTimes, faArrowLeft,
  faCheck, faImage
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import BootstrapVue from 'bootstrap-vue';

import ScrollBar from 'vue2-scrollbar';
Vue.component('scrollbar', ScrollBar);
import 'vue2-scrollbar/dist/style/vue2-scrollbar.css';
Vue.use(BootstrapVue);
import '@/assets/bootstrap.min.css';
import '@/assets/bootstrap-theme.min.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
[
  faSave, faFileImport, faGripVertical,
  faChevronLeft, faChevronRight,
  faChevronDown, faChevronUp,
  faPlus, faTrash, faTimes,
  faArrowLeft, faCheck, faImage
].forEach((icon: any) => {
  library.add(icon);
});

Vue.component('fa-icon', FontAwesomeIcon);

import BrickWrapper from '@/example/BrickWrapper.vue';
import BrickColumns from '@/example/BrickColumns.vue';
import BrickContainer from '@/example/BrickContainer.vue';
import BrickTitle from '@/example/BrickTitle.vue';
import BrickParagraph from '@/example/BrickParagraph.vue';
import BrickNewsletter from '@/example/BrickNewsletter.vue';
import BrickImage from '@/example/BrickImage.vue';

Vue.use(Vuesualizer, {
  categoriesConfig: {
    default: 'Default',
    layout: 'Layout',
    structure: 'Structure',
    block: 'Block',
    text: 'Text'
  },
  templatesConfig: {
    'demo-tpl': {
      label: 'Demo template',
      nodes: {
        is: 'brick-wrapper',
        children: [
          {
            is: 'brick-container',
            children: [
              {
                is: 'brick-title',
                dataObject: {
                  props: {
                    title: 'This is a custom component',
                  }
                }
              },
              {
                is: 'brick-paragraph',
                dataObject: {
                  props: {
                    paragraph: 'Here is my text, blablabla',
                  }
                }
              }
            ]
          },
          {
            is: 'brick-container'
          },
          {
            is: 'brick-columns',
            dataObject: {
              props: {
                columns: 2
              }
            }
          },
          {
            is: 'brick-paragraph',
            dataObject: {
              props: {
                paragraph: 'Paragraph',
              }
            }
          },
          {
            is: 'brick-paragraph',
            dataObject: {
              props: {
                paragraph: 'Paragraph',
              }
            }
          },
          {
            is: 'brick-paragraph',
            dataObject: {
              props: {
                paragraph: 'Paragraph',
              }
            }
          },
          {
            is: 'brick-paragraph',
            dataObject: {
              props: {
                paragraph: 'Paragraph',
              }
            }
          }
        ]
      }
    },
    'first-tpl': {
      label: 'First template',
      nodes: {
        is: 'brick-wrapper',
        children: [
          {
            is: 'brick-title',
            dataObject: {
              props: {
                title: 'This is a title',
              }
            }
          },
          {
            is: 'brick-paragraph',
            dataObject: {
              props: {
                paragraph: 'Here is a paragraph',
              }
            }
          }
        ]
      }
    }
  },
  bricksConfig: {
    'brick-wrapper': {
      label: 'Wrapper',
      component: BrickWrapper,
      slots: ['default'],
      category: 'layout'
    },
    'brick-container': {
      label: 'Container',
      component: BrickContainer,
      slots: ['default'],
      category: 'structure',
      accepts: {
        regex: '^brick-', // 0, Will exclude any brick which name starts with brick-
        include: ['brick-columns', 'self'], // 1, Will include single brick - brick-columns
        exclude: [], // 2, Will exclude single brick - self, brick-container here
      }
    },
    'brick-columns': {
      label: 'Columns',
      component: BrickColumns,
      category: 'structure',
      propsConfig: {
        columns: {
          label: 'Amount of columns'
        }
      },
      slots(node: Node) {
        return node.dataObject && node.dataObject.props && node.dataObject.props.columns ?
          ((count) => {
            const slots: string[] = [];
            for (let i = 0; i < count; ++i) {
              slots.push('slot-' + i);
            }
            return slots;
          })(node.dataObject.props.columns) :
          []
        ;
      }
    },
    'brick-title': {
      label: 'Title',
      component: BrickTitle,
      category: 'text'
    },
    'brick-paragraph': {
      label: 'Paragraph',
      component: BrickParagraph,
      category: 'text'
    },
    'brick-newsletter': {
      label: 'Newsletter',
      component: BrickNewsletter,
      category: 'block'
    },
    'brick-image': {
      label: 'Image',
      component: BrickImage
    }
  }
});

Vue.component('BackButton', BackButton);
Vue.component('SidebarTop', SidebarTop);

Vue.config.productionTip = false;

const language = 'en';

import languages from './languages';

const translator = {
  install() {
    Vue.prototype.$vuesualizerTranslate = (key: string) => {
      return languages[language][key] || key;
    };
  }
};

Vue.use(translator);

const triggerEdit = (nodeId: string | undefined, vnode: any) => {
  return () => {
    if (vnode.componentInstance) {
      bus.$emit(
        'editNode',
        nodeId,
        { ...vnode.componentInstance.$options.props },
        { ...vnode.componentInstance.$options.propsData }
      );

      // vnode.context.$root.$emit(
      //   'editNode',
      //   nodeId,
      //   { ...vnode.componentInstance.$options.props },
      //   { ...vnode.componentInstance.$options.propsData }
      // );
    }
  };
};

const triggerAdd = (nodeId: string | undefined, vnode: any) => {
  return () => {
    if (vnode.componentInstance) {
      // vnode.context.$root.$emit(
      //   'addNode',
      //   nodeId
      // );
      bus.$emit(
        'addNode',
        nodeId
      );
    }
  };
};


Vue.directive('editable', {
  // When the bound element is inserted into the DOM...
  inserted(el, binding, vnode, oldnode) {
    // console.log(vnode, (vnode.componentInstance as any).$slots);
    el.addEventListener('click', triggerEdit(el.dataset.vz, vnode));
    el.addEventListener('mouseenter', triggerAdd(el.dataset.vz, vnode));
  },
  bind() {
    // console.log(arguments);
  },
  unbind(el, binding, vnode, oldnode) {
    el.removeEventListener('click', triggerEdit(el.dataset.vz, vnode));
  }
});

new Vue({
  render: h => h(App)
}).$mount('#app');
