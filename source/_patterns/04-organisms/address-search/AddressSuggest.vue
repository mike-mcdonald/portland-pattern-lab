<template>
  <section>
    <div class="relative bg-fog-200 text-fog-900">
      <form
        class="flex items-center border shadow rounded outline-none focus:shadow-outline "
        @submit.prevent="findCandidates(search)"
      >
        <label for="addressInput" class="sr-only">Address</label>
        <input
          id="addressInput"
          v-model="search"
          name="addressInput"
          type="text"
          placeholder="Enter an address to search"
          required="required"
          class="w-full px-3 py-2 rounded-l bg-fog-200"
        />
        <section class="flex flex-row-reverse">
          <button aria-label="Search" class="p-3">
            <Search />
          </button>
          <transition name="fade">
            <button
              v-if="search"
              aria-label="Clear"
              class="p-3"
              @click.stop.prevent="
                search = undefined;
                clearCandidates();
              "
            >
              <X />
            </button>
          </transition>
        </section>
      </form>
      <div class="-mt-1 p-1">
        <div
          v-for="candidate in candidates"
          :key="candidate.id"
          class="w-full border-b border-l border-r"
          @click="handleClick(candidate)"
        >
          <div role="button" href="#" class="p-2 flex flex-wrap cursor-pointer hover:bg-blue-100">
            <span
              v-if="candidate.type"
              class="flex items-center flex-initial rounded-full bg-blue-500 text-white uppercase px-2 py-1 text-xs font-bold mx-2"
              >{{ candidate.type }}</span
            >

            <div class="mx-2">
              {{ candidate.name }}
            </div>
            <div class="flex flex-1 items-center mx-2">
              <span class="uppercase text-xs font-bold">{{ candidate.city }},</span>
              <span class="uppercase text-xs font-bold">{{ candidate.state }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import axios from 'axios';
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import qs from 'querystring';

import Graphic from 'esri/Graphic';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import { Point, Polyline } from 'esri/geometry';

import Search from '../../01-atoms/04-images/Search.vue';
import X from '../../01-atoms/04-images/X.vue';

export default Vue.extend({
  name: 'AddressSuggest',
  components: {
    Search,
    X
  },
  props: {},
  data() {
    return {
      search: undefined,
      spatialReference: { wkid: 102100, latestWkid: 3857 }
    };
  },
  computed: {
    ...mapState('portlandmaps', ['candidates'])
  },
  methods: {
    ...mapActions('portlandmaps', ['clearCandidates', 'findCandidates']),
    handleClick(candidate) {
      this.$emit('candidate-select', candidate);
      this.clearCandidates();
    }
  }
});
</script>

<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 0.25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
