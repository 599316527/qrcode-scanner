
import Vue from 'vue'
import App from './App'

if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices
  || !window.URL || !window.URL.createObjectURL) {
  exitWithMessage('Your browser is not supported.')
}

navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
  stream.getTracks().forEach(track => track.stop())
  startApp()
}).catch(function (err) {
  exitWithMessage(err.name + ' ' + err.message)
})

function startApp() {
  let app = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
  })

  app.$hashParams = parseHash(location.hash)
  app.$setHash = setHash
}

function exitWithMessage(message) {
  document.getElementById('app').innerHTML = `<div class="error">${message}</div>`
  throw new Error(message)
}

function parseHash(hashStr) {
  hashStr = hashStr.replace(/^#+/, '')
  return hashStr.split('&').reduce(function (result, pair) {
    pair = pair.trim()
    if (pair) {
      let [key, value = ''] = pair.split('=')
      result[key] = decodeURIComponent(value)
    }
    return result
  }, {})
}

function setHash(key, val) {
  let params = this.$hashParams
  params[key] = val
  location.hash = Object.keys(params).map(function (key) {
    return `${key}=${encodeURIComponent(params[key])}`
  }).join('&')
}
