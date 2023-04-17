<template>
  <div>
    <v-card class="pa-3 mb-6" elevation="1">
      <v-card-title
        ><v-icon large>mdi-text-box</v-icon>&nbsp;|&nbsp;รายงาน</v-card-title
      >
      <v-breadcrumbs :items="items" class="pa-0 ml-5">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-card>

    <v-card>
      <v-row justify="center" class="pa-3">
        <v-col cols="2">
          <v-select
            @change="getSalesData()"
            v-model="selected_month"
            color="red"
            item-color="red"
            item-text="thMonth"
            item-value="intMonth"
            dense
            :items="month"
            label="เดือน"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-select
            @change="getSalesData()"
            v-model="selected_year"
            color="red"
            item-color="red"
            dense
            :items="year"
            label="ปี"
            outlined
          ></v-select>
        </v-col>
        <v-col>
          <v-btn @click="exportPDF()" icon color="red">
            <v-icon large> mdi-file-pdf-box </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card>
      <v-data-table
        id="dataTable"
        ref="dataTable"
        :headers="headers"
        :items="data"
        :items-per-page="10"
        class="elevation-1"
      >
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import html2pdf from 'html2pdf.js'
export default {
  middleware({ $auth, redirect }) {
    if ($auth.user.role != 'admin') {
      redirect('/')
    }
  },
  data: () => ({
    items: [
      {
        text: 'หน้าหลัก',
        disabled: false,
        href: '/',
      },
      {
        text: 'รายงาน',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
    ],
    month: null,
    year: null,
    selected_month: null,
    selected_year: null,
    headers: [
      // {
      //   text: 'วันที่',
      //   align: 'start',
      //   value: 'sale_day',
      // },
      // { text: 'Shopee', value: 'platform_1' },
      // { text: 'Lazada', value: 'platform_2' },
      // { text: 'Line Shop', value: 'platform_3' },
      // { text: 'JD Central', value: 'jd' },
      // { text: 'ยอดรวม', value: 'total_sales' },
    ],
    data: [],
  }),
  methods: {
    getSelect() {
      axios.get('http://localhost:4000/getLimitOfSales').then((res) => {
        this.month = res.data.month.slice()
        this.year = res.data.year.slice()
      })
    },
    getSalesData() {
      let body = {
        month: this.selected_month,
        year: this.selected_year,
      }
      if (body.month && body.year) {
        axios.post('http://localhost:4000/getSalesData', body).then((res) => {
          this.data = res.data.data.slice()
          let platform = res.data.platform.slice()
          let header = [
            {
              text: 'วันที่',
              align: 'start',
              value: 'sale_day',
            },
          ]
          for (let i = 0; i < platform.length; i++) {
            header.push({
              text: `${platform[i].platform_name}`,
              align: 'start',
              value: `platform_${platform[i].platform_id}`,
            })
          }
          header.push({ text: 'ยอดรวม', align: 'start', value: 'total_sales' })
          this.headers = header.slice()
        })
      }
    },
    exportPDF() {
      if (this.data.length > 0) {
        const table = document.getElementById('dataTable')
        html2pdf().from(table).save('report.pdf')
      }
    },
  },
  mounted() {
    this.getSelect()
  },
}
</script>

<style>
</style>