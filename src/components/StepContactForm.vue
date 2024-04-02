<template>
  <el-col :span="13">
    <el-text
      class="elis-text elis-widget-step-title"
      tag="h3"
      style="text-align: left"
    >
      Контактные данные
    </el-text>

    <el-form
      ref="refСontact"
      :model="contactForm"
      :rules="rulesContact"
      class="step-contact"
    >
      <el-form-item prop="surname" class="step-form-item step-contact__item">
        <el-text tag="label" class="elis-text step-contact__label"
          >Фамилия*</el-text
        >
        <el-input
          v-model="contactForm.surname"
          class="elis-input step-contact__input"
          type="text"
          clearable
          placeholder="Фамилия*"
          @input="$emit('callbackVisit')"
        />
      </el-form-item>
      <el-form-item prop="name" class="step-form-item step-contact__item">
        <el-text tag="label" class="elis-text step-contact__label"
          >Имя*</el-text
        >
        <el-input
          v-model="contactForm.name"
          class="elis-input step-contact__input"
          type="text"
          clearable
          placeholder="Имя*"
          @input="$emit('callbackVisit')"
        />
      </el-form-item>
      <el-form-item prop="patronymic" class="step-form-item step-contact__item">
        <el-text tag="label" class="elis-text step-contact__label"
          >Отчество</el-text
        >
        <el-input
          v-model="contactForm.patronymic"
          class="elis-input step-contact__input"
          type="text"
          clearable
          placeholder="Отчество"
          @input="$emit('callbackVisit')"
        />
      </el-form-item>
      <el-form-item
        prop="phoneNumber"
        class="step-form-item step-contact__item"
      >
        <el-text tag="label" class="elis-text step-contact__label"
          >Телефон*</el-text
        >
        <el-input
          v-model="contactForm.phoneNumber"
          class="elis-input step-contact__input"
          placeholder="Телефон*"
          minlength="5"
          maxlength="15"
          clearable
          @input="$emit('callbackVisit')"
        />
      </el-form-item>
      <el-form-item prop="email" class="step-form-item step-contact__item">
        <el-text tag="label" class="elis-text step-contact__label">
          Электронная почта*
        </el-text>
        <el-input
          v-model="contactForm.email"
          class="elis-input step-contact__input"
          placeholder="Электронная почта*"
          clearable
          @input="$emit('callbackVisit')"
        />
      </el-form-item>

      <el-text class="elis-text elis-widget-step-title" tag="h3">
        Желаемая дата визита
      </el-text>

      <el-form-item prop="date" class="step-form-item step-contact__date">
        <el-date-picker
          v-model="contactForm.date"
          type="date"
          placeholder="Дата*"
          format="DD.MM.YYYY"
          value-format="YYYY-MM-DD"
          :first-day-of-week="1"
          :disabled-date="disabledDate"
          clearable
          @change="watchDate()"
          popper-class="step-contact__calendar"
        />
        <div v-if="showPlugForTime" class="el-form-item__error">
          Выберите другую дату
        </div>
      </el-form-item>
      <el-form-item
        v-if="contactForm.date && !showPlugForTime"
        prop="time"
        v-loading="loadingSlots"
        class="step-form-item"
      >
        <el-col :span="24" v-if="!loadingSlots">
          <el-text
            tag="h3"
            class="elis-text elis-widget-step-title elis-title-time"
          >
            Укажите удобное время
          </el-text>
          <!-- @tab-click="handleTabClick" -->
          <!-- 3 tabs -->
          <el-tabs
            v-if="scheduleLen > scheduleLimit[1]"
            v-model="tabSelected"
            prop="flowchart_type"
            class="elis-tabs tabs-time"
            :tab-position="tabTimePosition"
          >
            <el-tab-pane
              v-for="item in [
                {
                  id: 1,
                  name: `${tabHeaders[0]}-${tabHeaders[1]}`
                },
                {
                  id: 2,
                  name: `${tabHeaders[1]}-${tabHeaders[2]}`
                },
                {
                  id: 3,
                  name: `${tabHeaders[2]}-${tabHeaders[3]}`
                }
              ]"
              :key="item.id"
              :label="item.name"
              :name="item.id"
              :disabled="item.id < disabledTab"
            />
            <el-radio-group v-model="contactForm.time">
              <div v-if="tabSelected == 1" class="tab-slots">
                <el-radio-button
                  v-for="t in slotTime1"
                  :key="t.name"
                  :label="t"
                  :disabled="disableSlot(t)"
                  class="slot"
                  :checked="t == contactForm.time ? true : false"
                  @change="watchTime(t)"
                >
                  {{ t }}
                </el-radio-button>
              </div>
              <div v-if="tabSelected == 2" class="tab-slots">
                <el-radio-button
                  v-for="t in slotTime2"
                  :key="t.name"
                  :label="t"
                  :disabled="disableSlot(t)"
                  class="slot"
                  :checked="t == contactForm.time ? true : false"
                  @change="watchTime(t)"
                >
                  {{ t }}
                </el-radio-button>
              </div>
              <div v-if="tabSelected == 3" class="tab-slots">
                <el-radio-button
                  v-for="t in slotTime3"
                  :key="t.name"
                  :label="t"
                  :disabled="disableSlot(t)"
                  class="slot"
                  :checked="t == contactForm.time ? true : false"
                  @change="watchTime(t)"
                >
                  {{ t }}
                </el-radio-button>
              </div>
            </el-radio-group>
          </el-tabs>
          <!-- 2 tabs -->
          <el-tabs
            v-if="
              scheduleLen > scheduleLimit[0] && scheduleLen < scheduleLimit[1]
            "
            v-model="tabSelected"
            prop="flowchart_type"
            class="elis-tabs tabs-time"
            :tab-position="tabTimePosition"
          >
            <el-tab-pane
              v-for="item in [
                {
                  id: 1,
                  name: `${tabHeaders[0]}-${tabHeaders[1]}`
                },
                {
                  id: 2,
                  name: `${tabHeaders[1]}-${tabHeaders[3]}`
                }
              ]"
              :key="item.id"
              :label="item.name"
              :name="item.id"
            />
            <el-radio-group v-model="contactForm.time">
              <div v-if="tabSelected == 1" class="tab-slots">
                <el-radio-button
                  v-for="t in slotTime1"
                  :key="t.name"
                  :label="t"
                  :disabled="disableSlot(t)"
                  class="slot"
                  :checked="t == contactForm.time ? true : false"
                  @change="watchTime(t)"
                >
                  {{ t }}
                </el-radio-button>
              </div>
              <div v-if="tabSelected == 2" class="tab-slots">
                <el-radio-button
                  v-for="t in slotTime2"
                  :key="t.name"
                  :label="t"
                  :disabled="disableSlot(t)"
                  class="slot"
                  :checked="t == contactForm.time ? true : false"
                  @change="watchTime(t)"
                >
                  {{ t }}
                </el-radio-button>
              </div>
            </el-radio-group>
          </el-tabs>
          <!-- 1 tab -->
          <el-tabs
            v-if="scheduleLen < scheduleLimit[0]"
            v-model="tabSelected"
            prop="flowchart_type"
            class="elis-tabs tabs-time"
            :tab-position="tabTimePosition"
          >
            <el-tab-pane
              v-for="item in [
                {
                  id: 1,
                  name: `${tabHeaders[0]}-${tabHeaders[3]}`
                }
              ]"
              :key="item.id"
              :label="item.name"
              :name="item.id"
            />
            <el-radio-group v-model="contactForm.time">
              <div v-if="tabSelected == 1" class="tab-slots">
                <el-radio-button
                  v-for="t in slotTime1"
                  :key="t.name"
                  :label="t"
                  :disabled="disableSlot(t)"
                  class="slot"
                  :checked="t == contactForm.time ? true : false"
                  @change="watchTime(t)"
                >
                  {{ t }}
                </el-radio-button>
              </div>
            </el-radio-group>
          </el-tabs>
        </el-col>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
import {
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElTabs,
  ElTabPane,
  ElText,
  ElDatePicker,
  ElRadioGroup,
  ElRadioButton,
  ElRadio
} from 'element-plus'
import { Request, Request2 } from '../api/http'
import { validateEmail } from '../utils/validate'

export default {
  name: 'StepContactForm',
  components: {
    ElCol,
    ElForm,
    ElFormItem,
    ElTabs,
    ElTabPane,
    ElText,
    ElDatePicker,
    ElRadioGroup,
    ElRadioButton,
    ElRadio
  },
  props: ['parentDescriptionsContact'],
  emits: ['nextStep', 'callbackVisit'],
  async mounted() {
    let params = new URL(document.location).searchParams
    let id = params.get('id')
    this.id = Number(id) || 24
    console.log('mounted id:', this.id, ' dealerStep:', this.dealerStep)
    this.contactForm = this.parentDescriptionsContact
    if (this.contactForm.date !== null) {
      this.descriptions.visit.push(this.contactForm.date)
      this.getSchedule()

      if (this.contactForm.time !== '') {
        this.descriptions.visit.push(this.contactForm.time)
      }
    }
    this.dealerTimezone = await this.getTimezone()
  },

  data() {
    var checkValidEmail = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('Обязательное поле'))
      } else if (!validateEmail(value)) {
        return callback(new Error('Неверный формат электронной почты'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      loadingSlots: false,
      showPlugForTime: false,
      // Форма контактных данных и данных о записи на сервис
      tabTimePosition: 'top',
      contactForm: {
        surname: '',
        name: '',
        patronymic: '',
        phoneNumber: '',
        email: '',
        date: '',
        time: '',
        bookingId: null,
        dealerTimezone: 0
      },
      rulesContact: {
        surname: [
          {
            required: true,
            message: 'Обязательное поле',
            trigger: ['blur', 'change', 'focus']
          }
        ],
        name: [
          {
            required: true,
            message: 'Обязательное поле',
            trigger: ['blur', 'change', 'focus']
          }
        ],
        phoneNumber: [
          {
            min: 5,
            max: 15,
            message: 'Номер телефона может содержать не менее 5 цифр',
            trigger: ['blur', 'change', 'focus']
          },
          {
            required: true,
            message: 'Обязательное поле',
            trigger: ['blur', 'change', 'focus']
          }
        ],
        email: [
          {
            validator: checkValidEmail,
            trigger: ['blur', 'change', 'focus']
          }
        ],
        date: [
          {
            required: true,
            message: 'Обязательное поле',
            trigger: 'change'
          }
        ],
        time: [
          {
            required: true,
            message: 'Обязательное поле',
            trigger: 'change'
          }
        ]
      },

      // Данные для отображения пройденных шагов на панели справа
      descriptions: {
        visit: []
      },

      showSlotTime: false,
      tabSelected: '1',
      dealerSchedule: [],
      disabledTab: '1',
      calendarDay: '',
      slotTime: [],
      slotTime1: [],
      slotTime2: [],
      slotTime3: [],
      rangeTabs: [],
      tabHeaders: [],
      scheduleLen: '',
      scheduleLimit: [20, 40] // границы для появления новой вкладки
    }
  },
  methods: {
    async getSchedule() {
      this.showSlotTime = false
      this.showPlugForTime = false
      this.dealerSchedule = []
      if (this.contactForm.date !== this.descriptions.visit[0]) {
        this.contactForm.time = ''
      }
      this.slotTime = []
      this.slotTime1 = []
      this.slotTime2 = []
      this.slotTime3 = []
      this.rangeTabs = []
      this.tabHeaders = []
      this.scheduleLen = ''

      if (this.contactForm.date) {
        this.loadingSlots = true

        const params = {
          dealer_id: this.id,
          date: this.contactForm.date,
          isGrouping: true
        }
        const res = await Request({
          url: '/booking/', // + this.dealerID,
          method: 'get',
          params
        })
        if (res) {
          this.dealerSchedule = res.data
          this.fillTabs()
          if (this.contactForm.time !== '') {
            this.tabSelected = this.getActiveTabOfTime(this.contactForm.time)
          } else {
            this.tabSelected = this.getActiveTab()
          }
          console.log('🚀 ~ getSchedule ~ this.tabSelected:', this.tabSelected)

          this.disabledTab = this.getDisableTab()
          this.showSlotTime = true
        } else {
          this.loadingSlots = false
          this.showPlugForTime = true
        }
      }
    },
    fillTabs() {
      // this.slotTime = ['08:00', '08:15', ..]
      this.slotTime = [
        ...new Set(this.dealerSchedule.map((item) => item.slotStart))
      ]
      this.scheduleLen = this.slotTime.length
      console.log('🚀 ~ fillTabs ~ this.scheduleLen:', this.scheduleLen)
      // const.slotTimeN = [8, 8.25, ..]
      const slotTimeN = [
        ...new Set(this.dealerSchedule.map((item) => item.slotStartN))
      ]
      const firstEl = +this.dealerSchedule[0].slotStartN
      const lastEl =
        +this.dealerSchedule[this.dealerSchedule.length - 1].slotStartN

      let secondEl
      let secondElString
      if (this.scheduleLen < this.scheduleLimit[1]) {
        secondEl = (lastEl - firstEl) / 2 + firstEl
        secondElString = this.transformTime(secondEl)
      } else {
        secondEl = (lastEl - firstEl) / 3 + firstEl
        secondElString = this.transformTime(secondEl)
      }

      const thirdEl = (lastEl - firstEl) / 3 + secondEl
      const thirdElString = this.transformTime(thirdEl)
      this.rangeTabs.push(firstEl)
      this.rangeTabs.push(secondEl)
      this.rangeTabs.push(thirdEl)
      this.rangeTabs.push(lastEl)

      this.tabHeaders.push(this.slotTime[0])
      this.tabHeaders.push(secondElString)
      this.tabHeaders.push(thirdElString)
      this.tabHeaders.push(this.slotTime[this.slotTime.length - 1])

      if (this.scheduleLen < this.scheduleLimit[0]) {
        // 1 tab
        slotTimeN.forEach((el, idx) => {
          if (el >= this.rangeTabs[0] && el < this.rangeTabs[3])
            this.slotTime1.push(this.slotTime[idx])
        })
      } else {
        // 3 tabs
        slotTimeN.forEach((el, idx) => {
          if (el >= this.rangeTabs[0] && el < this.rangeTabs[1])
            this.slotTime1.push(this.slotTime[idx])
        })
      }

      if (this.scheduleLen < this.scheduleLimit[1]) {
        // 2 tabs
        slotTimeN.forEach((el, idx) => {
          if (el >= this.rangeTabs[1] && el < this.rangeTabs[3])
            this.slotTime2.push(this.slotTime[idx])
        })
      } else {
        // 3 tabs
        slotTimeN.forEach((el, idx) => {
          if (el >= this.rangeTabs[1] && el < this.rangeTabs[2])
            this.slotTime2.push(this.slotTime[idx])
        })
      }
      // 3 tabs
      slotTimeN.forEach((el, idx) => {
        if (el >= this.rangeTabs[2] && el < this.rangeTabs[3])
          this.slotTime3.push(this.slotTime[idx])
      })

      this.loadingSlots = false
    },
    disabledDate(date) {
      let arrPastDate = date.getTime() < Date.now() - 3600 * 1000 * 24
      let arrFutureDate = date.getTime() > Date.now() + 3600 * 1000 * 24 * 13
      let arrDisabledDate = arrPastDate + arrFutureDate
      return arrDisabledDate
    },
    watchDate() {
      this.getSchedule()
      this.descriptions.visit = []
      let formattedDate = this.formatDate()
      if (this.contactForm.date !== null)
        this.descriptions.visit.push(formattedDate)
      this.$emit('callbackVisit')
    },
    formatDate() {
      if (this.contactForm.date !== null) {
        let [year, month, day] = this.contactForm.date.split('-').map(Number)
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        this.calendarDay = day
        return day + '.' + month + '.' + year
      }
    },
    watchTime(t) {
      if (this.descriptions.visit[1]) this.descriptions.visit.pop()
      if (t !== null) this.descriptions.visit.push(t)
      this.contactForm.bookingId = this.getBookingIdForTime(t)

      this.$emit('callbackVisit')
    },
    // Получаем booking_id выбранного времени
    getBookingIdForTime(time) {
      return Number(
        this.dealerSchedule
          .filter((item) => item.slotStart === time)
          .map((item) => item.booking_id)
      )
    },
    // Блокируем слот  времени, если у него нет booking_id
    disableSlot(time) {
      let now = new Date()
      let [hours, minutes] = time.split(':').map(Number)
      let [year, month, date] = this.contactForm.date.split('-').map(Number)
      let slotTime = new Date(year, month - 1, date, hours, minutes)
      // Учет часового пояса
      const tzOffsetHour =
        Number(this.dealerTimezone) + new Date().getTimezoneOffset() / 60
      now.setHours(now.getHours() + tzOffsetHour)

      if (slotTime < now) {
        return true
      } else if (this.getBookingIdForTime(time) === 0) {
        return true
      } else {
        return false
      }
    },
    async getTimezone() {
      const params = {}
      const res = await Request2({
        url: '/dealer/' + this.id,
        method: 'get',
        params
      })
      return res.data.timezone
    },
    // 8.25 => '8.15'
    transformTime(time) {
      const hour = String(time).split('.')[0]
      let min = Math.floor((time % 1) * Math.pow(10, 2))
      min == 0 ? (min = '00') : (min = Math.ceil(min * 0.6))
      return hour + '.' + min
    },
    // Получаем активный таб в зависимости от текущей даты, когда время не выбрано
    getActiveTab() {
      let now = new Date()

      if (now.getDate() === this.calendarDay) {
        const time = now.getHours() + now.getMinutes() / 60

        if (this.scheduleLen > this.scheduleLimit[1]) {
          if (time < this.rangeTabs[1]) return 1
          else if (time < this.rangeTabs[2]) return 2
          else return 3
        } else if (
          this.scheduleLen > this.scheduleLimit[0] &&
          this.scheduleLen < this.scheduleLimit[1]
        ) {
          if (time < this.rangeTabs[2]) return 1
          else return 2
        } else return 1
      } else return 1
    },

    // Определяем активный таб по выбранному ранее времени
    // (для ситуаций с переходом назад и возвращением на последний шаг)
    getActiveTabOfTime(t) {
      const pattern = /(\d+):(\d+)/
      const [, hours, minutes] = t.match(pattern)
      const time = Number(hours) + Number(minutes) / 60
      // 3 таба
      if (this.scheduleLen > this.scheduleLimit[1]) {
        if (time < this.rangeTabs[1]) return 1
        else if (time < this.rangeTabs[2]) return 2
        else return 3
      } else if (
        this.scheduleLen > this.scheduleLimit[0] &&
        this.scheduleLen < this.scheduleLimit[1]
      ) {
        // 2 таба
        if (time < this.rangeTabs[1]) return 1
        else return 2
      } else {
        return 1
      }
    },

    // Определяем, какие табы блокировать во всех случаях
    getDisableTab() {
      let now = new Date()
      if (this.isCurrentDay()) {
        const time = now.getHours() + now.getMinutes() / 60

        if (time < this.rangeTabs[1]) return 1
        else if (time < this.rangeTabs[2]) return 2
        else return 3
      }
      return 1
    },

    // Проверяем, выбран сегодняшний день или нет
    isCurrentDay() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // месяцы начинаются с 0
      const day = date.getDate()

      const currentDate = `${year}-${month < 10 ? `0${month}` : month}-${day}`

      return currentDate === this.contactForm.date
    }
  }
}
</script>
