<template>
  <div :class="classes">
    <sidebar-tools @toggle="handleToggle"/>
    <div class="vuesualizer-sidebar-content">
      <transition :name="slideEffect">
        <slot/>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import SidebarTools from '@/components/SidebarTools.vue';

@Component({
  components: {
    SidebarTools
  }
})
export default class Sidebar extends Vue {

  @Prop({
    type: String,
    default: 'slide-left'
  })
  private slideEffect: string;

  private classes = {
    'vuesualizer-sidebar': true,
    'is-collapsed': false
  };

  private handleToggle(isToggled: boolean) {
    this.classes['is-collapsed'] = !isToggled;
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/variables.styl'
.tree-view-container 
  display flex
  flex-direction column
  height 100%
  
.vuesualizer-sidebar
  position fixed
  top 0
  left 0
  width sidebar-width
  height 100vh
  border 1px solid border-color
  background background-color
  color text-color
  transition .4s
  display flex

  &.is-collapsed
    left -(sidebar-width)

  &-content
    overflow hidden
    width sidebar-width
    height 100%
    display flex
    flex-direction column
</style>