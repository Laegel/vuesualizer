<template>
  <div>
    <img :src="src" alt="">
    <div v-if="colorFilter" :style="resolveColorFilter"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BrickImage extends Vue {
  @Prop(String)
  src: string;

  @Prop(String)
  colorFilter: string;

  private get resolveColorFilter() {
    return 'background-color: rgba(255, 255, 255, .3)';
  }
}
</script>

<style scoped>

</style>