<template>
  <div class="container">
    <div class="mt-3">
      <img src="../assets/logo.svg" alt="" height="60">
    </div>
    <div class="row">
      <div class="col-6">
        <h3 class="mb-3">Platform for you to create <span class="text-other">StringArt</span> NFTs</h3>
        <p>The first cross-chain ecosystem where you can manifest digital NFTs in the physical world. Own unique NFTs from your favorite brands, projects,
          influencers and artists, which you can convert into a wide range of products, complete with Proof of Authenticity.
        </p>
        <p class="auth-btn">
          <button v-on:click="login" class="btn btn-primary sign-in mt-2">Sign In</button>
        </p>
      </div>
      <div class="col-6">

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
  margin-top: 12% !important;
}

.sign-in {
  padding: 9px 30px !important;
  border-radius: 8px !important;
}

.text-other {
  color: #974CBA !important;
}
</style>
