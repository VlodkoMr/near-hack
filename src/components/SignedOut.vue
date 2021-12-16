<template>
  <main>
    <h1>NgArt</h1>
    <p>
      Project description...
    </p>
    <p class="auth-btn">
      <button v-on:click="login">Sign in</button>
    </p>
    <p>
      Some images...
    </p>
    <hr>
    <p>Footer</p>
  </main>
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
