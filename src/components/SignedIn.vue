<template>
  <div>
    <header>
      <span>{{ accountId }}</span>
      <button @click="isAddScreen=true" class="btn btn-primary m-2">+ Add Item</button>
      <button class="btn btn-outline-danger" v-on:click="logout">Sign out</button>
    </header>
    <main>
      <h1 class="text-center mb-5">
        NgArt - My Gallery
      </h1>

      <div v-if="!isAddScreen">
        <div class="cards" v-if="ready && myItems.length">
          <b-card title="Card Title"
                  v-for="item in myItems"
                  :key="item.token_id"
                  :img-src="item.metadata.media">
            <b-button href="#" variant="secondary">Send</b-button>
            <b-button href="#" variant="primary">Create Phisical Item</b-button>
          </b-card>
        </div>
        <div class="placeholder" v-if="ready && !myItems.length">
          *You don't have NFT Art, but you can
          <button>Create New</button>
        </div>
      </div>

      <div v-if="isAddScreen" class="form-block">
        <form @submit.prevent="addNewItem" class="col-4 offset-4">
          <label class="form-group d-block mb-2">
            <span class="form-label">Title<sup>*</sup></span>
            <input type="text" required name="title" class="form-control" v-model="createForm.title"/>
          </label>
          <label class="form-group d-block mb-2">
            <span class="form-label">Image<sup>*</sup></span>
            <input type="file" name="media" class="form-control" required @change="uploadFile" accept="image/*"/>
          </label>

          <div class="form-group d-block mb-2">
            <span class="form-label">Size (cm)<sup>*</sup></span>
            <div class="input-group">
              <label class="input-group-prepend">
                <input type="number" placeholder="Width"
                       required name="size" min="10" max="60"
                       maxlength="1" class="form-control" v-model="createForm.width"/>
              </label>
              <span class="divider">x</span>
              <label class="input-group-append">
                <input type="number" placeholder="Height"
                       required name="size" min="10" max="60"
                       maxlength="1" class="form-control" v-model="createForm.height"/>
              </label>
              <span class="divider">x</span>
              <label class="input-group-append">
                <input type="number" placeholder="Border width"
                       required name="size" min="2" max="5"
                       class="form-control" v-model="createForm.border"/>
              </label>
            </div>
          </div>

          <div class="form-buttons mt-4">
            <button type="button" @click="isAddScreen=false" class="btn btn-outline-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Create</button>
          </div>
        </form>

        <div>
          <loading :active="createForm.isUpload" :can-cancel="true"/>
        </div>
      </div>

    </main>

  </div>
</template>

<script>
import {logout} from "../utils"
import axios from 'axios';
import Preloader from './Preloader.vue';
import Loading from 'vue-loading-overlay';

export default {
  name: "SignedIn",

  beforeMount() {
    if (this.isSignedIn) {
      this.retrieveMyItems()
    }
  },

  components: {
    Loading
  },

  data: function () {
    return {
      isAddScreen: false,
      createForm: {
        title: "",
        media: "",
        coord: "",
        width: 30,
        height: 30,
        border: 2,
        isUpload: false
      },
      ready: false,
      myItems: [],
    }
  },

  computed: {
    isSignedIn() {
      return window.walletConnection ? window.walletConnection.isSignedIn() : false
    },
    accountId() {
      return window.accountId
    },
    contractId() {
      return window.contract ? window.contract.contractId : null
    },
    networkId() {
      return window.networkId
    },
  },

  methods: {
    retrieveMyItems() {
      this.isAddScreen = false;
      window.contract.nft_tokens_for_owner({account_id: window.accountId}).then(items => {
        this.myItems = items;
        this.ready = true;
      })
    },
    async uploadFile(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        this.createForm.media = reader.result;
      };
      reader.onerror = () => {
        alert("Error: Can't read this image!");
      };
    },
    resetForm() {
      this.createForm.title = '';
      this.createForm.media = '';
      this.createForm.coord = '';
    },
    addNewItem() {
      this.createForm.isUpload = true;
      // axios.post('https://api.coindesk.com/v1/bpi/currentprice.json', {
      //   data: this.createForm
      // }).then(response => {

      //   console.log(response.data);
      // });
      const hash = '123123123123123123123';

      const checkInterval = setInterval(() => {
        axios.get(`https://api.coindesk.com/v1/bpi/currentprice.json?hash=${hash}`).then(response => {
          // console.log(response.data);
          if (response.data.finished) {
            clearInterval(checkInterval);

            this.createForm.isUpload = false;
            this.createNFT(hash);
          }
        });
      }, 2000);
    },

    async createNFT(hash, mediaUrl) {
      const token_metadata = {
        title: this.createForm.title,
        media: mediaUrl,
        copies: 1,
        extra: this.createForm.coord
      };

      try {
        await window.contract.nft_mint({
          token_id: hash,
          receiver_id: window.accountId,
          token_metadata
        })
      } catch (e) {
        alert("Something went wrong!");
      } finally {
        console.log('Finish');
        this.retrieveMyItems();
      }
    },
    logout: logout,
  },

  //
  // saveGreeting: async function (event) {
  //   // fired on form submit button used to update the greeting
  //
  //   // disable the form while the value gets updated on-chain
  //   this.$refs.fieldset.disabled = true
  //
  //   try {
  //
  //     // make an update call to the smart contract
  //     await window.contract.set_greeting({
  //       // pass the new greeting
  //       message: this.newGreeting,
  //     })
  //   } catch (e) {
  //     alert(
  //       "Something went wrong! " +
  //         "Maybe you need to sign out and back in? " +
  //         "Check your browser console for more info."
  //     )
  //     throw e //re-throw
  //   } finally {
  //     // re-enable the form, whether the call succeeded or failed
  //     this.$refs.fieldset.disabled = false
  //   }
  //
  //   // update savedGreeting with persisted value
  //   this.savedGreeting = this.newGreeting
  //
  //   this.notificationVisible = true //show new notification
  //
  //   // remove Notification again after css animation completes
  //   // this allows it to be shown again next time the form is submitted
  //   setTimeout(() => {
  //     this.notificationVisible = false
  //   }, 11000)
  //
  // },

}
</script>
