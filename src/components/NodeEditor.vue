<template>
  <div class="vuesualizer-node-editor">
    <sidebar-top :label="label">
      <back-button/>
    </sidebar-top>
    <div class="vuesualizer-node-editor-properties-container">
      <div 
        v-for="(property, key) in properties"
        :key="key"
        class="vuesualizer-node-editor-properties row"
      >
        <div class="vuesualizer-node-editor-property col-md-3">{{ displayPropertyLabel(key) }}:</div>
        <div class=" col-md-9">
          <node-editor-input
            :configuration="configure(key)"
            @input="handleInput($event, key)"
          />
        </div>
      </div>
    </div>
    <b-button block @click="handleClickRemove" variant="danger">
      <fa-icon icon="trash"/> {{ $vuesualizerTranslate('delete') }}
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import Node from '@/types/Node';
import Bus,{ bus } from '@/components/Bus';
import getValue from 'get-value';
import NodeEditorInput from '@/components/NodeEditorInput';

@Component({
  components: {
    NodeEditorInput
  }
})
export default class NodeEditor extends Vue {
  @Prop(Object)
  private values: any;

  @Prop(Object)
  private properties: any;

  @Prop(String)
  private label: string;

  @Prop(Object)
  private node: Node;

  private options: any = {};

  private handleInput(value: any, key: string) {
    const property: any = this.properties[key];
    const resolved = !property ? value : this.resolveValue(value, key);
    // if (property && !this.checkIfEmpty()) {

    // } else if (property && !this.validateValue(value, key)) {

    // }
    this.$set(this.values, key, this.cast(value, key));
    bus.$emit('update-node', this.values);
  }

  private resolveValue(value: any, key: string) {
    return (!value && this.properties[key].default) ?
      this.properties[key].default :
      value
    ;
  }

  private validateValue(value: any, key: string): boolean {
    // TODO
    
    return true;
  }

  private cast(value: any, key: string) {
    if (this.properties[key] && this.properties[key].type) {
      if (Number === this.properties[key].type) {
        return parseInt(value, 10);
      }
    }
    return value;
  }

  private handleClickRemove() {
    bus.$emit('remove-node');
  }

  private resolveInputType(property: string) {
    if (getValue(this.properties, property + '.type')) {
      return this.matchValueTypeToInputType(this.properties[property].type);
    } else if (getValue(Bus.bricksConfig[this.node.is], 'propsConfig.' + property)) {
      return Bus.bricksConfig[this.node.is].propsConfig[property].type;
    }
    return 'string';
  }

  private resolveComponentType(property: string) {
    const type = this.resolveInputType(property);
    let componentType = 'b-form-input';
    if ('number' === type) {
      componentType = 'b-form-input';
      this.options[property].type = 'number';
    }

    return componentType;
  }

  private matchValueTypeToInputType(valueType: any) {
    return valueType.name ? valueType.name.toLowerCase() : valueType;
  }

  private displayPropertyLabel(property: string) {
    return getValue(Bus.bricksConfig[this.node.is], 'propsConfig.' + property + '.label') ? 
      Bus.bricksConfig[this.node.is].propsConfig[property].label : 
      property
    ;
  }

  private getInputOptions(property: string) {
    return getValue(Bus.bricksConfig[this.node.is], 'propsConfig.' + property + '.options') ? 
      Bus.bricksConfig[this.node.is].propsConfig[property].options : 
      []
    ;
  }

  private configure(property: string) {
    this.options[property] = {
      value: this.values[property]
    };
    return { 
      is: this.resolveComponentType(property), 
      props: this.options[property] 
    };
  }
}
</script>

<style lang="stylus" scoped>
.vuesualizer-node-editor
  height 100%
  display flex
  flex-direction column

  &-properties
    display flex

  &-properties-container
    flex 1

  &-property
    font-size .8em

  &-remove
    height 40px
    width 40px
    border 1px solid #333
    box-sizing border-box
</style>