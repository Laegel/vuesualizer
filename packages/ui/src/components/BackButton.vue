<template>
  <button 
    class="vuesualizer-back-button"
    @click="handleClickBack"
    :title="$vuesualizerTranslate('back')"
  >
    <fa-icon icon="arrow-left"/>
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { bus } from '@/components/Bus';

@Component
export default class  extends Vue {
  private handleClickBack() {
    bus.$emit('change-state', 'tree-view');
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/variables.styl'
.vuesualizer-back-button
  cursor pointer
  height 40px
  width 40px
  background transparent
  border 1px solid #333
  color text-color
</style>