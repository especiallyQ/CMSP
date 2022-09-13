import Vue from 'vue';
import Vuex from 'vuex';
import { getLanguage } from '@/lang/index';
import Cookies from 'js-cookie';
import chain from './modules/chain'

Vue.use(Vuex)

const state = {
    isLogin: 0,
    loading: false,
    language: getLanguage()
}
export default new Vuex.Store({
    state,
    getters: {
        language: state => state.language
    },
    mutations: {
        changeLogin(state, status) {
            state.isLogin = status;
        },
        showLoading(state) {
            state.loading = true;
        },
        hideLoading(state) {
            state.loading = false;
        },
        SET_LANGUAGE: (state, language) => {
            state.language = language;
            Cookies.set('language', language);
        }
    },
    actions: {
        loginAction({ commit }) {
            commit('changeLogin', 1);
        },
        setLanguage({ commit }, language) {
            commit('SET_LANGUAGE', language);
        }
    },
    modules: {
        chain
    }
})
