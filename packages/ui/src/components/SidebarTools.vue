<template>
  <div class="vuesualizer-sidebar-tools">
    <slot/>
    <div 
      @click="handleClickSidebarToggler"
      class="vuesualizer-sidebar-toggler"
    >
      <fa-icon :icon="'chevron-' + (this.isToggled ? 'left' : 'right')"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';

@Component
export default class SidebarTools extends Vue {
  private isToggled = true;

  @Emit('toggle')
  private handleClickSidebarToggler() {
    this.isToggled = !this.isToggled;
    return this.isToggled;
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/variables.styl'
.vuesualizer-sidebar
  &-toggler
    height 40px
    width 25px
    background background-color
    position absolute
    left sidebar-width
    display flex
    align-items center
    cursor pointer

    svg
      margin auto
</style>