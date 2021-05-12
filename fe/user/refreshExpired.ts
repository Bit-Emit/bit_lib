import axios from 'axios'


interface ConfigInterface {
  keyToken: string;
  urlBlackList: Array<string>;
  fnAuthorize: (config) => Promise<string>;
}

class RefreshExpired {
  //Public Interface
  config: ConfigInterface = {
    keyToken: 'Authorization',
    urlBlackList: [],
    fnAuthorize: async (config) => {
      console.error(config)
      return 'SETUP AUTHORIZE FUNCTION'
    },
  }

  //States
  private _isRefreshing = false
  private _refreshHook: Promise<string> | null = null

  //Setup
  constructor() {
    axios.interceptors.response.use( (response) => response, (err) => this._unauthorised(err) )
  }

  //Internal Functions
  private async _unauthorised(error) {
    if(!error.response || error.response.status != 401) {
      return Promise.reject(error)
    }

    for(const url of this.config.urlBlackList) {
      if(url == error.config.url) return Promise.reject(error)
    }


    if(!this._isRefreshing) {
      this._startRefreshAuthorization(error)
    }

    try {
      const token = await this._refreshHook
      error.config.headers[this.config.keyToken] = token
      return await axios.request(error.config)
    } catch(err){ console.error(err) }
  }

  private _startRefreshAuthorization(error) {
    this._isRefreshing = true
    this._refreshHook = new Promise((resolve, reject) => {
      this.config.fnAuthorize(error.config)
        .then((token) => { resolve(token) })
        .catch((err) => reject(err))
        .finally(() => this._isRefreshing = false)
    })
  }

}


export default new RefreshExpired()
