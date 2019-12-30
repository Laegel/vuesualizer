<template>
  <div class="vuesualizer-nodeview" @click="handleClickNode">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import Node from '@/types/Node';
import { bus } from '@/components/Bus';

@Component
export default class  extends Vue {
  @Prop(Object)
  private node: Node;

  private handleClickNode() {
    bus.$emit('edit-node', this.node);
  }
}
</script>

<style scoped>

</style>