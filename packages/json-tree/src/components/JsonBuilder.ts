import { Vue, Prop, Component } from 'vue-property-decorator';
import Node from '@/types/Node';

/*
Credit goes to https://medium.com/@harin76/generate-vue-js-components-from-a-json-javascript-dom-structure-a76534478d15
*/
// const createComponent = (node: Node, h: any): any => {
//   // Handle empty elements and return empty array in case the node passed in is empty
//   if (!node) {
//     return [];
//   }

  // // if the el is array call createComponent for all nodes
  // if (Array.isArray(node)) {
  //   return node.map((child: any, index: any) => {
  //     return createComponent(child, h);
  //   });
  // }

  // const children: any[] = [];

  // if (node.children && node.children.length > 0) {
  //   node.children.forEach((c: any, index: any) => {
  //     if ('string' === typeof(c)) {
  //       children.push(c);
  //     } else {
  //       children.push(createComponent(c, h));
  //     }
  //   });
  // }
  // node.instance = h(node.is, { ...node.dataObject }, 0 < children.length ? children : node.textNode);
  // return node.instance;
  // if (node.processed) {
  //   return;
  // }

//   const children: Node[] = [];
//   if (node.children && 0 < node.children.length) {
//     node.children.forEach((c: Node) => {
//       if ('string' === typeof(c)) {
//         children.push(c);
//       } else {
//         children.push(createComponent(c, h));
//       }
//     });
//   }
//   return h(node.is, { ...node.dataObject }, 0 < children.length ? children : node.textNode);
// };

@Component
export default class JsonBuilder extends Vue {
  @Prop({
    type: Array,
    required: true
  })
  private nodes: Node[];

  public render(h: any): any {
    return this.createComponent(this.nodes[0], h);
  }

  private createComponent(node: Node, h: any) {
    if (!node) {
      return [];
    }

    const children: Node[] = [];
    if (node.children && 0 < node.children.length) {
      node.children.forEach((c: Node) => {
        if ('string' === typeof (c)) {
          children.push(c);
        } else {
          children.push(this.createComponent(c, h));
        }
      });
    }
    return h(node.is, { ...node.dataObject }, 0 < children.length ? children : node.textNode);
  }
}
