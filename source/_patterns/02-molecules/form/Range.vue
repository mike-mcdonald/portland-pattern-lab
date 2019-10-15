<template>
  <div :class="{ 'text-red': required }">
    <label class="block mb-1 font-semibold" :for="id">{{ title }}</label>
    <div class="flex items-center">
      <input
        :id="id"
        :name="id"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="flex-grow w-full border-2 rounded px-3 py-2 mr-2"
        :class="{ 'bg-red-lightest': required, 'border-red-dark': required }"
        :required="required ? true : false"
        :value="val"
        @input="handleInput"
      >
      <input
        type="number"
        :id="`${id}-text`"
        :name="`${id}-text`"
        class="flex-shrink border-2 rounded px-3 py-2"
        :value="val"
        :min="min"
        :max="max"
        @input="handleInput"
      >
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Range",
  props: ["title", "id", "min", "max", "step", "required", "value", "event"],
  data() {
    return {
      val: this.value
    };
  },
  methods: {
    handleInput: _.debounce(function(e) {
      this.val = e.target.value;
      this.$emit("input", parseFloat(e.target.value));
    }, 500)
  }
};
</script>

<style>
</style>
