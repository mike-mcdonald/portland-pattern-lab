<template>
  <div>
    <label class="block mb-1 font-semibold" :class="{ 'text-red': required }" :for="id">{{ title }}</label>
    <input
      :id="id"
      :name="id"
      type="file"
      :size="size"
      :placeholder="placeholder"
      class="w-full border-2 rounded px-3 py-2"
      :class="{ 'bg-red-lightest': required, 'border-red-dark': required }"
      :required="required ? true : false"
      @input="handleInput"
    >
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  props: ["title", "id", "size", "placeholder", "required"],
  methods: {
    handleInput(e) {
      let file = e.target.files[0];

      if (!file) {
        return;
      }

      var offset = 0;
      const CHUNK_SIZE = 10 * 1024;

      let reader = new FileReader();

      reader.onload = () => {
        if (reader.error == null) {
          offset += reader.result.length;
          this.$emit("chunk", reader.result);
          this.$emit("progress", offset / file.size);
        } else {
          this.$emit("error", reader.error);
          return;
        }
        if (offset >= file.size) {
          this.$emit("done");
          return;
        }

        readChunk(offset, CHUNK_SIZE, file);
      };

      var readChunk = (_offset, length, _file) => {
        var blob = _file.slice(offset, length + _offset);
        reader.readAsText(blob);
      };

      readChunk(offset, CHUNK_SIZE, file);
    }
  }
};
</script>

<style scoped>
</style>
