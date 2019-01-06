<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view/>
    <ZeldaError :situation="zeldaSituation"
                locale="ja"
                :showTicketLink="true"
                :settings="zeldaSettings"/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import HelloWorld from "./components/HelloWorld.vue";
  import {
    MyZeldaDBIntegration,
    MyZeldaErrorLabels,
    MyZeldaIssueExtension,
    MyZeldaNotificationIntegration,
    MyZeldaStyles,
    MyZeldaTicketIntegration,
  } from "./my-zelda-implementations";
  import {ZeldaErrorSettings} from "./zelda-error/common/types/zelda-error-property-types";
  import ZeldaError from "./zelda-error/ZeldaError.vue";

  @Component({
    components: {
      HelloWorld,
      ZeldaError,
    },
  })
  export default class App extends Vue {
    public get zeldaSituation() {
      return this.$route.name;
    }

    public zeldaSettings: ZeldaErrorSettings = {
      styles: MyZeldaStyles,
      issueExtension: MyZeldaIssueExtension,
      ticketIntegration: MyZeldaTicketIntegration,
      notificationIntegration: MyZeldaNotificationIntegration,
      dbIntegration: MyZeldaDBIntegration,
      localeLabels: MyZeldaErrorLabels,
    };
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
