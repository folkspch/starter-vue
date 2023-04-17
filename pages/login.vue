<template>
  <div>
    <v-row no-gutters>
      <v-col cols="7">
        <v-img height="100%" src="/asia_gold_store.jpg"></v-img>
      </v-col>
      <v-col cols="5" class="d-flex justify-center align-center">
        <v-card width="55%" class="pa-2 ma-3 mt-10" color="">
          <v-img height="100%" contain src="/asia_gold.png"></v-img>
          <v-card-title> ASIA GOLD </v-card-title>
          <v-card-subtitle> เข้าสู่ระบบ</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field color="red" v-model="user" label="ชื่อผู้ใช้"
              ><v-icon slot="prepend" color="red">
                mdi-account
              </v-icon></v-text-field
            >
            <v-text-field
              color="red"
              v-model="password"
              v-on:keyup.enter="login()"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              label="รหัสผ่าน"
              @click:append="show1 = !show1"
              ><v-icon slot="prepend" color="red">
                mdi-lock
              </v-icon></v-text-field
            >
            <div v-if="errorMsg" class="d-flex justify-center mb-2" style="color: red">
              {{ errorMsg }}
            </div>
            <!-- <v-checkbox v-model="remember" label="จดจำฉันไว้?"></v-checkbox> -->
            <div class="d-flex justify-center align-center">
              <v-btn
                @click="login()"
                :disabled="this.loading"
                :loading="this.loading"
                color="red"
                style="color: white"
                >เข้าสู่ระบบ</v-btn
              >
              <v-divider class="mx-3" vertical light></v-divider>
              <a @click="dialog=true">ลืมรหัสผ่าน?</a>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <v-card-title
          ><v-icon color="primary">mdi-information</v-icon
          >&nbsp;กรุณาติดต่อผู้ดูแล</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">ตกลง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  layout: 'loginLayout',
  data() {
    return {
      dialog:false,
      errorDialog: false,
      errorMsg: null,
      show1: false,
      loading: false,
      user: null,
      password: null,
    }
  },
  methods: {
    async login() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            username: this.user,
            password: this.password,
          },
        })
        // this.$router.push('/')
      } catch (error) {
        if (error.response.status == 401) {
          this.errorMsg = 'รหัสผ่านผิด'
          // this.errorDialog = true
        } else if (error.response.status == 402) {
          this.errorMsg = 'ไม่พบ Username'
          // this.errorDialog = true
        }
      }
    },
  },
}
</script>

<style>
</style>