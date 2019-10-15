<template>
  <div class="my-3" :class="{ 'text-red': required }">
    <label class="block mb-1 font-semibold" :for="id">
      <input
        type="checkbox"
        :id="id"
        :name="id"
        :required="required ? true : false"
        :checked="value"
        @input="handleInput"
      >
      {{ title }}
    </label>
  </div>
</template>

<script>
export default {
  name: "Checkbox",
  props: ["title", "id", "options", "required", "value"],
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.checked);
    }
  }
};
</script>

<style>
</style>
