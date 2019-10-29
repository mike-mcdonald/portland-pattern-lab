<template>
  <div :class="{ 'text-red': required }">
    <label class="block mb-1 font-semibold" :for="id">{{ title }}</label>
    <textarea
      :id="id"
      :name="id"
      :rows="size"
      :placeholder="placeholder"
      class="w-full border-2 rounded px-3 py-2"
      :class="{ 'bg-red-lightest': required, 'border-red-dark': required }"
      :required="required ? true : false"
      :value="value"
      @input="handleInput"
    />
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "Textarea",
  props: ["title", "id", "size", "placeholder", "required", "value", "event"],
  methods: {
    handleInput: _.debounce(function(e) {
      this.$emit("input", e.target.value);
    }, 500)
  }
};
</script>

<style>
</style>
