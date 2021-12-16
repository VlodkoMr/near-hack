<template>
  <main>
    <header>
      <h1 class="text-center mb-5 mt-3">NgArt</h1>
    </header>

    <div class="text-center">
      <p>
        Project description...
      </p>
      <p class="auth-btn">
        <button v-on:click="login" class="btn btn-primary">Sign in</button>
      </p>
      <p>
        Some images...
      </p>
    </div>
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
