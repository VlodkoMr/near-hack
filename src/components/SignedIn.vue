<template>
  <div>
    <header class="mb-5">
      <div class="container">
        <div>
          <img src="../assets/logo.svg" alt="" height="40" class="mt-2" @click="openArtPage">
          <span class="btn btn-link ml-5"
                @click="openArtPage"
                :class="{'text-info': activePage==='art', 'text-white': activePage!=='art'}">
            My StringArt
          </span>
          <span class="btn btn-link ml-1"
                @click="openOrdersPage"
                :class="{'text-info': activePage==='orders', 'text-white': activePage!=='orders'}">
            My Orders
          </span>
          <span class="btn btn-link ml-1"
                @click="openStorePage"
                :class="{'text-info': activePage==='store', 'text-white': activePage!=='store'}">
            Create Store
          </span>
        </div>
        <div class="text-right">
          <span class="username">{{ accountId }}</span>
          <button @click="activePage='art'; isAddScreen=true" class="btn btn-outline-primary m-2">New Item</button>
          <button class="btn btn-outline-danger" v-on:click="logout">Sign out</button>
        </div>
      </div>
    </header>

    <main class="container" v-if="activePage==='art'">
      <div v-if="!isAddScreen">
        <h4 class="text-center mb-4">My StringArt</h4>
        <Preloader color="grey" scale="0.7" v-if="!ready"/>

        <div class="cards" v-if="ready && myItems.length">
          <b-card :title="item.metadata.title"
                  v-for="item in myItems"
                  :key="item.token_id"
                  :img-src="item.metadata.media">
            <p class="card-description" v-if="item.metadata.description">Size: {{ item.metadata.description }}</p>
            <div class="card-buttons">
              <b-button href="#" variant="secondary btn-sm" v-b-modal.modal-send @click="selectedNFT=item">
                Send NFT
              </b-button>
              <b-button href="#" variant="primary btn-sm" v-b-modal.modal-create @click="loadModalCreate(item)">
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

          <label class="form-group d-block mb-2">
            <span class="form-label">Style<sup>*</sup></span>
            <input type="number" step="0.1" min="0.7" max="3.5" required
                   name="style" class="form-control" v-model="createForm.style"/>
          </label>

          <div class="form-buttons mt-4">
            <button type="button" @click="isAddScreen=false" class="btn btn-outline-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Create</button>
          </div>
        </form>
        <div>
          <loading :active="createForm.isUpload" :can-cancel="true"/>
        </div>
      </div>

      <b-modal id="modal-send" title="Send NFT" hide-footer>
        <div class="p-5">
          <p>Send NFT to NEAR Account:</p>
          <form @submit.prevent="sendNFT">
            <b-input-group class="mt-3">
              <input type="text" required class="form-control" placeholder="NEAR Address" v-model="sendToNearAddress"/>
              <b-input-group-append>
                <b-button variant="primary d-block send-btn" type="submit">Send</b-button>
              </b-input-group-append>
            </b-input-group>
          </form>
        </div>
      </b-modal>

      <b-modal id="modal-create" title="Create Physical Item" hide-footer>
        <form @submit.prevent="createPhysicalItem" v-if="!itemCreated">
          <div class="text-center mt-3">
            <a target="_blank" :href="getGcodeURL()" class="cursor-pointer text-primary text-decoration-underline">Download gCode</a>
            and print NFT yourself.
          </div>
          <div class="position-relative">
            <hr class="mb-4 mt-4">
            <span class="or-block">OR</span>
          </div>

          <p class="text-center mt-3 mb-4">Create order and we will print it for you:</p>
          <div v-if="!submitOrder">
            <label class="form-group d-block mb-2">
              <span class="form-label text-dark">Art Producer<sup>*</sup></span>
              <select class="form-select" aria-label="Default select example">
                <option value="1">SuperArt One (Kyiv)</option>
                <option value="2">BlackStreet (Lviv)</option>
                <option value="3">Magic Print (Poltava)</option>
              </select>
            </label>
            <label class="form-group d-block mb-2">
              <span class="form-label text-dark">Your Name<sup>*</sup></span>
              <input type="text" required name="name" class="form-control" v-model="createItemForm.name"/>
            </label>
            <label class="form-group d-block mb-2">
              <span class="form-label text-dark">Phone<sup>*</sup></span>
              <input type="text" required name="phone" class="form-control" v-model="createItemForm.phone"/>
            </label>
            <label class="form-group d-block mb-2">
              <span class="form-label text-dark">Address<sup>*</sup></span>
              <textarea v-model="createItemForm.address" class="form-control"></textarea>
            </label>

            <div class="mt-4 d-flex" style="justify-content: space-between">
              <button class="btn btn-outline-secondary" type="button" @click="$bvModal.hide('modal-create')">Cancel</button>
              <button class="btn btn-primary" type="submit">Create Order</button>
            </div>
          </div>

          <div v-if="submitOrder">
            <Preloader color="grey" scale="0.5"/>
          </div>
        </form>

        <div v-if="itemCreated" class="order-sent">
          <h5 class="mb-4">Your order successfully sent!</h5>
          <iframe width="100%" height="315" src="https://www.youtube.com/embed/RcWFKN_uj3w" title="YouTube video player" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <p class="mt-4"><b>Order Number: {{ itemCreated }}</b></p>
          <button class="btn btn-outline-secondary" type="button" @click="$bvModal.hide('modal-create')">Close</button>
        </div>

      </b-modal>
    </main>

    <main class="container" v-if="activePage==='orders'">
      <h4 class="text-center mb-4">My Orders</h4>
      <Preloader color="grey" scale="0.7" v-if="!ready"/>

      <div v-if="ready && !myOrders.length" class="text-center">
        <img src="../assets/noItems.png" alt="" width="400">
        <div class="mt-4">
          You don't have Orders.
        </div>
      </div>

      <div class="col-8 offset-2">
        <table class="table text-white" v-if="ready && myOrders.length">
          <tr class="text-secondary">
            <th class="text-center p-2">NFT</th>
            <th>Order ID</th>
            <th>Details</th>
          </tr>
          <tr v-for="order of myOrders" :key="order.id">
            <td width="120"><img :src="order.media" width="100" alt="..." style="margin-left: 7px;"></td>
            <td width="120">{{ order.id }}</td>
            <td>{{ order.data }}</td>
          </tr>
        </table>
      </div>
    </main>

    <main class="container" v-if="activePage==='store'">
      <h4 class="text-center mb-4">Become Art Producer</h4>
      <form class="col-4 offset-4">
        <b-input-group class="mt-3">
          <input type="text" required class="form-control" placeholder="Public Name"/>
        </b-input-group>
        <b-input-group class="mt-3">
          <select class="form-select" aria-label="Country">
            <option selected>Country</option>
            <option value="">Ukraine</option>
            <option value="">Poland</option>
            <option value="">USA</option>
          </select>
        </b-input-group>
        <b-input-group class="mt-3">
          <input type="text" required class="form-control" placeholder="City"/>
        </b-input-group>
        <b-input-group class="mt-3">
          <textarea name="" placeholder="Address" required class="form-control"></textarea>
        </b-input-group>
        <div class="mt-3">
          <button class="btn btn-primary">Create Store</button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import {logout} from "../utils"
import axios from 'axios';
import Big from 'big.js';
import Preloader from './Preloader.vue';
import Loading from 'vue-loading-overlay';

// const VUE_APP_SERVER_IP = 'http://46.101.118.74:9090'
const VUE_APP_SERVER_IP = 'http://localhost:9090'
export default {
  name: "SignedIn",

  beforeMount() {
    if (this.isSignedIn) {
      this.openArtPage()
    }
  },
  components: {
    Loading,
    Preloader,
  },
  data: function () {
    return {
      activePage: "art",
      isAddScreen: false,
      submitOrder: false,
      itemCreated: null,
      createForm: {
        title: "",
        media: "",
        width: 30,
        height: 30,
        border: 2,
        style: 1,
        isUpload: false
      },
      createItemForm: {
        name: "",
        phone: "",
        address: "",
      },
      ready: false,
      selectedNFT: {},
      sendToNearAddress: "",
      currentGcodeURL: "",
      myItems: [],
      myItemIds: [],
      myOrders: [],
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
    openArtPage() {
      this.activePage = 'art';
      this.retrieveMyItems();
    },
    openOrdersPage() {
      this.activePage = 'orders';
      this.retrieveMyOrders();
    }, openStorePage() {
      this.activePage = 'store';
    },
    getGcodeURL() {
      return `${VUE_APP_SERVER_IP}/gcode/${this.selectedNFT.token_id}`;
    },
    retrieveMyOrders() {
      this.ready = false;
      window.contract.all_orders({account_id: window.accountId}).then(items => {
        this.myOrders = [];
        if (items) {
          for (const [key, value] of Object.entries(items)) {
            let idList = Object.keys(this.myItemIds);
            if (idList.indexOf(key) !== -1) {
              this.myOrders.push({
                'id': key,
                'media': this.myItemIds[key],
                'data': value
              });
            }
          }
        }

        this.ready = true;
      })
    },
    loadModalCreate(item) {
      this.selectedNFT = item;
      this.itemCreated = null;
    },
    retrieveMyItems() {
      this.ready = false;
      this.isAddScreen = false;
      window.contract.nft_tokens_for_owner({account_id: window.accountId}).then(items => {
        this.myItems = items;
        this.myItemIds = {};
        this.myItems.forEach(nft => {
          this.myItemIds[nft.token_id] = nft.metadata.media;
        });
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
      axios.post(`${VUE_APP_SERVER_IP}/newnft`, {
        data: this.createForm
      }).then(response => {
        const hash = response.data.hash;
        if (hash) {
          let resultCoordinates = null;
          let resultImage = null;

          const checkCoordInterval = setInterval(() => {
            axios.get(`${VUE_APP_SERVER_IP}/coordinates/${hash}`).then(response => {
              if (response) {
                clearInterval(checkCoordInterval);
                resultCoordinates = response.data;
                resultImage = `${VUE_APP_SERVER_IP}/pict/${hash}`;
                this.createNFT(hash, resultImage, resultCoordinates);
                this.createForm.isUpload = false;
              }
            });
          }, 3000);

        } else {
          this.createForm.isUpload = false;
          alert('Server error: no hash');
        }
      }).catch(err => {
        this.createForm.isUpload = false;
        alert(err.message);
      });
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
        const GAS = Big(300).times(10 ** 12).toFixed();
        await window.contract.nft_mint({
          token_id: hash,
          receiver_id: window.accountId,
          token_metadata
        }, GAS);
      } catch (e) {
        alert("Something went wrong!");
        throw e
      } finally {
        this.retrieveMyItems();
      }
    },
    sendNFT() {
      const GAS = Big(300).times(10 ** 12).toFixed();
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
    createPhysicalItem() {
      this.submitOrder = true;
      const GAS = Big(300).times(10 ** 12).toFixed();

      window.contract.create_physical_item({
        token_id: this.selectedNFT.token_id.toString(),
        name: this.createItemForm.name,
        phone: this.createItemForm.phone,
        address: this.createItemForm.address,
      }, GAS).then(result => {
        console.log('result', result);
        this.itemCreated = result;
        this.submitOrder = false;
      }).catch(err => {
        console.log('Error!', err);
      });
    },
    logout: logout,
  },
}
</script>
