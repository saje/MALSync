<template>
  <div v-if="characters.length">
    <Header :spacer="true">{{ lang('overview_Characters') }}</Header>

    <Grid>
      <MediaLink v-for="char in characters" :key="char.name" class="character" :href="char.url">
        <div class="cover">
          <ImageFit mode="cover" :src="char.img" />
        </div>
        <div>
          <div class="name">{{ char.name }}</div>
          <div v-if="char.subtext" class="role">{{ char.subtext }}</div>
        </div>
      </MediaLink>
    </Grid>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { Overview } from '../../../_provider/metaOverviewAbstract';
import Header from '../header.vue';
import ImageFit from '../image-fit.vue';
import Grid from '../grid.vue';
import MediaLink from '../media-link.vue';

defineProps({
  characters: {
    type: Array as PropType<Overview['characters']>,
    required: false,
    default: () => [],
  },
});
</script>

<style lang="less" scoped>
@import '../../less/_globals.less';

.cover {
  .click-move-down();
}
.name {
  font-weight: bold;
  margin-top: 10px;
}
.role {
  margin-top: 5px;
  color: var(--cl-light-text);
}
</style>
