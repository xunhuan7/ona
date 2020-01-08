import Vue from 'vue';
import Vuex from 'vuex';
import * as userApi from '../api/user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    me: {}
  },
  mutations: {
    UPDATE_ME(state, params) {
      state.me = params;
    }
  },
  actions: {
    getMe({ state, commit }) {
      userApi.getMe()
        .then((res) => {
          commit('UPDATE_ME', res.data);
        });
    }
  },
  modules: {},
});
