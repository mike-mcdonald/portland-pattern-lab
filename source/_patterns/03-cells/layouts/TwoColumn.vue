<template>
  <div class="flex flex-row flex-wrap mx-auto">
    <section :class="[defaultWidth, computedWidth, padding]">
      <slot name="first"></slot>
    </section>
    <section :class="[computedWidth, padding]">
      <slot name="second"></slot>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TwoColumn',
  props: ['breakpoint', 'firstWidth', 'secondWidth'],
  data() {
    return {
      defaultWidth: 'w-full',
      padding: 'px-2',
    };
  },
  computed: {
    computedWidth() {
      return [this.defaultWidth, this.firstWidth, this.secondWidth];
    },
  },
};
</script>
