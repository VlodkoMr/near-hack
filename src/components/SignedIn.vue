<template>
  <div>
    <header class="mb-5">
      <div class="container">
        <img src="../assets/logo.svg" alt="" height="40" class="mt-2">
        <div class="text-right">
          <span class="username">{{ accountId }}</span>
          <button @click="isAddScreen=true" class="btn btn-outline-primary m-2">New Item</button>
          <button class="btn btn-outline-danger" v-on:click="logout">Sign out</button>
        </div>
      </div>
    </header>

    <!--    <b-button v-b-modal.modal-1>Launch demo modal</b-button>-->

    <main class="container">
      <div v-if="!isAddScreen">
        <h4 class="text-center mb-4">My StringArt</h4>
        <Preloader color="grey" v-if="!ready"/>

        <div class="cards" v-if="ready && myItems.length">
          <b-card title="Card Title"
                  v-for="item in myItems"
                  :key="item.token_id"
                  :img-src="item.metadata.media">
            <p class="card-description" v-if="item.description">Size: {{ item.description }}</p>
            <div class="card-buttons">
              <b-button href="#" variant="secondary btn-sm" v-b-modal.modal-send @click="selectedNFT=item">
                Send NFT
              </b-button>
              <b-button href="#" variant="primary btn-sm" v-b-modal.modal-create @click="selectedNFT=item">
                Create Physical Item
              </b-button>
            </div>
          </b-card>
        </div>

        <div v-if="ready && !myItems.length" class="text-center">
          <img src="../assets/noItems.png" alt="" width="400">
          <div class="mt-4">
            You don't have StringArt, but you can
            <span class="link-primary text-decoration-underline cursor-pointer" @click="isAddScreen=true">Create New Item</span>
          </div>
        </div>
      </div>

      <div v-if="isAddScreen" class="form-block">
        <form @submit.prevent="addNewItem" class="col-4 offset-4">
          <h4 class="text-center mb-4">Create new StringArt</h4>
          <label class="form-group d-block mb-2">
            <span class="form-label">Art Title<sup>*</sup></span>
            <input type="text" required name="title" class="form-control" v-model="createForm.title"/>
          </label>
          <label class="form-group d-block mb-2">
            <span class="form-label">Image<sup>*</sup></span>
            <input type="file" name="media" class="form-control" required @change="uploadFile" accept="image/*"/>
          </label>

          <div class="form-group d-block mb-2">
            <span class="form-label">Art Size (cm)<sup>*</sup></span>
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
      <!--      <button @click="tmpCreateNFT" class="btn btn-danger mt-5">Generate NFT (TMP)</button>-->
    </main>


    <b-modal id="modal-send" title="Send NFT" hide-footer>
      <!--      {{ selectedNFT }}-->
      <div class="p-5">
        <p>Send NFT to NEAR Account:</p>
        <b-input-group class="mt-3">
          <input type="text" class="form-control" placeholder="NEAR Address" v-model="sendToNearAddress"/>
          <b-input-group-append>
            <b-button variant="primary d-block send-btn" @click="sendNFT">Send</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </b-modal>

    <b-modal id="modal-create" title="Create Physical Item">
      <p>Redeem your NFT item to the form of physical product!</p>
      {{ selectedNFT }}
    </b-modal>
  </div>
</template>

<script>
import {logout} from "../utils"
import axios from 'axios';
import Big from 'big.js';
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
    Loading,
    Preloader,
  },
  data: function () {
    return {
      isAddScreen: false,
      createForm: {
        title: "",
        media: "",
        width: 30,
        height: 30,
        border: 2,
        isUpload: false
      },
      ready: false,
      selectedNFT: {},
      sendToNearAddress: "vlodkow.testnet",
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
    },
    addNewItem() {
      this.createForm.isUpload = true;
      axios.post('https://api.coindesk.com/v1/bpi/currentprice.json', {
        data: this.createForm
      }).then(response => {
        const hash = response.data.hash;
        const mediaUrl = response.data.mediaUrl;

        if (hash) {
          const checkInterval = setInterval(() => {
            axios.get(`https://api.coindesk.com/v1/bpi/currentprice.json?hash=${hash}`).then(response => {
              // console.log(response.data);
              if (response.data.finished) {
                const coordinates = response.data.json;
                clearInterval(checkInterval);

                this.createForm.isUpload = false;
                this.createNFT(hash, mediaUrl, coordinates);
              }
            });
          }, 2000);
        } else {
          this.createForm.isUpload = false;
          alert('Server error: no hash');
        }
      }).catch(err => {
        this.createForm.isUpload = false;
        alert(err.message);
      });
    },
    tmpCreateNFT() {
      const json = [123, 1232, 435, 346, 6, 456, 46, 23, 43, 4, 32, 3, 53, 45, 345, 23];
      this.createForm.title = 'test 2';
      this.createNFT(
        "123456789",
        "https://www.dhresource.com/0x0/f2/albu/g11/M01/87/FB/rBNaFl8f-beARRmbAAKdNBeOmZc224.jpg/lover-hands-graffiti-art-street-art-canvas.jpg",
        JSON.stringify(json)
      );
    },
    async createNFT(hash, mediaUrl, coordinates) {
      const token_metadata = {
        title: this.createForm.title,
        description: `${this.createForm.width}x${this.createForm.height}x${this.createForm.border}`,
        media: mediaUrl,
        copies: 1,
        extra: coordinates,
      };

      try {
        console.log(token_metadata, window.accountId)
        const GAS = Big(3).times(10 ** 13).toFixed();
        const PAYMENT = Big(0.1).times(10 ** 24).toFixed();

        await window.contract.nft_mint({
          token_id: hash,
          receiver_id: window.accountId,
          token_metadata
        }, GAS, PAYMENT);
      } catch (e) {
        alert("Something went wrong!");
        throw e
      } finally {
        console.log('Finish');
        this.retrieveMyItems();
      }
    },
    sendNFT() {
      const GAS = Big(3).times(10 ** 13).toFixed();
      const PAYMENT = 1;

      window.contract.nft_transfer({
        token_id: this.selectedNFT.token_id.toString(),
        receiver_id: this.sendToNearAddress,
      }, GAS, PAYMENT).then(result => {
        console.log(result);
      }).catch(err => {
        console.log('Error!', err);
      });
    },
    logout: logout,
  },
}
</script>
