<template>
  <header
    class="p-2 h-16 mx-auto flex items-center text-black border-b-2 border-black"
    role="banner"
  >
    <Link url="#" class="border-0 mr-3">
      <Logo class="w-24"></Logo>
    </Link>
    <Link url="#" class="border-0 mr-3">
      <span>Streets</span>
    </Link>
    <nav>
      <Link url="#" class="mx-2">Home</Link>
      <Link url="#" class="mx-2">Streets</Link>
      <Link url="#" class="mx-2">Text</Link>
      <Link url="#" class="mx-2">Help</Link>
    </nav>
  </header>
</template>

<script lang="ts">
import Vue from "vue";

import Link from "../../01-atoms/02-text/Link.vue";
import Logo from "../../01-atoms/04-images/Logo.vue";

export default Vue.extend({
  name: "Header",
  components: {
    Logo,
    Link
  }
});
</script>

<style>
</style>