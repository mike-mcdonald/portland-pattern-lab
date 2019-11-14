import qs from 'querystring';

import axios from 'axios';

import secrets from './.secrets.js';

const namespaced = true;

const state = {
  api_key: secrets.portlandmapsApiKey || undefined,
  candidates: undefined
};

const mutations = {
  setCandidates(state, candidates) {
    state.candidates = candidates;
  }
}

const actions = {
  clearCandidates({ commit }) {
    commit('setCandidates', undefined);
  },
  findCandidates({ commit, state }, search) {
    axios.post(
      'https://www.portlandmaps.com/api/suggest/',
      qs.stringify({
        query: search,
        api_key: state.api_key,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then((res) => {
      if (res.status == 200 && res.data && res.data.status === 'success') {
        const candidates = res.data.candidates;

        commit(
          'setCandidates',
          candidates.map((value) => {
            value.location.spatialReference = res.data.spatialReference;
            return value;
          })
        );
      }
    }).catch((err) => {
      console.error(err);
    })
  }
}

export default {
  namespaced,
  state,
  actions,
  mutations
};
