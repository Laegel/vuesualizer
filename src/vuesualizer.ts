import Bus from '@/components/Bus';

export default {
  install(Vue: any, configs: any) {
    for (const brickName in configs.bricksConfig) {
      if (configs.bricksConfig.hasOwnProperty(brickName)) {
        Vue.component(brickName, configs.bricksConfig[brickName].component);
      }
    }
    Bus.bricksConfig = configs.bricksConfig;
    Bus.templatesConfig = configs.templatesConfig;
    Bus.categoriesConfig = configs.categoriesConfig;
  }
};
