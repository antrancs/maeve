<template>
  <div id="app">
    <maeve-header></maeve-header>
    <div class="container">
      <div id="nav">
        <ul>
          <li>
            <router-link to="/">Home</router-link>
          </li>

          <li>
            <router-link to="/about">About</router-link>
          </li>
        </ul>
      </div>

      <router-view/>
    </div>
  </div>
</template>

<script>
import MaeveHeader from './components/TheHeader.vue';
import MainContent from './views/MainContent.vue';

export default {
  name: 'App',
  components: {
    MaeveHeader,
    MainContent
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.container {
  display: flex;
}

#nav {
  width: 200px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
