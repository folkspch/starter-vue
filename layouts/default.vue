<template>
  <v-app>
    <v-navigation-drawer
      dark
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      color="#B81F1F"
    >
      <v-list>
        <v-list-item exact to="/">
          <v-list-item-action>
            <v-icon>mdi-monitor-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>แดชบอร์ด</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group color="white">
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-warehouse</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>คลังสินค้า</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/warehouse">
            <v-list-item-content>
              <v-list-item-title>ดูคลังสินค้า</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/add_prod" v-if="$auth.user.role =='admin'">
            <v-list-item-content>
              <v-list-item-title>เพิ่มสินค้า</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group color="white">
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-cash-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>ยอดขาย</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/input_sales">
            <v-list-item-content>
              <v-list-item-title>เพิ่มข้อมูลยอดขาย</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group color="white" v-if="$auth.user.role =='admin'">
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-text-box-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>รายงาน</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/report">
            <v-list-item-content>
              <v-list-item-title>รายงาน</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/daily_graph">
            <v-list-item-content>
              <v-list-item-title>กราฟยอดขายรายวัน</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group color="white" v-if="$auth.user.role =='admin'">
          <template v-slot:activator>
            <v-list-item-action>
              <v-icon>mdi-account-edit</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>บัญชีผู้ใช้</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/create_user">
            <v-list-item-content>
              <v-list-item-title>สร้างบัญชีผู้ใช้</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/manage_user">
            <v-list-item-content>
              <v-list-item-title>จัดการบัญชีผู้ใช้</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark :clipped-left="clipped" fixed app color="#B81F1F">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-avatar tile>
        <img
          height="100"
          alt="Avatar"
          src="../assets/picture/asia_gold_logo.png"
        />
      </v-avatar>
      <v-toolbar-title>ASIAGOLD</v-toolbar-title>
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
          color="#D4A647"
            class="mr-2"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon left>mdi-account</v-icon>
            <!-- <v-avatar tile>
              <img
                height="100"
                alt="Avatar"
                src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
              />
            </v-avatar> -->
            <div>{{ $auth.user.username }}</div>
          </v-btn>
        </template>
        <v-list class="mt-1">
          <!-- <v-list-item link>
            <v-list-item-title>สร้างบัญชีผู้ใช้</v-list-item-title>
          </v-list-item> -->
          <v-list-item link>
            <v-list-item-title @click="logout()" class="red--text"
              >ออกจากระบบ</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      open: ['Users'],
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
  methods: {
    async logout() {
      try {
        await this.$auth.logout()
        this.$router.push('/login')
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400&display=swap');
* {
  font-family: 'Prompt', sans-serif;
}
.v-application {
  background: #f3f3f3;
}
</style>