<template>
  <div class="vuesualizer-tree-view">
    <ul>
      <li 
        v-for="(node, index) in nodes" 
        :key="node.index"
        :ref="'node-' + index"
        @mousemove="handleDragOver($event, node.id)"
      >
        <div :class="{ 'vuesualizer-tree-view-node': true, 'is-opened': !isCollapsed(node.id) }">
          <span
            @mousedown="handleDragStart($event, node.id)"
            class="vuesualizer-tree-view-node-handler"
          >
            <fa-icon icon="grip-vertical"/>
          </span>
          <slot name="node" v-bind="node"/>
          <div 
            class="vuesualizer-tree-view-node-tools"
            @click="handleClickToggle(node.id)"
            @mouseenter="handleEnterTools(node.id)"
            @mouseleave="handleLeaveTools(node.id)"
          >
            <!-- <div class="tools-wrap" :style="toolsWrapStyles[node.id]">
              <fa-icon icon="trash"/>
            </div> -->
            <span v-if="hasSlots(node)">
              <fa-icon :icon="'chevron-' + (isCollapsed(node.id) ? 'down' : 'up')"/>
            </span>
          </div>
        </div>
        <ul 
          v-if="node && hasSlots(node)" 
          :class="{ 'vuesualizer-tree-view-slots': true, 'is-collapsed': isCollapsed(node.id) }"
        >
          <li v-for="slot in getSlots(node)" :key="slot">
            <template v-if="node.children">
              <tree-view :nodes="filterNodesBySlot(node.children, slot)">
                <template slot="node" slot-scope="child">
                  <slot name="node" v-bind="child"/>
                </template>
              </tree-view>
            </template>
            <button
              @click="handleAddBrick(node.id, slot)"
              :data-node="node.id"
              class="vuesualizer-tree-view-add"
            >
              <fa-icon icon="plus"/> {{ 'default' !== slot ? slot : '' }}
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import NodeView from './NodeView.vue';
import Node from '@/types/Node';
import Bus, { bus } from '@/components/Bus';
import Store from '@/decorators/Store';
import setStyles from '@/utils/style';

@Component({
  name: 'tree-view',
  components: {
    NodeView, TreeView
  }
})
export default class TreeView extends Vue {
  @Prop(Array)
  private nodes: Node[];

  private rendered: string[] = [];

  private expandedTreesIndexes: number[] = [];

  private movingNodeId: number;

  private movingNode: any;
  private initialOffset: any;
  private hoveredState: { id: number, position: 'before' | 'after', offsetY: number };
  private movingNodeHeight: number;

  private movingStates: number[] = [];

  private toolsWrapStyles: any = {};

  public created() {
    if (!Bus.storage.expandedTreesIndexes) {
      Bus.storage.expandedTreesIndexes = [0];
    }
    this.expandedTreesIndexes = Bus.storage.expandedTreesIndexes;
  }

  private filterNodesBySlot(nodes: Node[], slot: string) {
    const filtered: Node[] = [];
    nodes.forEach((node: Node) => {
      const nodeSlot: string = (node.dataObject as any).slot;
      if (('default' === slot && !nodeSlot) || (nodeSlot === slot)) {
        filtered.push(node);
      }
    });
    return filtered;
  }

  private hasSlots(node: Node) {
    return Bus.hasSlots(node);
  }

  private getSlots(node: Node) {
    return Bus.getSlots(node);
  }

  private handleAddBrick(index: number, slot: string) {
    bus.$emit('choose-brick',
      index, slot
    );
  }

  private isCollapsed(id: number) {
    return -1 === this.getIndexOfId(id);
  }

  private getIndexOfId(id: number) {
    return this.expandedTreesIndexes.indexOf(id);
  }

  private handleClickToggle(id: number) {
    const indexOf = this.getIndexOfId(id);
    if (-1 === indexOf) {
      this.expandedTreesIndexes.push(id);
    } else {
      this.expandedTreesIndexes.splice(indexOf, 1);
    }
  }

  private handleDragStart(event: any, id: number) {
    function getCSSPixelValue(stringValue: any) {
      if (stringValue.substr(-2) === 'px') {
        return parseFloat(stringValue);
      }
      return 0;
    }

    function getElementMargin(element: any) {
      const style = window.getComputedStyle(element);

      return {
        top: getCSSPixelValue(style.marginTop),
        right: getCSSPixelValue(style.marginRight),
        bottom: getCSSPixelValue(style.marginBottom),
        left: getCSSPixelValue(style.marginLeft)
      };
    }

    const index = this.getNodeIndexById(id);
    const ref = this.getRefByIndex(index);
    const clone = ref.cloneNode(true);
    clone.classList.add('vuesualizer-dragged');

    const margin = getElementMargin(ref);

    const width = ref.offsetWidth;
    const height = ref.offsetHeight;
    const boundingClientRect = ref.getBoundingClientRect();

    setStyles(clone, {
      position: 'fixed',
      top: boundingClientRect.top - margin.top + 'px',
      left: boundingClientRect.left - margin.left + 'px',
      width: width + 'px',
      height: height + 'px',
      boxSizing : 'border-box',
      pointerEvents: 'none'
    });
    this.movingNodeHeight = height + margin.top + margin.bottom;
    this.movingNode = document.body.appendChild(clone);
    this.initialOffset = this.getOffset(event);
    this.nodes.forEach((node: Node) => {
      this.movingStates.push(0);
    });

    setStyles(ref, {
      opacity: 0,
      visibility: 'hidden'
    });

    document.body.style.cursor = 'n-resize';
    this.movingNodeId = id;
    document.addEventListener('mouseup', this.handleDrop);
  }

  private getRefByIndex(index: number): any {
    return (this.$refs['node-' + index] as any)[0];
  }

  private getNodesIds() {
    return this.nodes.map((node: Node) => node.id);
  }

  private getNodeIndexById(id: number) {
    return this.getNodesIds().indexOf(id);
  }

  private handleDragOver(event: any, id: number) {
    const movingNodeId = this.movingNodeId;
    if (movingNodeId && 0 !== id && movingNodeId !== id) {
      const ids = this.getNodesIds();
      const movingNodeIndex = ids.indexOf(movingNodeId);
      const hoveredNodeIndex = ids.indexOf(id);

      const indexes = this.nodes.map((node: Node, index: number) => index);
      const isGoingDown = movingNodeIndex < hoveredNodeIndex;

      let yTranslate: number;

      const from = movingNodeIndex;
      const to = hoveredNodeIndex;
      const offset = this.getOffset(event);

      let changedDirection = false;
      if (this.hoveredState) {
        changedDirection = isGoingDown ?
          this.hoveredState.offsetY > offset.y :
          this.hoveredState.offsetY < offset.y
        ;
      }

      const sortedIds: any = isGoingDown ? indexes : indexes.reverse();

      sortedIds.forEach((index: number) => {
        if (index === from) {
          return;
        }

        let newMovingState: number;
        if (changedDirection ?
            (isGoingDown ? index > from && index < to : index > to && index < from) :
            (isGoingDown ? index > from && index <= to : index >= to && index < from)
          ) {

          newMovingState = isGoingDown ? -1 : 1;
          yTranslate = isGoingDown ? -this.movingNodeHeight : this.movingNodeHeight;
        } else {
          newMovingState = 0;
          yTranslate = 0;
        }

        this.$set(this.movingStates, index, newMovingState);
        setStyles(this.getRefByIndex(index), {
          transitionDuration: '.3s',
          transform: 'translate3d(0px,' + yTranslate + 'px,0)'
        });
      });

      this.hoveredState = {
        id,
        offsetY: offset.y,
        position: isGoingDown ? (changedDirection ? 'before' : 'after') : (changedDirection ? 'after' : 'before')
      };

      const translate = {
        x: offset.x - this.initialOffset.x,
        y: offset.y - this.initialOffset.y
      };

      setStyles(this.movingNode, {
        transform: 'translate3d(' + translate.x + 'px,' + translate.y + 'px, 0)'
      });
    }
  }

  private getOffset(e: any) {
    return {
      x: e.touches ? e.touches[0].pageX : e.pageX,
      y: e.touches ? e.touches[0].pageY : e.pageY
    };
  }

  private handleDrop(e: any) {
    if (this.hoveredState) {
      const hoveredNodeIndex = this.getNodeIndexById(this.hoveredState.id);
      const hoveredNode = this.getRefByIndex(hoveredNodeIndex);
      // console.log('drop', {...this.hoveredState});
      bus.$emit('drag',
        this.movingNodeId,
        this.hoveredState.id,
        this.hoveredState.position
      );
    }

    this.getRefByIndex(this.getNodeIndexById(this.movingNodeId)).style = null;
    delete this.movingNodeId;
    delete this.hoveredState;
    this.movingStates = [];
    document.body.style.cursor = null;
    document.removeEventListener('mouseup', this.handleDrop);
    this.movingNode.parentNode.removeChild(this.movingNode);

    this.nodes.forEach((node: Node, index: number) => {
      this.getRefByIndex(index as number).style = null;
    });
  }

  private handleEnterTools(id: number) {
    this.$set(this.toolsWrapStyles, id, {
      width: '40px',
    });
  }

  private handleLeaveTools(id: number) {
    this.$set(this.toolsWrapStyles, id, {});
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/variables.styl'
ul
  list-style-type none
  padding 0
  text-align left
  margin 0

.vuesualizer
  &-tree-view
    flex 1
    // Waiting for a scroll component
    // overflow-x hidden

    &-node
      box-sizing border-box
      display flex
      align-items center
      width 100%
      min-height 30px
      background lighten(background-color, 10%)
      padding 2px 6px
      margin-bottom 1px

      &.is-opened
        border-radius: 0 0 0 4px;

      &-handler
        cursor n-resize
        user-select none
        padding 0 4px 0 0

      &-tools
        padding 5px
        cursor pointer

    &-slots 
    
      .vuesualizer-tree-view > ul
        padding-left 10px

      &.is-collapsed
        display none

    &-add
      border 1px dashed #FFF
      background transparent
      width calc(100% - 10px)
      margin-left 10px
      box-sizing border-box
      height 30px
      color #FFF

.tools-wrap
  width 0
  overflow hidden
  transition .4s
  position absolute
  right 10px
  border 1px solid
</style>

<style lang="stylus">
@import '../assets/variables.styl'
.vuesualizer-scrollbar
  background transparent
.vuesualizer-tree-view
  
.vuesualizer-dragged
  list-style-type none

  // button.button
  //   background-color main-co lor
  //   border 1px solid darken(main-color, 10%)
  //   padding 10px 20px
  //   box-sizing border-box
  //   border-radius 4px
  //   color text-color
  //   font-family font-family
  //   cursor pointer
  //   font-weight bold
  //   &.block
  //     margin 5px
  //     width calc(100% - 10px)
  //   &:hover
  //     background-color lighten(main-color, 20%)
</style>
