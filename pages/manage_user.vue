<template>
  <div>
    <v-card class="pa-3 mb-6" elevation="1">
      <v-card-title
        ><v-icon large>mdi-account-edit</v-icon
        >&nbsp;|&nbsp;จัดการบัญชีผู้ใช้</v-card-title
      >
      <v-breadcrumbs :items="items" class="pa-0 ml-5">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-card>

    <v-card class="pb-4" width="100%">
      <v-card-title class="mx-auto">จัดการบัญชีผู้ใช้ </v-card-title>
      <v-divider></v-divider>
      <div class="mt-5 px-6 pb-3">
        <v-text-field
          style="width: 30%"
          v-model="searchKey"
          placeholder="ค้นหา"
          class="mb-3"
          color="red"
          dense
          outlined
          hide-details
        ></v-text-field>
        <v-data-table
          :search="searchKey"
          ref="dataTable"
          :headers="headers"
          :items="userList"
          :items-per-page="10"
          class="elevation-1"
        >
          <template #item="{ item }">
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.username }}</td>
              <td>{{ item.position }}</td>
              <td>{{ item.tel }}</td>
              <td>{{ item.created_at }}</td>
              <td>{{ item.role }}</td>
              <td>
                <v-btn icon small>
                  <v-icon @click="editUser(item.username)">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small>
                  <v-icon @click="delUser(item.username)">mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-card>
    <v-dialog v-model="editDialog" width="auto">
      <v-card class="pb-3">
        <div class="mt-5 px-6 pb-3">
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="4">
              <v-card-text class="d-flex justify-end">Username</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                disabled
                v-model="userInfo.username"
                :value="userInfo.password"
                hide-details
                dense
                outlined
                color="red"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col class="justify-center" align-self="center" cols="4">
              <v-card-text class="d-flex justify-end">Password</v-card-text>
            </v-col>
            <v-col>
              <v-text-field
                v-model="userInfo.password"
                :value="userInfo.password"
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
            <v-col class="justify-center" align-self="center" cols="4">
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
            <v-col class="justify-center" align-self="center" cols="4">
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
            <v-col class="justify-center" align-self="center" cols="4">
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
            <v-col class="justify-center" align-self="center" cols="4">
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
            ><v-btn @click="saveEditUser()" color="primary"
              >บันทึก</v-btn
            ></v-row
          >
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="completeDialog" width="auto">
      <v-card>
        <v-card-title
          ><v-icon color="green">mdi-check-bold</v-icon
          >&nbsp;เปลี่ยนแปลงข้อมูลผู้ใช้แล้ว</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="completeDialog = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errorDialog" width="auto">
      <v-card>
        <v-card-title
          ><v-icon color="red">mdi-close-thick</v-icon
          >&nbsp;เกิดข้อผิดพลาด</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="errorDialog = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="delDialog" width="auto">
      <v-card>
        <v-card-title
          ><v-icon color="red">mdi-delete-alert</v-icon
          >&nbsp;ยืนยันการลบ</v-card-title
        >
        <v-card-text>
          คุณต้องการจะลบข้อมูลของ user : {{ this.delUsername }} หรือไม่
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" @click="saveDelUser()">ตกลง</v-btn>
          <v-btn color="error" @click="delDialog = false">ยกเลิก</v-btn>
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
    searchKey: null,
    delDialog: false,
    delUsername: null,
    show1: false,
    editDialog: false,
    errorDialog: false,
    completeDialog: false,
    userList: [],
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
        text: 'จัดการบัญชีผู้ใช้',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
    ],
    headers: [
      {
        text: 'ชื่อ-สกุล',
        value: 'name',
      },
      { text: 'ชื่อผู้ใช้', value: 'username' },
      { text: 'ตำแหน่ง', value: 'position' },
      { text: 'เบอร์โทร', value: 'tel' },
      { text: 'สร้างเมื่อ', value: 'created_at' },
      { text: 'สิทธิ', value: 'role' },
      { text: 'action', value: '' },
    ],
  }),
  methods: {
    getUserList() {
      axios.post('http://localhost:4000/getUser', {}).then((res) => {
        let data = res.data.data
        for (let i = 0; i < data.length; i++) {
          data[i].name =
            data[i].prefix + data[i].first_name + ' ' + data[i].last_name
          let temp_time = new Date(data[i].created_at)
          data[i].created_at = temp_time.toLocaleString('en-US', {
            timeZone: 'Asia/Bangkok',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
          // console.log(data[i])
          // data[i].push({name:data.prefix+data.first_name+" "+data.last_name})
        }
        this.userList = data.slice()
      })
    },
    editUser(username) {
      if (username) {
        axios
          .post('http://localhost:4000/getUser', { username: username })
          .then((res) => {
            let data = res.data.data
            this.userInfo = {
              username: data[0].username,
              prefix: data[0].prefix,
              name: data[0].first_name + ' ' + data[0].last_name,
              position: data[0].position,
              tel: data[0].tel,
            }
            this.editDialog = true
          })
      }
    },
    saveEditUser() {
      if (
        this.userInfo.username &&
        this.userInfo.prefix &&
        this.userInfo.name &&
        this.userInfo.position &&
        this.userInfo.tel
      ) {
        axios
          .post('http://localhost:4000/editUserData', this.userInfo)
          .then((res) => {
            if (res.status == 200) {
              this.editDialog = false
              this.completeDialog = true
            }
            this.getUserList()
          })
      }
    },
    delUser(username) {
      this.delUsername = username
      this.delDialog = true
    },
    saveDelUser() {
      if (this.delUsername) {
        axios
          .post('http://localhost:4000/delUser', { username: this.delUsername })
          .then((res) => {
            if (res.status == 200) {
              this.delDialog = false
              this.completeDialog = true
            }
            this.getUserList()
          })
      }
    },
  },
  mounted() {
    this.getUserList()
  },
}
</script>

<style>
</style>