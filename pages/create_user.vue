<template>
  <div>
    <v-card class="pa-3 mb-6" elevation="1">
      <v-card-title
        ><v-icon large>mdi-account-plus</v-icon>&nbsp;|&nbsp;สร้างบัญชีผู้ใช้</v-card-title
      >
      <v-breadcrumbs :items="items" class="pa-0 ml-5">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-card>
    <v-row justify="center">
      <v-card class="pb-4" width="50%">
        <v-card-title class="mx-auto"> สร้างบัญชีผู้ใช้ </v-card-title>
        <v-divider></v-divider>
        <div class="mt-5 px-6 pb-3">
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="3">
              <v-card-text class="d-flex justify-end">Username</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                v-model="userInfo.username"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="3">
              <v-card-text class="d-flex justify-end">Password</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                v-model="userInfo.password"
                :type="show1 ? 'text' : 'password'"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show1 = !show1"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="3">
              <v-card-text class="d-flex justify-end">คำนำหน้า</v-card-text>
            </v-col>
            <v-col>
              <v-select
                :items="['นาย', 'นาง', 'นางสาว']"
                item-color="red"
                v-model="userInfo.prefix"
                hide-details
                dense
                outlined
                color="red"
              ></v-select>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="3">
              <v-card-text class="d-flex justify-end">ชื่อ - สกุล</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                v-model="userInfo.name"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="3">
              <v-card-text class="d-flex justify-end">ตำแหน่ง</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                v-model="userInfo.position"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="3">
              <v-card-text class="d-flex justify-end">เบอร์โทร</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                hide-spin-buttons
                type="number"
                v-model="userInfo.tel"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center"
            ><v-btn @click="dialog = true" color="primary">บันทึก</v-btn></v-row
          >
        </div>
      </v-card>
    </v-row>
    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-title>ยืนยันการบันทึกข้อมูล</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="addUser()">ตกลง</v-btn>
          <v-btn color="error" @click="dialog = false">ยกเลิก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog2" width="auto">
      <v-card>
        <v-card-title
          ><v-icon color="green">mdi-check-bold</v-icon
          >&nbsp;เพิ่มข้อมูลผู้ใช้สำเร็จ</v-card-title
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
    dialog: false,
    dialog2: false,
    show1: false,
    userInfo: {
      username: null,
      password: null,
      prefix: null,
      name: null,
      position: null,
      tel: null,
    },
    items: [
      {
        text: 'หน้าหลัก',
        disabled: false,
        href: '/',
      },
      {
        text: 'สร้างบัญชีผู้ใช้',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
    ],
  }),
  methods: {
    addUser() {
      if (
        this.userInfo.username &&
        this.userInfo.password &&
        this.userInfo.prefix &&
        this.userInfo.name &&
        this.userInfo.position &&
        this.userInfo.tel
      ) {
        console.log(this.userInfo)
        axios
          .post('http://localhost:4000/addUser', this.userInfo)
          .then((res) => {
            if ((res.status = 200)) {
              this.dialog2 = true
              this.dialog = false
            }
          })
      }
      // else{
      //   console.log('dsadasd')
      // }
    },
    redirect() {
      this.dialog = false
      this.dialog2 = false
      this.userInfo = {
        username: null,
        password: null,
        prefix: null,
        name: null,
        position: null,
        tel: null,
      }
    },
  },
}
</script>

<style>
</style>