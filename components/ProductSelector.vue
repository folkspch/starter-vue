<template>
  <v-row>
    <v-col cols="3">
      <v-select
        color="red"
        item-color="red"
        :items="type_list"
        v-model="selected_type"
        variant="solo"
        label="ประเภท"
        @change="filter_pattern()"
      ></v-select>
    </v-col>
    <v-col cols="3">
      <v-select
        color="red"
        item-color="red"
        :items="pattern_list"
        v-model="selected_pattern"
        :disabled="this.selected_type ? false : true"
        variant="solo"
        label="ลาย"
        @change="filter_weight()"
      ></v-select>
    </v-col>
    <v-col cols="3">
      <v-select
        @change="qty =1"
        color="red"
        item-color="red"
        :items="weight_list"
        v-model="selected_weight"
        :disabled="this.selected_pattern ? false : true"
        variant="solo"
        label="น้ำหนัก"
      ></v-select>
    </v-col>
    <v-col cols="3">
      <v-text-field
      @blur="validInput()"
        min="1"
        @keydown="onKeyDown"
        v-model="qty"
        color="red"
        :disabled="this.selected_weight ? false : true"
        type="number"
        variant="solo"
        label="จำนวน"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    id: Number,
  },
  data: () => ({
    qty: null,
    selected_type: null,
    selected_pattern: null,
    selected_weight: null,
    prodList: [],
    type_list: [],
    pattern_list: [],
    weight_list: [],
  }),
  watch: {
    qty: 'updateSelect',
    selected_type: 'updateSelect',
    selected_pattern: 'updateSelect',
    selected_weight: 'updateSelect',
  },
  methods: {
    updateSelect() {
      let selected = {
        type: this.selected_type,
        pattern: this.selected_pattern,
        weight: this.selected_weight,
        qty: parseInt(this.qty),
      }
      if (this.qty && this.qty > 0) {
        this.$store.commit('setTypeInput', {
          index: this.id - 1,
          value: selected,
        })
      }
    },
    validInput() {
      if (this.qty < 1) {
        this.qty = 1
      }
    },
    getProdList() {
      axios.post('http://localhost:4000/getProdList', {}).then((res) => {
        this.max_render = res.data.data.length
        let data = res.data.data
        this.prodList = res.data.data.slice()
        for (let i = 0; i < data.length; i++) {
          this.type_list.push(data[i].type)
        }
        this.type_list = this.type_list.filter(this.onlyUnique)
      })
    },
    filter_pattern() {
      this.qty = null
      this.pattern_list = []
      this.selected_pattern = null
      this.selected_weight = null
      for (let i = 0; i < this.prodList.length; i++) {
        if (this.prodList[i].type == this.selected_type) {
          this.pattern_list.push(this.prodList[i].pattern)
        }
      }
      this.pattern_list = this.pattern_list.filter(this.onlyUnique)
    },
    filter_weight() {
      this.weight_list = []
      for (let i = 0; i < this.prodList.length; i++) {
        if (this.prodList[i].pattern == this.selected_pattern && this.prodList[i].type == this.selected_type) {
          this.weight_list.push(
            `${this.prodList[i].weight_th} (${this.prodList[i].weight}g)`
          )
        }
      }
      this.weight_list = this.weight_list.filter(this.onlyUnique)
    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index
    },
    onKeyDown(event) {
      if (event.key == '-'|event.key == '0') {
        event.preventDefault()
      }
    },
  },
  mounted() {
    this.getProdList()
  },
}
</script>

<style>
</style>