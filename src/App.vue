<template>
  <div id="app">
    <json-builder v-if="nodes && nodes.length" :nodes="nodes"/>
    <div v-else>
      You have no nodes so far, start with a template of your choice!
    </div>
    
    <vuesualizer :nodes="nodes" @change="handleChangeNodes" @save="handleSaveNodes"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import Node from '@/types/Node';
import Vuesualizer from '@/components/Vuesualizer.vue';
import JsonBuilder from '@/components/JsonBuilder';

@Component({
  components: {
    Vuesualizer, JsonBuilder
  }
})
export default class App extends Vue {
  private nodes: Node[] = [];
  
  private handleChangeNodes(nodes: any) {
    this.nodes = nodes;
  }

  private handleSaveNodes() {
    console.log('Saving...');
    
  }
}
</script>
<style lang="stylus">
@import './assets/variables.styl'

#app
  font-family font-family
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px

    // li
    //   padding-left: 10px
.vuesualizer
  &-node-is
    cursor pointer

  &-node-wrapper
    flex 1
  // &-sidebar-slot
  //   position absolute
//   &-node-wrapper
.hidden
  display none

.slide
  &-left
    &-leave-active,
    &-enter-active
      transition .4s
      width sidebar-width

    &-enter-active
      position relative

    &-leave-active
      position absolute

    &-enter
      transform translate(100%, 0)

    &-leave-to 
      transform translate(-100%, 0)

  &-right
    &-leave-active,
    &-enter-active
      transition .4s
      width sidebar-width

    &-enter-active
      position absolute
      top 0

    &-leave-active
      position relative

    &-enter
      transform translate(-100%, 0)

    &-leave-to 
      transform translate(100%, 0)
// .slide-leave-active,
// .slide-enter-active
//   transition .4s

// .slide-enter
//   transform translate(100%, 0)

// .slide-leave-to 
//   transform translate(-100%, 0)
.vue-scrollbar__area
  width 100%
</style>