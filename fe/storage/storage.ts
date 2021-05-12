import {Plugins} from '@capacitor/core'
const {Storage:CapS} = Plugins

export default {
    set: async(key: string, value: any) => await CapS.set({ key, value: JSON.stringify(value) }),
    get: async(key: string) => await CapS.get({ key }),
    remove: async(key: string) => await CapS.remove({key})
}