<template>
  <div class="footer">
      <div class="separator"></div>
      <p>Copyright © {{ new Date().getFullYear() }} — 
        <a target="_blank" class="link link--external" href="https://github.com/antrancs">An Tran</a>
      </p>
      <p>Have feedback or report a bug? Submit an issue on 
        <a target="_blank" class="link link--external" href="https://github.com/antrancs/maeve/issues">Github</a> 
        or send an email to
        <a target="_blank" class="link link--external" href="mailto:an.tran.cs@gmail.com">an.tran.cs@gmail.com</a>
      </p>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AppFooter extends Vue {}
</script>

<style lang="scss" scoped>
.footer {
  color: $secondary-text-color;
  margin-top: $l-size;
  text-align: center;
}

.footer::after {
  background-color: $bg-color;
  content: '';
  display: block;
  padding-bottom: 10rem;
}

.separator {
  background-color: $divider-color;
  height: 0.1rem;
  width: 100%;
}
</style>
