<template>
  <div>
    {{ sentence }}
    <b-form>
      <b-input type="email"/>
      <b-button>
        <fa-icon icon="check"/> {{ callToActionText }}
      </b-button>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class BrickParagraph extends Vue {
  @Prop(String)
  sentence = '';

  @Prop(String)
  callToActionText = '';
}
</script>


<style lang="stylus" scoped>
form
  display flex
</style>
