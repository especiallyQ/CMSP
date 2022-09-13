
export default {
    namespaced: true,
    state: {
        // 当前链对应的订阅IID
        chainSubscribeId: null,
        // 当前链与接入组织关系ID
        chainRegisterId: null
    },
    mutations: {
        SET_CHAIN_SUBSCRIBE_ID(state, subscribeId) {
            state.chainSubscribeId = subscribeId;
            if (subscribeId) {
                localStorage.setItem('CHAIN_SUBSCRIBE_ID', subscribeId || '');
            } else {
                localStorage.removeItem('CHAIN_SUBSCRIBE_ID');
            }
        },
        SET_CHAIN_REGISTER_ID(state, registerId) {
            state.chainRegisterId = registerId;
            if (registerId) {
                localStorage.setItem('CHAIN_REGISTER_ID', registerId || '');
            } else {
                localStorage.removeItem('CHAIN_REGISTER_ID');
            }
        }
    },
    actions: {
        setChainSubscribeId({ commit }, subscribeId) {
            commit('SET_CHAIN_SUBSCRIBE_ID', subscribeId);
        },
        getChainSubscribeId({ state }) {
            let subscribeId = state.chainSubscribeId;
            if (!subscribeId) {
                subscribeId = localStorage.getItem('CHAIN_SUBSCRIBE_ID');
            }
            return subscribeId ? Number(subscribeId) : null;
        },
        setChainRegisterId({ commit }, registerId) {
            commit('SET_CHAIN_REGISTER_ID', registerId);
        },
        getChainRegisterId({ state }) {
            let registerId = state.chainRegisterId;
            if (!registerId) {
                registerId = localStorage.getItem('CHAIN_REGISTER_ID');
            }
            return registerId ? Number(registerId) : null;
        }
    },
};
