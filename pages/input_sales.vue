<template>
  <div>
    <v-card class="pa-3 mb-6" elevation="1">
      <v-card-title
        ><v-icon large>mdi-cash-multiple</v-icon
        >&nbsp;|&nbsp;ยอดขาย</v-card-title
      >
      <v-breadcrumbs :items="items" class="pa-0 ml-5">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-card>

    <v-row justify="center">
      <v-card class="pb-4" width="50%">
        <v-card-title class="mx-auto"> กรอกยอดขาย </v-card-title>
        <v-divider></v-divider>
        <div class="px-6">
          <v-card-text>วัน/เดือน/ปี</v-card-text>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="100"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="formatDate()"
                color="red"
                readonly
                outlined
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              :max="currentDate"
              color="red"
              v-model="date"
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
          <v-card-text>สาขา</v-card-text>
          <v-select
            item-color="red"
            placeholder="สาขา"
            color="red"
            v-model="select_platform"
            :items="platform_list"
            item-text="platform_name"
            item-value="platform_id"
            outlined
          ></v-select>
          <v-card-text>ยอดขายรวม</v-card-text>
          <v-text-field
            suffix="บาท"
            hide-spin-buttons
            outlined
            color="red"
            item-color="red"
            v-model="total_sales"
            type="number"
          ></v-text-field>
          <v-row no-gutters justify="center">
            <v-btn
              @click="saveSalesTitle()"
              class="py-6 px-10"
              dark
              color="red"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </v-row>
        </div>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: () => ({
    currentDate: new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 10),
    total_sales: null,
    select_platform: null,
    platform_list: [],
    date: new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    items: [
      {
        text: 'หน้าหลัก',
        disabled: false,
        href: '/',
      },
      {
        text: 'ยอดขาย',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
    ],
  }),
  methods: {
    saveSalesTitle() {
      if (this.date && this.select_platform && this.total_sales) {
        this.$router.push({
          name: 'input_sales_detail',
          params: {
            date: this.date,
            platform: this.select_platform,
            total_sales: parseInt(this.total_sales),
          },
        })
      }

      // if (this.date && this.select_platform && this.total_sales) {
      //   await this.$store.commit('setSalesTitle', {
      //     date: this.date,
      //     platform: this.select_platform,
      //     total_sales: parseInt(this.total_sales),
      //   })
      //   await this.$router.push("/input_sales_detail");
      // }
      // else{
      //   console.log("dasda")
      // }
    },
    formatMoney() {
      const formatter = new Intl.NumberFormat({
        style: 'currency',
        currency: 'USD',
      })
      console.log(formatter.format(this.total_sales))
      return formatter.format(this.total_sales)
    },
    formatDate() {
      if (this.date) {
        const date = new Date(this.date)
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
        return date.toLocaleDateString('en-GB', options)
      } else {
        return ''
      }
    },
    getPlatformList() {
      axios.get('http://localhost:4000/getPlatformList').then((res) => {
        this.platform_list = res.data.data
        console.log(this.currentDate)
      })
    },
  },
  mounted() {
    this.getPlatformList()
    this.$store.commit('setSalesTitle', {})
  },
}
</script>

<style></style>
