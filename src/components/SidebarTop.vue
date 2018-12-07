<template>
  <div class="vuesualizer-sidebar-top">
    <slot/>
    <div class="vuesualizer-sidebar-top-label">
      {{ label }}  
    </div>  
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class SidebarTop extends Vue {
  @Prop(String)
  private label: string;
}
</script>

<style lang="stylus" scoped>
@import '../assets/variables.styl'
.vuesualizer-sidebar-top
  display flex
  background darken(background-color, 10%)

  &-label
    box-sizing border-box
    border-bottom 1px solid #333
    flex 1
    height 40px
    padding 10px 0
</style>