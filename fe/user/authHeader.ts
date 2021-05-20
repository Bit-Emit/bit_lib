

let getToken = () => 'DEFAULT_TOKEN'

export const setTokenGetter = (newGetter: () => string) => getToken = newGetter

export const authConfig = (headers?) => ({
  headers: { 
    'Authorization': `Bearer ${getToken()}`,
    ...headers
  }
})

