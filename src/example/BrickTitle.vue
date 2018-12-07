<template>
  <h1>{{ title }}</h1>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BrickTitle extends Vue {

  @Prop({
    validator: (value) => {
      return 'string' === typeof(value);
    }
  })
  private title: any;
}
</script>


<style>

</style>
