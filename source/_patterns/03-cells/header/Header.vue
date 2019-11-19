<template>
  <header class="flex flex-wrap items-center text-black px-2 py-2 md:py-0 border-black border-b" role="banner">
    <slot name="brand">
      <logo class="w-24 mr-3" />
      <span v-if="name" class="text-lg md:text-xl mr-3">{{ name }}</span>
    </slot>
    <slot></slot>
    <slot name="end"></slot>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';

import Logo from '../../01-atoms/04-images/Logo.vue';

export default Vue.extend({
  name: 'Header',
  props: {
    name: {
      type: String
    }
  },
  components: {
    Logo
  }
});
</script>
