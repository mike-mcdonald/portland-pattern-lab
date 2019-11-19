<template>
  <div id="app">
    <Header :name="'Streets app'">
      <nav class="-mx-2 flex flex-row flex-wrap">
        <ul class="list-none m-0 p-0">
          <li class="py-2 px-2 md:py-4 hover:bg-fog-500">
            <a href="./streets" class="border-b-2 border-black">
              <span>Streets</span>
            </a>
          </li>
        </ul>
      </nav>
    </Header>
    <main class="flex flex-col-reverse md:flex-row">
      <section
        class="w-full md:w-1/3 h-screen-50 md:h-screen overflow-y-auto border-t md:border-r md:border-t-0 border-black"
      >
        <address-suggest class="m-2" />
        <div v-if="selectedStreet" class="m-2">
          <a href="#" class="border-b-2 border-black" @click="selectedStreet = undefined">Back to results</a>
        </div>
        <ul class="list-none m-0 p-0" v-if="!selectedStreet">
          <li v-for="street in streets" :key="street.id">
            <a
              href="#"
              class="flex flex-col m-2 px-2 py-3 shadow rounded border-0 bg-white hover:bg-blue-100"
              @click="selectStreet(street)"
            >
              <div>{{ street.name }}</div>
              <div v-if="street.block" class="text-xs">{{ street.block }} block</div>
            </a>
          </li>
        </ul>
        <article v-if="selectedStreet" class="p-2">
          <h1 class="mb-3 text-3xl lg:text-4xl">{{ selectedStreet.name }}</h1>
          <p class="mb-3 text-2xl" v-if="selectedStreet.block">{{ selectedStreet.block }} block</p>
          <div class="flex flex-wrap items-center mb-3">
            <dl>
              <div class="flex flex-wrap items-center">
                <dt>Transportation planning ID:</dt>
                <dd class="ml-2">{{ selectedStreet.id }}</dd>
              </div>
            </dl>
          </div>
          <transition name="fade">
            <section v-if="selectedStreet.classifications">
              <h2 class="mb-3 text-2xl lg:text-3xl">Classifications</h2>
              <dl>
                <div
                  v-for="(classification, index) in classificationKeys()"
                  :key="index"
                  class="flex flex-wrap items-center mb-2"
                >
                  <dt>{{ classification.charAt(0).toUpperCase() + classification.slice(1) }} classification:</dt>
                  <dd class="ml-2">{{ selectedStreet.classifications[classification] }}</dd>
                </div>
              </dl>
            </section>
          </transition>

          <transition name="fade">
            <section v-if="selectedStreet.projects && selectedStreet.projects.length > 0">
              <h2 class="mb-3 text-2xl lg:text-3xl">Projects affecting this street</h2>
              <ul class="list-none m-0 p-0">
                <li class="my-2 p-2 rounded border" v-for="project in selectedStreet.projects" :key="project.id">
                  <a href="#">
                    <h3>{{ project.name }}</h3>
                    <p class="text-xs">{{ project.description }}</p>
                    <div class="flex flex-row flex-wrap -mx-2 text-xs text-gray-600">
                      <span class="mx-2 flex flex-row items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-3 h-3 mr-1"
                        >
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        <span>{{ project.estimatedCost.toLocaleString() }}</span>
                      </span>
                      <span class="mx-2 flex flex-row items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-3 h-3 mr-1"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>

                        <span>{{ project.estimatedTimeframe }}</span>
                      </span>
                    </div>
                  </a>
                </li>
              </ul>
            </section>
          </transition>
        </article>
      </section>
      <section class="w-full md:w-2/3 h-screen-50 md:h-screen">
        <app-map></app-map>
      </section>
    </main>
    <Footer />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

import AddressSuggest from '../address-search/AddressSuggest.vue';
import AppMap from '../../03-cells/classification/Map.vue';
import Header from '../../03-cells/header/Header.vue';
import Footer from '../../03-cells/footer/Footer.vue';

export default Vue.extend({
  name: 'StreetApp',
  components: {
    AddressSuggest,
    AppMap,
    Header,
    Footer
  },
  data: function() {
    return {
      selectedStreet: this.$store.state.streets[0]
    };
  },
  computed: {
    ...mapState(['streets'])
  },
  methods: {
    selectStreet(street: any) {
      this.selectedStreet = street;
    },
    classificationKeys() {
      if (this.selectedStreet != null) {
        return Object.keys(this.selectedStreet.classifications);
      }
      return [];
    }
  }
});
</script>
<style lang="scss"></style>
