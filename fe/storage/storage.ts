import { Storage } from '@capacitor/storage';

export const storage = {
  set: (key: string, value: any) => Storage.set({ key, value: JSON.stringify(value) }),
  get: (key: string) => Storage.get({ key }),
  remove: (key: string) => Storage.remove({key})
}