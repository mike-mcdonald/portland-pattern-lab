<template>
  <section>
    <header></header>
    <main>
      <section></section>
      <aside></aside>
    </main>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

import Map from "../../03-cells/map/Map.vue";

export default Vue.extend({
  name: "App",
  components: { Map }
});
</script>