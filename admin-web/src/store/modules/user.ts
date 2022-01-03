import { TOKEN_NAME } from '@/config/global';
import { login } from '@/api';

const InitUserInfo = {
  roles: [],
};

// 定义的state初始值
const state = {
  token: localStorage.getItem(TOKEN_NAME) || '', // 默认token不走权限
  userInfo: InitUserInfo,
};

const mutations = {
  setToken(state, token) {
    localStorage.setItem(TOKEN_NAME, token);
    state.token = token;
  },
  removeToken(state) {
    localStorage.removeItem(TOKEN_NAME);
    localStorage.removeItem('phone');
    state.token = '';
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
};

const getters = {
  token: (state) => {
    return state.token;
  },
  roles: (state) => {
    return state.userInfo?.roles;
  },
};

const actions = {
  async login({ commit }, userInfo) {
    const data = await login(userInfo);

    if ((data as any).code === 0) {
      commit('setToken', data.data);
      localStorage.setItem('phone', userInfo.phone);
    } else {
      throw data;
    }
  },
  async getUserInfo({ commit }) {
    commit('setUserInfo', {
      name: 'td_main',
      roles: ['ALL_ROUTERS'],
    });
  },
  async logout({ commit }) {
    commit('removeToken');
    commit('setUserInfo', InitUserInfo);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
