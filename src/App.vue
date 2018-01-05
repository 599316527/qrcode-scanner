<template>
  <div id="app">
    <Scanner></Scanner>
  </div>
</template>

<script>
import Scanner from './components/Scanner'

export default {
  name: 'app',
  components: {
    Scanner
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

a {
  color: #42b983;
}

.error {
  font-size: 1.2em;
  word-wrap: break-word;
  hyphens: auto;
}


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app .comp-scanner {
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
