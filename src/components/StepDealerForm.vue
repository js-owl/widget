<template>
  <el-col :span="13" class="step-dealer-container">
    <el-text
      class="elis-text elis-widget-step-title"
      tag="h3"
      style="text-align: left"
    >
      Выберите дилерский центр
    </el-text>

    <el-form
      :model="dealerForm"
      class="step-dealer"
      @submit.prevent="getDealerList()"
    >
      <el-form-item props="dealerId" class="step-dealer__item step-form-item">
        <el-tabs
          v-model="activeChooseDealer"
          type="card"
          class="elis-tabs step-dealer__tabs"
        >
          <!-- Вкладка "Карта" -->
          <el-tab-pane label="Карта" :disabled="true" name="map"></el-tab-pane>

          <!-- Вкладка "Список" -->
          <el-tab-pane label="Список" name="list">
            <el-row>
              <el-text
                class="elis-text elis-text-black"
                style="margin-right: 5px"
                >Дилеры в</el-text
              >
              <el-cascader
                ref="refCity"
                v-modal="searchCity"
                :options="options"
                v-loading="loadingCity"
                clearable
                :filterable="true"
                :filter-method="filterOptions"
                popper-class="elis-select-city-popper"
                :show-all-levels="false"
                :props="propsCascader"
                placeholder="Введите город для поиска или выберите из списка"
                class="elis-select-city"
                style="width: calc(100% - 70px)"
                @change="handleCityChange()"
              />
            </el-row>

            <!-- Фильтр поиска -->
            <!-- <el-input
              v-model="searchValue"
              type="text"
              clearable
              class="elis-input seach-dealer"
              placeholder="Поиск по названию и адресу"
              @input="getDealerList()"
            /> -->

            <!-- Список дилеров -->
            <el-radio-group
              v-model="dealerForm.dealerId"
              class="dealer-btn-group"
              v-show="showPlug === false"
              v-loading="loadingDealer"
            >
              <el-row
                v-for="(item, index) in dealerList"
                :key="index"
                class="dealer-container"
              >
                <el-text tag="h4" :key="index" class="elis-text dealer-title">{{
                  item.name
                }}</el-text>
                <el-text
                  v-if="
                    item.address !== '' &&
                    item.address !== undefined &&
                    item.address !== null
                  "
                  tag="p"
                  :key="index"
                  class="elis-text dealer-subtitle"
                  >{{ item.address }}</el-text
                >

                <el-col :span="12" class="dealer-contact dealer-col">
                  <el-link
                    v-if="
                      item.phone !== '' &&
                      item.phone !== undefined &&
                      item.phone !== null
                    "
                    :href="'tel:' + item.phone"
                    type="primary"
                    :key="index"
                    class="elis-text dealer-subtitle elis-link dealer-phone"
                    >{{ item.phone }}</el-link
                  >
                  <el-link
                    v-if="
                      item.website !== '' &&
                      item.website !== undefined &&
                      item.website !== null &&
                      (item.website.includes('https://') ||
                        item.website.includes('http://'))
                    "
                    type="primary"
                    :href="item.website"
                    target="_blank"
                    :key="index"
                    class="elis-link dealer-link"
                  >
                    Перейти на сайт</el-link
                  >
                  <el-link
                    v-if="
                      item.website !== '' &&
                      item.website !== undefined &&
                      item.website !== null &&
                      !item.website.includes('https://') &&
                      !item.website.includes('http://')
                    "
                    type="primary"
                    :href="'https://' + item.website"
                    target="_blank"
                    :key="index"
                    class="elis-link dealer-link"
                  >
                    Перейти на сайт</el-link
                  >
                </el-col>
                <el-col :span="12" class="dealer-btn-container dealer-col">
                  <el-radio-button
                    class="dealer-btn"
                    :key="index"
                    :value="item.dealer_id"
                    :label="item.dealer_id"
                    :class="[
                      {
                        'is-active':
                          item.name.toUpperCase() === descriptions.title
                      }
                    ]"
                    @click="chooseDealer(item)"
                    >Выбрать дилера</el-radio-button
                  >
                </el-col>
              </el-row>
              <el-pagination
                small
                background
                :currentPage="currentPage"
                layout="prev, pager, next"
                :page-count="lastPage"
                :pager-count="5"
                :total="total"
                class="dealer-pagination"
                hide-on-single-page
                @current-change="handleCurrentChange"
              />
            </el-radio-group>
            <el-text
              tag="p"
              class="elis-text dealer-plug"
              v-show="showPlug == true"
              >Не найдено. Измените поисковый запрос и повторите
              попытку</el-text
            >
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
import {
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElTabs,
  ElTabPane,
  ElLink,
  ElText,
  ElImage,
  ElScrollbar,
  ElRadioGroup,
  ElRadioButton,
  ElRadio,
  ElPagination,
  ElCascader
} from 'element-plus'
import { Request } from '../api/http'
export default {
  name: 'StepDealerForm',
  components: {
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElTabs,
    ElTabPane,
    ElLink,
    ElText,
    ElImage,
    ElScrollbar,
    ElRadioGroup,
    ElRadioButton,
    ElRadio,
    ElPagination,
    ElCascader
  },
  props: ['parentDescriptionsDealer'],
  emits: ['nextStep', 'callbackDealer', 'scrollContainerTop'],
  mounted() {
    if (this.parentDescriptionsDealer.title !== '') {
      this.descriptions.title = this.parentDescriptionsDealer.title
    }
    this.getCityList()
  },
  created() {
    this.getDealerList()
    // ymaps.ready(this.initMap)
  },
  data() {
    return {
      loadingDealer: false,
      loadingCity: false,
      activeChooseDealer: 'list',
      searchValue: '',
      searchCity: '',
      currentCitySearch: '',
      seacrhRes: [],
      dealerList: [],
      citiesList: [],
      activeDealerIndex: null,
      allCities: [],
      options: [],
      propsCascader: {
        expandTrigger: 'hover'
      },

      // Форма для выбора дилера

      dealerForm: {
        dealerId: null
      },

      showPlug: false,
      page: 1,
      currentPage: 1,
      lastPage: 7,
      total: 0,
      listQuery: {
        page: 1,
        limit: 25
      },
      descriptions: {
        dealerId: null,
        title: '',
        dealerPhone: '',
        address: '',
        link: ''
      }
    }
  },

  methods: {
    async getDealerList() {
      this.loadingDealer = true
      const params = {
        isBlocked: false,
        page: this.listQuery.page,
        filter: this.searchValue
      }
      const res = await Request({
        url: '/dealer/',
        method: 'get',
        params
      })
      if (res.data.data.length !== 0) {
        this.showPlug = false
        this.dealerList = res.data.data
        this.total = res.data.total
        this.listQuery.page = res.data.current_page
        this.listQuery.limit = res.data.per_page
        this.lastPage = res.data.last_page
      } else {
        this.showPlug = true
        this.options = this.allCities
        console.log('error submit!')
      }

      // this.seacrhRes = this.dealerList
      // title: item.name
      // address: item.address
      // website: item.website
      // phone: item.phone
      // city: item.city_name
      // // Широта
      // lat: item.lat
      // // Долгота
      // lng: item.lng
      this.loadingDealer = false
    },
    async getCityList() {
      this.loadingCity = true
      this.currentCitySearch = ''
      const params = {
        toHierarchy: true,
        name: '',
        limit: 10000
      }
      const res = await Request({
        url: '/city/',
        method: 'get',
        params
      })

      // преобразуем данные с сервера в формат для el-cascader
      let regions = []
      regions = Object.values(res.data.data).map((region) => {
        const { crmRegion_id, ...r } = region
        return r
      })
      this.allCities = regions.map((item) => {
        return {
          value: item.region_name,
          label: item.region_name,
          children: item.cities
            ? item.cities.map((child) => ({
                value: child.city_name,
                label: child.city_name
              }))
            : undefined
        }
      })
      this.options = this.allCities
      this.loadingCity = false
    },
    filterOptions(node, keyword) {
      console.log('🚀 ~ filterOptions ~ keyword:', keyword)
      if (keyword == '') {
        console.log('🚀 ~ filterOptions ~ 123:', 123)
      }
      if (keyword) {
        this.searchCity = keyword
        return node.text.toLowerCase().includes(keyword.toLowerCase())
      }
    },
    handleCityChange() {
      if (this.$refs['refCity'].getCheckedNodes().length !== 0) {
        this.searchCity = this.$refs['refCity'].getCheckedNodes()[0].label
      } else {
        this.handleCityClear()
      }
      this.searchValue = this.searchCity
      console.log('🚀 ~ handleCityChange ~ this.searchCity:', this.searchCity)
      this.searchCityList()
    },
    async searchCityList() {
      if (this.currentCitySearch !== this.searchCity) {
        this.loadingCity = true

        const params = {
          toHierarchy: true,
          name: this.searchCity,
          limit: 10000
        }
        const res = await Request({
          url: '/city/',
          method: 'get',
          params
        })

        // преобразуем данные с сервера в формат для el-cascader
        let regions = []
        regions = Object.values(res.data.data).map((region) => {
          const { crmRegion_id, ...r } = region
          return r
        })
        this.options = regions.map((item) => {
          return {
            value: item.region_name,
            label: item.region_name,
            children: item.cities
              ? item.cities.map((child) => ({
                  value: child.city_name,
                  label: child.city_name
                }))
              : undefined
          }
        })
        if (this.searchValue) {
          this.currentCitySearch = this.searchCity
          this.getDealerList()
          this.options = this.allCities
        }

        this.loadingCity = false
      }
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.currentPage = val
      this.getDealerList()
      // Функция скролла контейнера вверх при нажатии на кнопку пагинации.
      this.$emit('scrollContainerTop')
    },
    chooseDealer(dealerInfo) {
      this.descriptions.dealerId = null
      this.descriptions.title = ''
      this.descriptions.dealerPhone = ''
      this.descriptions.address = ''
      this.descriptions.link = ''
      this.dealerForm.dealerId = dealerInfo.dealer_id
      this.descriptions.dealerId = this.dealerForm.dealerId
      this.descriptions.title = dealerInfo.name.toUpperCase()
      this.descriptions.dealerPhone = dealerInfo.phone
      this.descriptions.address = dealerInfo.address
      if (dealerInfo.website !== null) {
        if (dealerInfo.website !== '') {
          if (dealerInfo.website !== undefined) {
            if (
              dealerInfo.website.includes('https://') ||
              dealerInfo.website.includes('http://') ||
              dealerInfo.website.includes('https://') ||
              dealerInfo.website.includes('http://')
            ) {
              this.descriptions.link = dealerInfo.website
            } else {
              this.descriptions.link = 'http://' + dealerInfo.website
            }
          }
        }
      }
      this.$emit('nextStep')
      return
    },
    handleCityClear() {
      this.searchCity = ''
      this.searchValue = ''
      this.getDealerList()
      this.getCityList()
    }
  }
}
</script>
