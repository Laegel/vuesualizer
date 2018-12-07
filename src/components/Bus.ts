import { Vue } from 'vue-property-decorator';
import Node from '@/types/Node';

export default class Bus extends Vue {
  public static bricksConfig: any;
  public static templatesConfig: any;
  public static categoriesConfig: any;
  public static storage: any = {};

  public static hasSlots(node: Node) {
    const slots = this.getSlots(node);
    return slots && slots.length;
  }

  public static getSlots(node: Node) {
    const slots = this.bricksConfig[node.is].slots;
    return 'function' === typeof(slots) ? slots(node) : slots;
  }
}

export const bus = new Bus();
