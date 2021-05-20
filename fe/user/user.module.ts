import Axios from 'axios'

import { authConfig } from './authHeader'
import storage from '../storage/storage'



let config = {

  urls: {
    login: '',
    signup: '',
    updateProfile: '',
    authorize: '',
    loadProfile: ''
  },

  handleError(err) { 
    console.error(err)
    throw err
  }

}


export const setConfig = (newConfig) => config = {...config, ...newConfig}


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
        const {data} = await Axios.post(config.urls.login, credentials)
        await commit('authorised', data)
      } catch(err) {
        config.handleError(err)
      }
    },

    async signup({commit}, userData) {
      try {
        const {data} = await Axios.post(config.urls.signup, userData)
        await commit('authorised', data)
      } catch(err) {
        config.handleError(err)
      }
    },

    async updateProfile(store, userData) {
      try {
        const {data} = await Axios.put(config.urls.updateProfile, userData, authConfig())
        await store.commit('profileLoaded', data)
      } catch(err) {
        config.handleError(err)
      }
    },

    async authorize(store) {
      try{
        const {data} = await Axios.post(config.urls.authorize, {token: store.getters['token']})
        store.commot('authorized', data.token)
        return data.token
      } catch(err) {
        config.handleError(err)
      }
    },

    async logout({commit}) { 
      await storage.remove('user') 
    },

    async loadProfile(store) {
      try{
        const {data} = await Axios.get(config.urls.loadProfile, authConfig())
        store.commit('profileLoaded', data)
      } catch(err) {
        config.handleError(err)
      }
    }

  }
}
