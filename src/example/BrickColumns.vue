<template>
  <section>
    <div 
      v-for="column in columns" 
      :style="'width: ' + (100 / (columns)) + '%'" :key="column"
    >
      <slot :name="'slot-' + (column - 1)">{{ 'slot-' + (column - 1) }}</slot>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BrickColumns extends Vue {
  @Prop({
    type: Number,
    default: 1,
    validator(value: any) {
      return 1 <= value && value <= 12;
    }
  })
  private columns: number;
}
</script>


<style lang="stylus" scoped>
section
  display: flex
</style>
