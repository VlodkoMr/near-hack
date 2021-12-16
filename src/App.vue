<template>
  <div id="root" class="container">
    <SignedOut v-show="!isSignedIn"/>
    <SignedIn v-show="isSignedIn"/>
    <footer class="text-center footer">
      <div class="container">
        <small>All rights reserved. Near-Hack</small>
      </div>
    </footer>
  </div>
</template>

<script>
import "./global.css"
import getConfig from "./config"
import SignedOut from "./components/SignedOut.vue"
import SignedIn from "./components/SignedIn.vue"

const nearConfig = getConfig("development")
console.log(
  `networkId:${nearConfig.networkId} CONTRACT_NAME:${nearConfig.contractName}`
)
window.networkId = nearConfig.networkId

export default {
  created() {
    document.title = "near-hack"
  },
  name: "App",
  components: {
    SignedOut,
    SignedIn,
  },

  computed: {
    isSignedIn() {
      return window.walletConnection.isSignedIn()
    },
  },
}
</script>

