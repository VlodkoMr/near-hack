<template>
  <div id="sign-in">
    <iframe style="position:fixed; z-index: -1; left: 0; right: 0; top: 0; bottom: 0; opacity: 0.2" width="100%" height="100%" autoplay
            src="https://www.youtube.com/embed/RcWFKN_uj3w?controls=0" title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <div class="container">
      <div class="mt-3">
        <img src="../assets/logo.svg" alt="" height="60">
      </div>
      <div class="row">
        <div class="col-6">
          <h3 class="mb-3">Platform for you to create <span class="text-other">StringArt</span> NFTs</h3>
          <p>
            The first platform where you can manifest digital-art NFTs in the physical world. <br>
            Own unique NFTs from any your image or photo, which you can convert into a real String Art that will be
            automatically printed and delivered to you in few days.
          </p>
          <p class="auth-btn">
            <button v-on:click="login" class="btn btn-primary sign-in mt-2">Sign In</button>
          </p>
        </div>
        <div class="col-6">
          <img src="../assets/sample.png" alt="" style="width: 100%; margin-top: 10%;">
        </div>
      </div>
      <div class="row">
        <div class="col-6 text-center offset-3 pt-5 mb-5">
          <hr class="mb-5">
          <h4>From digital NFT to your wall</h4>
          <p>FlowNFT is the easiest way to print your NFTs on demand. Your NFTs will look exactly like you want them to with rich colors and sharp contrast.</p>
          <button v-on:click="login" class="btn btn-secondary sign-in mt-2">Become Art Producer</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {login} from "../utils"

export default {
  name: "SignedOut",

  methods: {
    login() {
      console.log("calling utils.login")
      login()
    },
  },
}
</script>

<style>
h3 {
  margin-top: 22% !important;
}

.sign-in {
  padding: 9px 30px !important;
  border-radius: 8px !important;
}

.text-other {
  color: #974CBA !important;
}
</style>
