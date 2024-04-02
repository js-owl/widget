<template>
  <el-form
    ref="refAuto"
    :model="autoForm"
    :rules="rulesAuto"
    v-loading="loading"
    class="step-auto-form-container"
  >
    <el-tabs
      v-model="activeName"
      type="card"
      class="elis-tabs step-auto"
      @tab-click="clearValid()"
      v-if="dialogVisibleVinInfo !== true"
    >
      <!-- Вкладка "Введите VIN" -->
      <el-tab-pane label="Введите VIN" name="vin">
        <el-form-item prop="vin" class="step-form-item step-auto__item">
          <el-input
            v-model="autoForm.vin"
            type="text"
            clearable
            class="elis-input step-auto__input"
            minlength="17"
            maxlength="17"
            v-maska
            data-maska="*****************"
            data-maska-eager
            @keydown.enter="searchVin(autoForm.vin)"
          >
            <template #append>
              <!-- TODO блокировка кнопки при невалидном значении searchVin() -->
              <el-button
                @click="searchVin(autoForm.vin)"
                type="primary"
                class="elis-widget-btn step-auto__input-arrow-next"
              >
                <el-icon>
                  <Right />
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <!-- Подсказка "Где можно посмотреть VIN номер?" -->
        <el-tooltip
          :visible="tooltipVisible"
          content="bottom left"
          placement="bottom-start"
          effect="customized"
          popper-class="step-auto__vin-tooltip"
        >
          <template #content>
            <el-text tag="p" class="elis-text elis-text-black">
              <span style="font-weight: 400"
                >VIN код (Vehicle Identification Number)
              </span>
              — это уникальный код транспортного средства. Он состоит из 17 цифр
              и букв, каждая из которых содержит информацию об автомобиле. VIN
              наносят на кузов автомобиля, а также указывают в паспорте
              транспортного средства и свидетельстве о регистрации транспортного
              средства (СТС).
            </el-text>
            <el-text
              tag="p"
              style="margin-top: 5px"
              class="elis-text elis-text-black"
            >
              Также VIN можно посмотреть в самом автомобиле — под ветровым
              стеклом, слева на приборной панели или на водительской двери.
            </el-text>
          </template>
          <el-button
            @click="tooltipVisible = !tooltipVisible"
            class="elis-widget-btn step-auto__vin-tooltip-btn-info"
            type="info"
          >
            Где можно посмотреть VIN номер?
          </el-button>
        </el-tooltip>
      </el-tab-pane>

      <!-- Вкладка-заглушка -->
      <el-tab-pane label="или" :disabled="true"></el-tab-pane>

      <!-- Вкладка "Регистрационный номер" -->
      <el-tab-pane label="Регистрационный номер" name="gosnum">
        <el-form-item prop="gosnum" class="step-form-item step-auto__item">
          <el-input
            v-model="autoForm.gosnum"
            type="text"
            class="elis-input step-auto__input"
            placeholder="Например, А001АА 73"
            clearable
            minlength="9"
            maxlength="10"
            v-maska
            data-maska="R###RR ###"
            data-maska-tokens="R:[авекмнорстху]"
            data-maska-eager
            @keydown.enter="searchVin(autoForm.vin)"
          >
            <template #append>
              <!-- TODO блокировка кнопки при невалидном значении nextClick() -->
              <el-button
                class="elis-widget-btn step-auto__input-arrow-next"
                type="primary"
                @click="addGosNumber(autoForm.gosnum)"
              >
                <el-icon>
                  <Right />
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>

    <!-- Блок "Это Ваш автомобиль?". Появляется, если информация об
                автомобиле найдена по VIN-номеру -->
    <el-card class="vin-info" v-if="dialogVisibleVinInfo == true">
      <template #header>
        <div class="vin-info__header">
          <el-text
            tag="h3"
            class="elis-text elis-widget-step-title vin-info__step-title"
          >
            Это Ваш автомобиль?
          </el-text>
        </div>
      </template>
      <el-row>
        <el-col :span="10">
          <el-text tag="h3" class="elis-text vin-info__title">
            {{ vinInfo.model }}
          </el-text>
          <el-text
            tag="p"
            class="elis-text vin-info__description"
            v-if="descriptions.prodDate !== ''"
            >{{ descriptions.modification }} /
            {{ descriptions.prodDate }}
          </el-text>
          <el-text
            tag="p"
            class="elis-text vin-info__description"
            v-if="descriptions.prodDate === ''"
            >{{ descriptions.modification }}
          </el-text>
        </el-col>
        <el-col :span="14">
          <el-image :src="vinInfo.img" fit="contain" loading="eager"
            ><template #placeholder>
              <div class="image-loader el-loading-spinner">
                <svg class="circular" viewBox="0 0 50 50">
                  <circle
                    class="path"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                  ></circle>
                </svg>
              </div> </template
          ></el-image>
        </el-col>
      </el-row>
      <template #footer>
        <span class="vin-info__footer">
          <el-button
            size="default"
            @click="resetVinInfo()"
            class="elis-widget-btn"
          >
            Нет, попробовать снова
          </el-button>
          <el-button
            size="default"
            type="primary"
            class="elis-widget-btn"
            @click="confirmVin()"
          >
            Да
          </el-button>
        </span>
      </template>
    </el-card>
  </el-form>
</template>

<script>
import {
  ElConfigProvider,
  ElRow,
  ElCol,
  ElButton,
  ElCard,
  ElProgress,
  ElForm,
  ElFormItem,
  ElInput,
  ElTabs,
  ElTabPane,
  ElSteps,
  ElStep,
  ElIcon,
  ElDialog,
  ElLink,
  ElText,
  ElCheckbox,
  ElCheckboxGroup,
  ElCheckboxButton,
  ElDatePicker,
  ElTimeSelect,
  ElResult,
  ElImage,
  ElTimeline,
  ElTimelineItem,
  ElDescriptions,
  ElDescriptionsItem,
  ElTooltip,
  ElLoading,
  ElScrollbar,
  ElRadioGroup,
  ElRadioButton,
  ElRadio,
  ElPagination
} from 'element-plus'
import { Request } from '../api/http'
import {
  Close,
  Right,
  Setting,
  User,
  Search,
  ArrowLeftBold,
  ArrowRightBold
} from '@element-plus/icons-vue'
import Car from '../assets/img/car.svg'
import Cargo from '../assets/img/cargo.png'
import Classic from '../assets/img/classic.png'
import Hunter from '../assets/img/hunter.png'
import Patriot from '../assets/img/patriot.png'
import Pickup from '../assets/img/pickup.png'
import Profi from '../assets/img/profi.png'
import Profi_1_5 from '../assets/img/profi1.5.png'

import {
  validateVinNumber,
  validateGosNum
  //   validateEmail
  // validateDate
} from '../utils/validate'

export default {
  name: 'StepAutoForm',
  components: {
    ElRow,
    ElCol,
    ElButton,
    ElCard,
    ElForm,
    ElFormItem,
    ElInput,
    ElTabs,
    ElTabPane,
    ElIcon,
    ElText,
    Right,
    ElImage,
    ElTooltip
  },
  emits: ['nextStep', 'resetDateAllForm'],
  data() {
    var checkValidVIN = (rule, value, callback) => {
      if (this.autoForm.vin === '') {
        return callback(new Error('VIN-номер автомобиля не заполнен'))
      } else if (!validateVinNumber(value)) {
        callback(
          new Error(
            'VIN-номер может содержать только буквы латинского алфавита и цифры'
          )
        )
      } else {
        callback()
      }
    }
    var checkValidGosNumber = (rule, value, callback) => {
      if (this.autoForm.gosnum === '') {
        return callback(
          new Error('Регистрационный номер автомобиля не заполнен')
        )
      } else if (!validateGosNum(value)) {
        callback(
          new Error(
            'Регистрационный номер может содержать только буквы и цифры'
          )
        )
      } else {
        callback()
      }
    }
    return {
      activeStepAutoInfo: 0,
      percentageAutoInfo: 0,
      tooltipVisible: false,
      activeName: 'vin',
      currentVin: '',
      currentGosnum: '',
      loading: false,
      dialogVisibleVinInfo: false,
      // Форма данных об автомобиле
      autoForm: {
        vin: '',
        gosnum: ''
      },
      rulesAuto: {
        vin: [
          {
            validator: checkValidVIN,
            trigger: ['blur', 'change']
          },
          {
            min: 17,
            max: 17,
            message:
              'VIN должен содержать 17 символов, состоящих из букв латинского алфавита и цифр',
            trigger: ['blur', 'change', 'focus']
          }
        ],
        gosnum: [
          {
            validator: checkValidGosNumber,
            trigger: ['blur', 'change']
          },
          {
            min: 9,
            max: 10,
            message:
              'Регистрационный номер должен содержать от 8 до 9 символов',
            trigger: ['blur', 'change', 'focus']
          }
        ]
      },
      // Данные об автомобиле из результатов поиска по vin для блока "Это Ваш автомобиль?"
      vinInfo: {},
      // Данные для отображения пройденных шагов на панели справа
      descriptions: {
        img: '',
        vin: '',
        model: '',
        modification: '',
        prodDate: '',
        gosnum: ''
      }
    }
  },
  methods: {
    checkEnterKey(e) {
      e.preventDefault()
    },
    clearValid() {
      this.tooltipVisible = false
      return this.$nextTick(() => {
        this.$refs['refAuto'].clearValidate()
      })
    },
    async searchVin(vin) {
      this.tooltipVisible = false
      this.$refs['refAuto']
        .validateField(['vin'])
        .then(async (res) => {
          if (res) {
            this.loading = true
            if (this.currentVin !== vin) {
              this.resetData()
              this.$emit('resetDateAllForm')
            }
            this.activeName = 'vin'
            this.autoForm.gosnum = ''
            const res = await Request.get('/productmodification/searchvin', {
              params: {
                filter: vin,
                section: 'parts',
                page: 1
              }
            })
            // if (
            //   res.data.vin_info.length !== 0 ||
            //   res.data.vin_info.length !== undefined
            // ) {

            // }

            if (res.data.vin_info.length === 0) {
              this.descriptions.vin = vin.toUpperCase()
              this.descriptions.model = ''
              this.descriptions.modification = ''
              this.descriptions.prodDate = ''

              this.vinInfo.img = this.modelImage()
              this.descriptions.img = this.vinInfo.img
              this.percentageAutoInfo = 50
              this.activeStepAutoInfo = 1

              this.dialogVisibleVinInfo = false
              this.currentVin = vin
              this.loading = false
              this.$emit('nextStep')
            } else {
              this.vinInfo = res.data.vin_info

              this.vinInfo.model = res.data.vin_info.make_code
              this.descriptions.model = this.vinInfo.model

              this.vinInfo.img = this.modelImage(this.vinInfo.model)

              if (res.data.vin_info.productModification_description !== null) {
                this.vinInfo.modification =
                  res.data.vin_info.productModification_description
              }
              if (res.data.vin_info.productModification_description === null) {
                this.vinInfo.modification = res.data.vin_info.type
              }
              if (res.data.vin_info.productModification_modelYear) {
                this.vinInfo.prodDate =
                  res.data.vin_info.productModification_modelYear
                this.descriptions.prodDate = this.vinInfo.prodDate
              } else {
                this.vinInfo.prodDate = ''
                this.descriptions.prodDate = ''
              }
              this.descriptions.vin = ''
              this.descriptions.img = this.vinInfo.img

              this.descriptions.modification = this.vinInfo.modification

              this.dialogVisibleVinInfo = true
              this.percentageAutoInfo = 25
              this.activeStepAutoInfo = 0
              // this.$emit('nextStep')
            }
            this.currentVin = vin
            this.loading = false
            this.$emit('nextStep')
          } else {
            console.log('error submit!')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    modelImage(model) {
      switch (model) {
        case 'PATRIOT':
          return Patriot
        case 'HUNTER':
          return Hunter
        case 'PROFI':
          return Profi
        case 'PICKUP':
          return Pickup
        case 'PROFI_1.5':
          return Profi_1_5
        case 'CARGO':
          return Cargo
        case 'СГР':
          return Classic
        default:
          return Car
      }
    },
    confirmVin() {
      this.percentageAutoInfo = 50
      this.activeStepAutoInfo = 1
      this.$emit('nextStep')
      this.dialogVisibleVinInfo = false
    },
    resetVinInfo() {
      this.percentageAutoInfo = 0
      this.activeStepAutoInfo = 0
      this.resetData()
      this.dialogVisibleVinInfo = false
      this.$emit('nextStep')
    },
    resetData() {
      this.vinInfo = {
        number: '',
        img: '',
        model: '',
        modification: '',
        prodDate: ''
      }
      this.descriptions = {
        img: '',
        vin: '',
        modification: '',
        prodDate: '',
        gosnum: '',
        service: '',
        comment: '',
        visit: []
      }
    },
    addGosNumber(gosnum) {
      this.$refs['refAuto']
        .validateField(['gosnum'])
        .then((res) => {
          if (res) {
            this.descriptions.vin = ''
            this.autoForm.vin = ''
            if (this.currentGosnum !== gosnum) {
              this.resetData()
              this.$emit('resetDateAllForm')
            }
            this.descriptions.gosnum = this.autoForm.gosnum.toUpperCase()
            this.descriptions.img = this.modelImage()
            this.activeName = 'gosnum'
            this.currentGosnum = gosnum
            this.percentageAutoInfo = 50
            this.activeStepAutoInfo = 1
            this.$emit('nextStep')
          } else {
            console.log('error submit!')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
