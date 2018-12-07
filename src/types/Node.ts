import { VNodeData } from 'vue';

export default interface Node {
  is: string;
  dataObject?: VNodeData;
  textNode?: string;
  parent?: Node;
  children?: Node[];
  isLocked?: boolean;
  category?: string;

  id?: number;
}
