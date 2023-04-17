<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-card class="pa-5 mb-2">
          <Bar :chart-options="chartOptions" :chart-data="chartData" />
        </v-card>
        <v-card max-width="100%" class="pa-5">
          <Bar :chart-options="chartOptions" :chart-data="chartData2" />
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card max-width="100%" class="pa-5">
          <Doughnut :chart-options="options1" :chart-data="chartData" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
  
  <script>
import { Bar, Doughnut } from 'vue-chartjs'
import Chart from 'chart.js/auto'
import axios from 'axios'
export default {
  // layout:'layout',
  // middleware: 'auth',
  name: 'BarChart',
  components: { Bar, Doughnut },
  props: {},
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'ยอดขายต่อเดือนในแต่ละแพลตฟอร์ม(บาท)',
            data: [],
            backgroundColor: [
              'rgb(238, 77, 45)',
              'rgb(69, 108, 204)',
              'rgb(6, 199, 85)',
            ],
          },
        ],
      },
      chartData2: {
        labels: [],
        datasets: [
          {
            label: 'สินค้าขายดี(ชิ้น)',
            data: [],
            backgroundColor: ['rgb(255,215,0)'],
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
      options1: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              // Get the data for the current tooltip item
              const dataset = data.datasets[tooltipItem.datasetIndex]
              const value = dataset.data[tooltipItem.index]

              // Calculate the percentage and format as a string
              const total = dataset.data.reduce((acc, cur) => acc + cur, 0)
              const percent = ((value / total) * 100).toFixed(2) + '%'

              // Return the formatted label
              return `${data.labels[tooltipItem.index]}: ${percent}`
            },
          },
        },
      },
    }
  },
  methods: {
    getSales() {
      let today = new Date()
      let month = today.getMonth() + 1
      let year = today.getFullYear()
      let body = { month: month, year: year }
      let label = []
      axios.post('http://localhost:4000/graphData', body).then((res) => {
        console.log(res)
        let platform = res.data.sales
        for (let i = 0; i < platform.length; i++) {
          this.chartData.datasets[0].data.push(platform[i].total_sales)
          this.chartData.labels.push(platform[i].platform_name)
        }
        let best_seller = res.data.best_seller
        for (let i = 0; i < best_seller.length; i++) {
          this.chartData2.labels.push(best_seller[i].type)
          this.chartData2.datasets[0].data.push(best_seller[i].qty)
        }
        //  = label.slice()
        // this.chartData2.labels = label.slice()
      })
    },
  },
  mounted() {
    this.getSales()
  },
}
</script>