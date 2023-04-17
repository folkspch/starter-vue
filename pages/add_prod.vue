<template>
  <div>
    <v-card class="pa-3 mb-6" elevation="1">
      <v-card-title
        ><v-icon large>mdi-package-variant-closed-plus</v-icon
        >&nbsp;|&nbsp;เพิ่มสินค้า</v-card-title
      >
      <v-breadcrumbs :items="items" class="pa-0 ml-5">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-card>
    <v-row justify="center">
      <v-card class="pb-5" width="50%">
        <v-card-title class="mx-auto"> เพิ่มสินค้า</v-card-title>
        <v-divider></v-divider>
        <div class="mt-5 px-6 pb-3">
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="5">
              <v-card-text class="d-flex justify-end">ประเภท</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                style="width: 50%"
                v-model="prodInfo.type"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="5">
              <v-card-text class="d-flex justify-end">ลาย</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                style="width: 50%"
                v-model="prodInfo.pattern"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="5">
              <v-card-text class="d-flex justify-end"
                >ขนาด (น้ำหนัก)</v-card-text
              >
            </v-col>
            <v-col>
              <v-text-field
                style="width: 50%"
                placeholder="ตัวอย่าง 1สลึง(3.8g)"
                v-model="prodInfo.weight"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="5">
              <v-card-text class="d-flex justify-end">คงเหลือ</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                @change="remainHandle()"
                style="width: 50%"
                type="number"
                v-model="prodInfo.remain"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center"
            ><v-btn @click="addProd()" color="primary">บันทึก</v-btn></v-row
          >
        </div>
      </v-card>
    </v-row>
    <v-dialog v-model="completeDialog" width="auto">
      <v-card>
        <v-card-title
          ><v-icon color="green">mdi-check-bold</v-icon
          >&nbsp;เพิ่มข้อมูลสินค้าแล้ว</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="redirect()">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  middleware({ $auth, redirect }) {
    if ($auth.user.role != 'admin') {
      redirect('/')
    }
  },
  data: () => ({
    completeDialog:false,
    prodInfo: {
      type: null,
      pattern: null,
      weight: null,
      remain: 0,
    },
    items: [
      {
        text: 'หน้าหลัก',
        disabled: false,
        href: '/',
      },
      {
        text: 'คลังสินค้า',
        disabled: false,
        href: '/warehouse',
      },
      {
        text: 'เพิ่มสินค้า',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
    ],
  }),
  methods: {
    remainHandle() {
      if (this.prodInfo.remain < 0) {
        this.prodInfo.remain = 0
      }
    },
    addProd() {
      if (
        this.prodInfo.type &&
        this.prodInfo.pattern &&
        this.prodInfo.weight
      ) {
        axios
          .post('http://localhost:4000/addProd', this.prodInfo)
          .then((res) => {
            if (res.status == 200) {
              this.completeDialog = true
            }
          })
      }
    },
    redirect() {
      this.completeDialog = false
      this.$router.replace('/warehouse')
    },
  },
}
</script>

<style>
</style>