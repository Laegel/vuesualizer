<template>
  <div class="vuesualizer-brick-list">
    <ul>
      <li v-for="brick of bricks" :key="brick.name">
        {{brick.name}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BrickList extends Vue {
  @Prop({
    type: Object
  }) private bricks: any;
}
</script>

<style scoped>

</style>