<template>
  <div>
    <sidebar-top :label="$vuesualizerTranslate('templateChoice')">
      <back-button/>
    </sidebar-top>
    <ul v-if="templates">
      <li 
        v-for="(template, name) in templates"
        :key="name"
        @click="handleClickImport(template)"
      >
        {{ template.label }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Bus, { bus } from '@/components/Bus';
import clone from '@/utils/clone';

@Component
export default class TemplateChoice extends Vue {
  private get templates() {
    return Bus.templatesConfig;
  }

  private handleClickImport(template: any) {
    bus.$emit('choose-template', clone(template));
  }
}
</script>

<style scoped>

</style>