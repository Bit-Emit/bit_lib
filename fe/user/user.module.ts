import Axios from 'axios'

import { authConfig } from './authHeader'
import storage from '../storage/storage'


export const userModule = {
  namespaced: true,

  state: {
    user: {},
  },

  getters:{
    token: ({user}) => user.token,
    isUserLogedIn:(s, getters) => !!getters.token,
    userProfile: ({user}) => user.user,
  },

  mutations: {
    async initData(state) {
      const {value} = await storage.get('user')
      if(!value) {return}
      state.user = JSON.parse(value)
    },

    async authorised(state, userData) {
      state.user = userData
      await storage.set('user', userData)
    },

    profileLoaded(state, newUser) {
      state.user.user = newUser
      storage.set('user', state.user)
    },

    authorized({user}, token) {
      user.token = token
    }
  },

  actions: {
    async login({commit}, credentials) {
      try {
        const {data} = await Axios.post('/api/login', credentials)
        await commit('authorised', data)
      } catch(err) {
        console.error(err)
        throw err
      }
    },

    async register({commit}, userData) {
      try {
        const {data} = await Axios.post('/api/signup', userData, {headers: {"Content-Type": "application/json"}})
        await commit('authorised', data)
      } catch(err) {
        console.error(err)
        throw err
      }
    },

    async updateProfile(store, userData) {
      try {
        const {data} = await Axios.put('/api/user', userData, authConfig({"Content-Type": "application/json"}))
        await store.commit('profileLoaded', data)
      } catch(err) {
        console.error(err)
        throw err
      }
    },

    async authorize(store) {
      try{
        const {data} = await Axios.post('/api/refresh', {token: store.getters['token']})
        store.commot('authorized', data.token)
        return data.token
      } catch(err) {
        console.error(err)
        throw err
      }
    },

    async logout({commit}) {
      await storage.remove('user')
    },

    async loadProfile(store) {
      try{
        const {data} = await Axios.get(`/api/user`, authConfig())
        store.commit('profileLoaded', data)
      } catch(err) {
        console.error(err)
        throw err
      }
    }

  }
}
