import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component({
  render(h) {
    return h((this as any).is, {
      props: (this as any).properties,
      on: {
        input: (this as any).handleOnInput
      }
    });
  }
})
export default class NodeEditorInput extends Vue {
  @Prop(Object)
  private configuration: any;

  @Prop(String)
  private type: string;

  private get is() {
    return this.configuration.is;
  }

  private get properties() {
    return this.configuration.props;
  }

  @Emit('input')
  private handleOnInput(event: any) {
    return event;
  }

  private resolveComponentByType() {
    
  }
}
