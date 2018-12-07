<template>
  <div class="vuesualizer-brick-choice">
    <sidebar-top :label="$vuesualizerTranslate('brickChoice')">
      <back-button/>
    </sidebar-top>
    <b-form-select v-model="selectedCategory">
      <option 
        v-for="(category, key) in acceptedCategories" 
        :key="key" 
        :value="key"
      >
        {{ category }}
      </option>
    </b-form-select>
    <div v-if="bricks" class="vuesualizer-brick-choice-list">
      <div
        v-for="(config, brickName) in relatedBricks" 
        :key="brickName"
        @click="handleSaveNode(brickName)"
        class="vuesualizer-brick-choice-wrapper col-md-6"
        :title="brickName"
      >
        <div class="vuesualizer-brick-choice-brick">
          <fa-icon icon="image" size="6x"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Bus, { bus } from '@/components/Bus';

@Component
export default class BrickChoice extends Vue {
  @Prop(String)
  private currentBrickKey: string;
  private bricks = Bus.bricksConfig;

  private categories = Bus.categoriesConfig;
  private selectedCategory = '';

  public created() {
    for (const key in this.categories) {
      this.selectedCategory = key;
      break;
    }
  }

  private getAcceptedBricks(): string[] {
    const rules = this.bricks[this.currentBrickKey].accepts;
    if (!rules) {
      return Object.keys(this.bricks);
    }
    
    const matchingBricks: string[] = [];
    const resolveBrickKey = (brickKey: string) => 'self' === brickKey ? 
      this.currentBrickKey : 
      brickKey
    ;
    const addIfNotInList = (brickKey: string) => {
      if (!matchingBricks.includes(brickKey)) {
        matchingBricks.push(resolveBrickKey(brickKey));
      }
    };
    if (rules.regex) {
      this.resolveRegexBricks(new RegExp(rules.regex)).forEach(addIfNotInList);
    }

    if (rules.include) {
      rules.include.forEach(addIfNotInList);
    }

    if (rules.exclude) {
      matchingBricks.filter((brickKey: string) => {
        return !rules.exclude.includes(brickKey);
      });
    }

    return matchingBricks;
  }

  private resolveRegexBricks(regex: RegExp) {
    return Object.keys(this.bricks).filter((brickKey: string) => {
      const match = regex.exec(brickKey);
      return match ? false : true;
    });
  }

  private get relatedBricks() {
    const bricks: any = {};
    const acceptedBricks = this.getAcceptedBricks();
    
    for (const key in this.bricks) {
      if (!acceptedBricks.includes(key)) {
        continue;
      }
      const brick = this.bricks[key];
      
      if (
        (!brick.category && 'default' === this.selectedCategory) ||
        (brick.category === this.selectedCategory)
      ) {
        bricks[key] = brick;
      }
    }
    return bricks;
  }

  private get acceptedCategories() {
    const acceptedBricks = this.getAcceptedBricks();
    const categories: any = {};
    let isFirst = true;
    acceptedBricks.forEach((brickKey: string) => {
      const category = this.bricks[brickKey].category;
      if (category) {
        categories[category] = this.categories[category];
      }
      if (isFirst) {
        this.selectedCategory = category;
        isFirst = false;
      }
    });
    return categories;
  }

  private handleSaveNode(brickName: string) {
    bus.$emit('save-node', brickName);
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/variables.styl'
.vuesualizer-brick-choice
  &-wrapper
    padding 4px
    cursor pointer

  &-brick
    height 80px
    border-radius 4px
    background #FFF
    color main-color
</style>