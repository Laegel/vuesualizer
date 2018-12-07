<template>
  <div class="vuesualizer">
    <sidebar :slide-effect="slideEffect">
      <div v-if="isShown('tree-view')" class="tree-view-container">
        <scrollbar 
          class="vuesualizer-scrollbar" 
          :style="{ maxHeight: '100%', background: 'transparent', display: 'flex', width: '100%', flex: 1 }"
          ref="scrollbar"
        >
          <tree-view v-if="innerNodes[0]" :nodes="[innerNodes[0]]">
            <div 
              class="vuesualizer-node-wrapper"
              slot="node"
              slot-scope="node"
              :data-slot="node.dataObject.slot"
            >
              <span
                @click="handleEditNode(node.id)"
                class="vuesualizer-node-is"
              >
                <!-- {{ node.id }} -->
                {{ displayNodeLabelOrType(node) }}
              </span>
            </div>
          </tree-view>
        </scrollbar>
        <b-button
          v-if="innerNodes && !innerNodes.length"
          @click="handleClickImportTemplate"
          variant="primary"
          block
        >
          <fa-icon icon="file-import"/> {{ $vuesualizerTranslate('templateChoice') }}
        </b-button>
        <b-button 
          v-if="innerNodes && innerNodes.length"
          @click="handleClickSaveTree"
          variant="primary"
          block
        >
          <fa-icon icon="save"/> {{ $vuesualizerTranslate('save') }}
        </b-button>
      </div>
      <template-choice
        v-else-if="isShown('template-choice')"
      />
      <brick-choice
        v-else-if="isShown('brick-choice')"
        :current-brick-key="innerNodes[currentIndex].is"
      />
      <node-editor
        v-else-if="isShown('node-editor')"
        :properties="properties"
        :values="values"
        :label="displayNodeLabelOrType(innerNodes[currentIndex])"
        :node="innerNodes[currentIndex]"
      />
    </sidebar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import Node from '@/types/Node';
import Sidebar from '@/components/Sidebar.vue';
import TreeView from '@/components/TreeView.vue';
import NodeView from '@/components/NodeView.vue';
import TemplateChoice from '@/components/TemplateChoice.vue';
import BrickChoice from '@/components/BrickChoice.vue';
import NodeEditor from '@/components/NodeEditor.vue';
import Bus, { bus } from '@/components/Bus';
import { uuid } from 'vue-uuid';


@Component({
  components: {
    Sidebar, TreeView, NodeView, NodeEditor,
    BrickChoice, TemplateChoice
  }
})
export default class Vuesualizer extends Vue {
  private hoveredNodeId: string = '';
  private nodeId: string = '';
  private properties: any = {};
  private values: any = {};

  private state = 'tree-view';
  private slideEffect = 'slide-left';

  private currentIndex: number;
  private currentNode: Node | null = null;
  private currentSlot: string | null = null;

  get showSidebar() {
    return 0 !== Object.keys(this.properties).length;
  }

  @Prop({
    type: Array,
    required: true
  })
  private nodes: Node[];

  private innerNodes: Node[] = [];

  private components: any = {};

  public mounted() {
    // this.components = Bus.templatesConfig['demo-tpl'].nodes;
    if (Object.keys(this.components).length) {
      this.prepareNodes({ ...this.components });
    }

    bus.$on('choose-template', this.handleChooseTemplate);
    bus.$on('choose-brick', this.handleChooseBrick);
    bus.$on('save-node', this.handleSaveNode);
    bus.$on('update-node', this.handleUpdateNode);
    bus.$on('remove-node', this.handleRemoveNode);
    bus.$on('change-state', this.handleChangeState);
    bus.$on('drag', this.handleDrag);
  }

  private prepareNodes(node: Node, parentNode: Node | null = null) {

    if (parentNode) {
      node.parent = parentNode;
    }

    this.$set(node, 'id', uuid.v1());
    this.innerNodes.push(node);
    if (node.children) {
      node.children.forEach((child: any, index: number) => {
        this.prepareNodes(child, node);
      });
    }

    if (Array.isArray(node)) {
      node.forEach(item => {
        this.prepareNodes(item, node);
      });
    }

    if (!node.dataObject) {
      this.$set(node, 'dataObject', {});
    }

    if (!(node.dataObject as any).attrs) {
      this.$set((node.dataObject as any), 'attrs', {});
    }
    (node.dataObject as any).attrs['data-is'] = node.is;
  }

  @Emit('change')
  private handleEditNode(id: number) {
    this.currentIndex = this.getNodeIndexById(id);
    const node = this.innerNodes[this.currentIndex];
    this.handleChangeState('node-editor');

    this.properties = Bus.bricksConfig[node.is].component.options.props;
    this.values = (node.dataObject as any).props;
    return this.innerNodes;
  }

  @Emit('change')
  private handleChooseTemplate(template: any) {
    this.innerNodes = [];
    this.prepareNodes(template.nodes);
    return this.innerNodes;
  }

  private handleChooseBrick(parentId: number, slot: string) {
    this.currentIndex = this.getNodeIndexById(parentId);
    this.currentSlot = slot;
    this.handleChangeState('brick-choice');
  }

  @Emit('change')
  private handleSaveNode(is: string) {
    const componentProps = Bus.bricksConfig[is].component.options.props;
    const props: any = {};
    for (const prop in componentProps) {
      if (componentProps.hasOwnProperty(prop)) {
        const componentProp = componentProps[prop];
        props[prop] = componentProp.default || (
          Number === componentProp.type ? 0 : ''
        );
      }
    }
    const parent = this.innerNodes[this.currentIndex];
    const id = uuid.v1();
    const index = this.innerNodes.length;

    const node: Node = {
      is,
      parent,
      id,
      dataObject: { props, slot: this.currentSlot as string },
    };

    this.currentIndex = index;
    this.handleChangeState('node-editor');

    this.properties = Bus.bricksConfig[node.is].component.options.props;
    this.values = (node.dataObject as any).props;

    if (!parent.children) {
      this.$set(parent, 'children', []);
    }
    (parent.children as any[]).push(node as Node);
    this.innerNodes.push(node);
    return this.innerNodes;
  }

  private removeNodeByIndex(index: number) {
    if (0 === index) {
      this.innerNodes = [];
      return;
    }
    const node = this.innerNodes[index];
    if (node.parent) {
      const childIndex = (node.parent as any).children.indexOf(node);
      (node.parent as any).children.splice(childIndex, 1);
    }
    this.innerNodes.splice(index, 1);
  }

  @Emit('change')
  private handleUpdateNode(values: any) {
    this.$set((this.innerNodes[this.currentIndex] as any).dataObject, 'props', values);
    return this.innerNodes;
  }

  @Emit('change')
  private handleRemoveNode() {
    this.removeNodeByIndex(this.currentIndex);
    this.handleChangeState('tree-view');
    return this.innerNodes;
  }

  private handleChangeState(state: string) {
    this.slideEffect = 'slide-' + ('tree-view' === state ? 'right' : 'left');
    this.state = state;
    if ('tree-view' === state) {
      this.currentIndex = -1;
      this.currentSlot = '';
      this.properties = {};
      this.values = {};
    }
  }

  @Emit('change')
  private handleDrag(nodeId: number, siblingNodeId: number, position: 'before' | 'after') {
    const ids = this.innerNodes.map((item: Node) => item.id);
    const node = this.innerNodes[ids.indexOf(nodeId)];
    const childIndex = (node.parent as any).children.indexOf(node);
    (node.parent as any).children.splice(childIndex, 1);

    const parent = (this.innerNodes[ids.indexOf(siblingNodeId)] as any).parent;
    if (1 === parent.children.length && 'before' === position) {
      parent.children.unshift(node);
    } else if (1 === parent.children.length && 'after' === position) {
      parent.children.push(node);
    } else {
      const siblingsIds = parent.children.map((child: Node) => child.id);
      const siblingNodeIndex = siblingsIds.indexOf(siblingNodeId);
      const indexToInsertAt = 'before' === position ? siblingNodeIndex : siblingNodeIndex + 1;
      parent.children.splice(indexToInsertAt, 0, node);
    }
    return this.innerNodes;
  }

  private getNodeIndexById(id: number) {
    return this.innerNodes.map((node: Node) => node.id).indexOf(id);
  }

  private enableNodesRerender() {
    this.innerNodes.forEach((node: any) => {
      node.processed = false;
    });
  }

  private handleAddNode(node: Node, slot: string) {
    this.currentNode = node;
    this.currentSlot = slot;
    this.handleChangeState('brick-choice');
  }

  private displayNodeLabelOrType(node: Node) {
    return Bus.bricksConfig[node.is].label || node.is;
  }

  private isShown(component: string) {
    return this.state === component;
  }

  private log(...obj: any[]) {
    console.log('-In template log-', obj);
  }

  private handleClickImportTemplate() {
    this.handleChangeState('template-choice');
  }

  @Emit('save')
  private handleClickSaveTree() {
    const copy = [...this.innerNodes];

    const recurs = (node: Node) => {
      const tmp = { ...node };
      delete tmp.children;

      if (node.children) {
        tmp.children = [];
        node.children.forEach((child: Node, index: number) => {
          (tmp.children as any)[index] = recurs(child);
        });
      }
      delete tmp.parent;
      delete tmp.id;
      tmp.dataObject = JSON.parse(JSON.stringify(tmp.dataObject));
      return tmp;
    };
    return recurs(copy[0]);
  }
}
</script>

<style lang="stylus" scoped>
.vuesualizer {

}
</style>
