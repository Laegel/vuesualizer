import Bus from '@/components/Bus';
import '@/types/Callback';
import { createDecorator } from 'vue-class-component';

export default function Store(target: any, key: string) {
  target[key] = Bus.storage[key] = [];
}
