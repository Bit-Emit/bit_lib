import './styles.sass'

export default {
  mounted(el) {
    el.classList.add('dev_feature')
    const isDev = localStorage.getItem('isDevMode')
    if(!isDev) {
      el.style.display= 'none'
    }
  }

}


