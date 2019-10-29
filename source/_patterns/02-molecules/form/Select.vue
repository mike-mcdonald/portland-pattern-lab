<template>
  <div :class="{ 'text-red': required }">
    <label class="block mb-1 font-semibold" :for="id">{{ title }}</label>
    <div
      class="inline-block relative w-full"
      :class="{ 'bg-red-lightest': required, 'border-red-dark': required }"
    >
      <select
        class="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        :id="id"
        :name="id"
        :class="{ 'bg-red-lightest': required, 'border-red-dark': required }"
        :multiple="multiple ? true : false"
        :required="required ? true : false"
        :value="value"
        @input="handleInput"
      >
        <option v-for="(option, index) in options" :key="index" :value="option.value">
          <slot>{{ option.text }}</slot>
        </option>
      </select>
      <i
        class="pointer-events-none absolute pin-y pin-r flex items-center px-2"
        v-html="chevronDown"
      />
    </div>
  </div>
</template>

<script>
import feather from "feather-icons";

export default {
  name: "Select",
  props: ["title", "id", "options", "required", "multiple", "value"],
  data() {
    return {
      chevronDown: feather.icons["chevron-down"].toSvg()
    };
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
    }
  }
};
</script>

<style>
</style>
