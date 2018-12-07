<template>
  <p :class="className"><span>{{ paragraph }}</span></p>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BrickParagraph extends Vue {

  @Prop(String)
  private paragraph: any;

  @Prop(String)
  private className: string;
}
</script>


<style>

</style>
