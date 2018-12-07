<template>
  <div class="wrapper">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class BrickWrapper extends Vue {}
</script>

<style scoped>

</style>