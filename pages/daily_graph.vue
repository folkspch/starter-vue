<template>
  <div>
    <v-card class="pa-3 mb-6" elevation="1">
      <v-card-title
        ><v-icon large>mdi-account-edit</v-icon
        >&nbsp;|&nbsp;กราฟยอดขายรายวัน</v-card-title
      >
      <v-breadcrumbs :items="items" class="pa-0 ml-5">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-card>
    <v-row justify="center">
      <v-card width="50%" height="60%" class="pa-5">
        <v-row dense no-gutters>
          <v-col cols="6">
            <v-select
              hide-details
              @change="getSales()"
              placeholder="แพลตฟอร์ม"
              v-model="selected_platform"
              style="width: 90%"
              dense
              outlined
              item-color="red"
              color="red"
              :items="plaform_list"
              item-text="platform_name"
              item-value="platform_id"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              :disabled="!this.selected_platform ? true : false"
              hide-details
              @change="getSales()"
              placeholder="ประเภท"
              v-model="selected_type"
              style="width: 90%"
              dense
              outlined
              item-color="red"
              color="red"
              :items="type_list"
            ></v-select>
          </v-col>
        </v-row>
        <div
          v-if="this.date_today"
          style="color: #808080; font-size: small"
          class="my-3"
        >
          ข้อมูล ณ วันที่ {{ this.date_today }}
        </div>
        <div v-if="this.chartData.datasets[0].data.length > 0">
          <v-row justify="center" class="pb-3">
            <v-card max-width="60%" elevation="0">
              <Doughnut :chart-options="chartOptions" :chart-data="chartData" />
            </v-card>
          </v-row>
        </div>
        <div v-else>
          <v-row justify="center" class="pb-3 mt-2">
            <v-card-text class="d-flex justify-center">ไม่มีข้อมูล</v-card-text>
          </v-row>
        </div>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import { Bar, Doughnut } from 'vue-chartjs'
import Chart from 'chart.js/auto'
import axios from 'axios'
export default {
  middleware({ $auth, redirect }) {
    if ($auth.user.role != 'admin') {
      redirect('/')
    }
  },
  components: { Bar, Doughnut },
  data: () => ({
    type_list: ['สร้อยคอ', 'สร้อยข้อมือ', 'แหวน'],
    date_today: null,
    selected_type: null,
    selected_platform: null,
    plaform_list: [],
    items: [
      {
        text: 'หน้าหลัก',
        disabled: false,
        href: '/',
      },
      {
        text: 'กราฟยอดขายรายวัน',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
    ],
    chartData: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            'rgb(238, 77, 45)',
            'rgb(69, 108, 204)',
            'rgb(6, 199, 85)',
          ],
        },
      ],
    },
    chartOptions: {
      responsive: true,
    },
  }),
  methods: {
    getSales() {
      let today = new Date()
      let month = today.getMonth() + 1
      let year = today.getFullYear()
      let date = today.getDate()
      this.date_today = date + '/' + month + '/' + year
      let body = {
        month: month,
        year: year,
        date: date,
        platform: this.selected_platform,
        is_dailyGraph: true,
      }
      this.chartData.labels = []
      this.chartData.datasets[0].data = []
      if (this.selected_platform && this.selected_type) {
        axios.post('http://localhost:4000/graphData', body).then((res) => {
          let best_seller = res.data.best_seller
          if (best_seller) {
            for (let i = 0; i < best_seller.length; i++) {
              if (best_seller[i].type == this.selected_type) {
                this.chartData.labels.push(best_seller[i].pattern)
                this.chartData.datasets[0].data.push(best_seller[i].qty)
              }
            }
          } else {
            this.chartData.labels = []
            this.chartData.datasets[0].data = []
          }
          //  = label.slice()
          // this.chartData2.labels = label.slice()
        })
      }
    },
    getPlatformList() {
      axios.get('http://localhost:4000/getPlatformList').then((res) => {
        for (let i = 0; i < res.data.data.length; i++) {
          this.plaform_list.push({
            platform_id: res.data.data[i].platform_id,
            platform_name: res.data.data[i].platform_name,
          })
        }
      })
    },
  },
  mounted() {
    this.getPlatformList()
  },
}
</script>

<style>
</style>