<template>
  <div>
    <v-card class="pa-3 mb-6" elevation="1">
      <v-card-title
        ><v-icon large>mdi-cash-multiple</v-icon
        >&nbsp;|&nbsp;กรอกรายละเอียดยอดขาย</v-card-title
      >
      <v-breadcrumbs :items="items" class="pa-0 ml-5">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-card>
    <v-row justify="center" class="mb-1">
      <v-card width="50%">
        <div class="px-6">
          <v-card-text>จำนวนประเภทที่ขาย</v-card-text>
          <v-row no-gutters>
            <v-col cols="3">
              <v-text-field
                dense
                v-on:keyup.enter="renderInputField()"
                v-model="inputQty"
                outlined
                color="red"
                hide-spin-buttons
                type="number"
                class="d-flex align-center"
              >
              </v-text-field>
            </v-col>
            <v-col cols="3">
              <v-btn
                dark
                elevation="0"
                height="40"
                color="red"
                @click="renderInputField()"
                >ตกลง</v-btn
              >
            </v-col>
          </v-row>
        </div>
        <v-divider></v-divider>
        <div class="px-6 mt-2">
          <div>
            <ProductSelector
              v-for="n in renderQty"
              :key="n"
              :id="n"
            ></ProductSelector>
            <!-- <v-row v-for="n in renderQty" :key="n">
              <v-col cols="3">
                <v-select variant="solo" label="ประเภท"></v-select>
              </v-col>
              <v-col cols="3">
                <v-select variant="solo" label="ลาย"></v-select>
              </v-col>
              <v-col cols="3">
                <v-select variant="solo" label="ไซส์"></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field type="number" variant="solo" label="จำนวน"></v-text-field>
              </v-col>
            </v-row> -->
          </div>
        </div>
        <v-divider></v-divider>
        <v-row class="my-3" justify="center">
          <v-btn color="success" @click="saveData()"> บันทึก </v-btn>
        </v-row>
        <!-- {{ this.date }}
        {{ this.platform }}
        {{ this.total_sales }} -->
      </v-card>
      <v-dialog v-model="dialog" width="auto">
        <v-card>
          <v-card-title
            ><v-icon color="green">mdi-check-bold</v-icon
            >&nbsp;เพิ่มข้อมูลสำเร็จ</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="redirect()">ตกลง</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="errorDialog" width="auto">
        <v-card>
          <v-card-title
            ><v-icon color="red">mdi-close-thick</v-icon>&nbsp;{{
              this.errorMsg
            }}</v-card-title
          >
          <v-card-text v-if="this.errorMsg2">{{ this.errorMsg2 }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeErrorDialog()">ตกลง</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import ProductSelector from '~/components/ProductSelector.vue'
import axios from 'axios'
export default {
  async asyncData({ params }) {
    const date = params.date
    const platform = params.platform
    const total_sales = params.total_sales
    return { date, platform, total_sales }
  },
  data: () => ({
    max_render:null,
    dialog: false,
    errorDialog: false,
    errorMsg: '',
    errorMsg2: null,
    inputQty: 1,
    renderQty: 1,
    items: [
      {
        text: 'หน้าหลัก',
        disabled: false,
        href: '/',
      },
      {
        text: 'ยอดขาย',
        disabled: false,
        href: '/input_sales',
      },
      {
        text: 'กรอกรายละเอียดยอดขาย',
        disabled: true,
        href: 'breadcrumbs_link_1',
      },
    ],
  }),
  methods: {
    redirect() {
      this.dialog = false
      this.$router.replace('/input_sales')
    },
    renderInputField() {
      if (
        (parseInt(this.inputQty) == 0) |
        (parseInt(this.inputQty) < 0) |
        (this.inputQty == '')
      ) {
        this.inputQty = 1
      }
      else if(parseInt(this.inputQty)>this.max_render){
        this.inputQty = this.max_render
      }
      this.renderQty = parseInt(this.inputQty)
      this.$store.commit('setTypeInputSize', this.inputQty)
    },
    saveData() {
      let body = {
        date: this.date,
        platform: this.platform,
        total_sales: this.total_sales,
        prod_list: this.$store.state.typeInput,
      }
      console.log(body)
      if (body.date && body.platform && body.total_sales) {
        if (body.prod_list.length > 0) {
          axios.post('http://localhost:4000/addSales', body).then((res) => {
            if (res.status == 200) {
              this.dialog = true
            } else if (res.status == 201) {
              this.errorMsg = 'เกิดข้อผิดพลาด'
              this.errorMsg2 = `จำนวนสินค้า ${res.data.type} ${res.data.pattern} ${res.data.weight} ในคลังไม่เพียงพอกับการหักยอด (จำนวนที่เหลือในคลัง: ${res.data.stock_remain})`
              this.errorDialog = true
            } else {
              this.errorMsg = 'เกิดข้อผิดพลาด'
              this.errorDialog = true
            }
          })
        } else {
          this.errorMsg = 'โปรดกรอกข้อมูลให้ครบ'
          this.errorDialog = true
        }
      } else {
        this.errorMsg = 'โปรดกรอกข้อมูลให้ครบ'
        this.errorDialog = true
      }
    },
    closeErrorDialog(){
      this.errorDialog = false
      this.errorMsg = null
      this.errorMsg2 = null
    },
    getProdList() {
      axios.post('http://localhost:4000/getProdList', {}).then((res) => {
        this.max_render = res.data.data.length
      })
    }
  },
  created() {
    if (!this.date | !this.platform | !this.total_sales) {
      this.$router.push('/input_sales')
    }
  },
  mounted() {
    this.$store.commit('setTypeInputSize', this.inputQty - 1)
    this.getProdList()
  },
  components: { ProductSelector },

  // created(){
  //   if (this.$store.state.salesTitle){
  //     this.$router.push('/input_sales')
  //   }
  // }
}
</script>

<style>
</style>