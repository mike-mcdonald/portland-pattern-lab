<template>
  <div class="my-3 flex items-center justify-between" :class="{ 'text-red': required }">
    <label class="flex-grow block mr-2 font-semibold" :for="id">{{ title }}</label>
    <input
      type="number"
      :id="id"
      :name="id"
      class="flex-shrink border-2 rounded px-3 py-2"
      :class="{ 'bg-red-lightest': required, 'border-red-dark': required }"
      :value="value"
      :min="min"
      :max="max"
      :step="step"
      :required="required ? true : false"
      @input="handleInput"
    >
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Textfield",
  props: ["title", "id", "min", "max", "step", "required", "value", "event"],
  methods: {
    handleInput: _.debounce(function(e) {
      this.$emit("input", parseFloat(e.target.value));
    }, 500)
  }
};
</script>

<style>
</style>
