<template>
  <!-- <el-button
    type="primary"
    style="position: absolute; top: 50%; left: calc(50% - 120px)"
    @click="elis_widget_booking_drawer = true"
  >
    Онлайн запись на сервис
  </el-button> -->

  <el-drawer
    ref="refDrawer"
    class="elis-widget-booking-drawer"
    v-model="elis_widget_booking_drawer"
    :direction="direction"
    title="Онлайн запись на сервис"
    size="100%"
    :show-close="false"
    :close-on-press-escape="false"
  >
    <!-- Шапка виджета -->
    <template #header>
      <el-col class="elis-widget-header__container">
        <el-button
          @click="closedDrawer(evt)"
          class="elis-widget-btn elis-widget-btn-close"
        >
          <el-icon>
            <Close />
          </el-icon>
        </el-button>

        <el-text tag="h2" class="elis-text elis-widget-header__title"
          >Онлайн запись на сервис</el-text
        >
      </el-col>
    </template>

    <!-- Скролл для тела виджета -->
    <el-scrollbar
      class="elis-widget-scrollbar"
      ref="refScrollContainer"
      v-loading="loading"
    >
      <!-- Тело виджета -->
      <template #default>
        <el-text tag="h3" class="elis-text elis-widget-header__subtitle">
          Доверьте нам безопасность вашего автомобиля
        </el-text>
        <el-text tag="p" class="elis-text elis-widget-header__description">
          Проходите техническое обслуживание только в салонах официальных
          дилеров и получайте безупречный сервис с сохранением гарантийных
          обязательств бренда.
        </el-text>
        <!-- Информация о пройденных шагах и процентах -->
        <el-col class="elis-widget-step-status">
          <el-row>
            <!-- Для дилеров -->
            <el-col v-if="dealerStep == 3" :span="12" style="text-align: left">
              <el-text
                v-if="activeStep !== 3"
                tag="span"
                class="elis-text elis-text-black elis-current-step"
                >Шаг {{ activeStep + 1 }} из {{ dealerStep }}</el-text
              >
              <el-text
                v-if="activeStep === 3"
                tag="span"
                class="elis-text elis-text-black elis-current-step"
                >Шаг 3 из {{ dealerStep }}</el-text
              >
            </el-col>

            <!-- Для УАЗа -->
            <el-col v-if="dealerStep == 4" :span="12" style="text-align: left">
              <el-text
                v-if="activeStep !== 4"
                tag="span"
                class="elis-text elis-text-black elis-current-step"
                >Шаг {{ activeStep + 1 }} из {{ dealerStep }}</el-text
              >
              <el-text
                v-if="activeStep === 4"
                tag="span"
                class="elis-text elis-text-black elis-current-step"
                >Шаг 4 из {{ dealerStep }}</el-text
              >
            </el-col>

            <el-col :span="12" style="text-align: right">
              <el-text
                tag="span"
                class="elis-text elis-text-black elis-current-step"
                >{{ percentage }} %</el-text
              >
            </el-col>
          </el-row>

          <!-- Шкала прогресса = пройденным процентам -->
          <el-progress
            :percentage="percentage"
            :color="percentageColor"
            :show-text="false"
          />
        </el-col>
        <!-- Контейнер шагов -->

        <el-row class="elis-widget-step-container">
          <!-- Шаг 1. Данные об автомобиле -->
          <step-auto-form
            v-show="percentage == 0 || percentage == 25"
            ref="refStepAutoForm"
            @nextStep="nextClick()"
            @resetDateAllForm="resetDate()"
          />

          <!-- Шаг 2. Сервисные работы -->
          <step-service-form
            v-if="percentage == 50"
            ref="refStepServiceForm"
            @callbackService="callbackServiceDescriptions()"
            :parentDescriptionsService="descriptionsService"
          />

          <!-- Шаг 3. Дилерский центр. Только для УАЗа !!!!!! -->
          <step-dealer-form
            v-if="percentage == 75"
            ref="refStepDealerForm"
            @nextStep="nextClick()"
            @callbackDealer="callbackDealerDescriptions()"
            @scrollContainerTop="scrollToTop()"
            :parentDescriptionsDealer="descriptionsDealer"
          />

          <!-- Шаг 4. Контактные данные -->
          <step-contact-form
            v-if="percentage == 90"
            ref="refStepContactForm"
            @nextStep="nextClick()"
            @callbackVisit="callbackVisitDescriptions()"
            :parentDescriptionsContact="descriptionsContact"
          />

          <!-- Запись завершена -->
          <el-col :span="13" v-if="percentage == 100" class="elis-finish-text">
            <el-text
              class="elis-text elis-widget-step-title"
              tag="h3"
              style="text-align: left"
              v-if="activeStep == 3"
            >
              {{ descriptionsContact.name }}, ваша заявка принята!
            </el-text>
            <el-text
              tag="label"
              style="display: block"
              class="elis-text elis-text-black elis-text-success"
              >В ближайшее время с вами свяжется сотрудник дилерского
              центра.</el-text
            ></el-col
          >

          <!-- Информация о пройденных шагах записи -->
          <el-col :span="11" style="margin-top: 25px">
            <el-timeline
              class="steps-info"
              :color="timeLineColor"
              v-if="percentage > 25"
            >
              <el-image
                v-show="activeStep >= 1 && descriptionsAuto.img !== undefined"
                :src="descriptionsAuto.img"
                fit="contain"
                loading="eager"
                style="padding-bottom: 10px"
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
                  </div>
                </template>
              </el-image>
              <el-timeline-item
                v-show="activeStep >= 1"
                :hide-timestamp="true"
                placement="top"
                :color="percentageColor"
                class="steps-info__item"
                :class="[{ 'step-active': percentage > 25 }]"
              >
                <el-descriptions
                  title="Ваш автомобиль"
                  class="step-descriptions"
                >
                  <el-descriptions-item
                    v-if="
                      descriptionsAuto.prodDate !== '' &&
                      descriptionsAuto.gosnum === ''
                    "
                    >{{ descriptionsAuto.model }} /
                    {{ descriptionsAuto.modification }} /
                    {{ descriptionsAuto.prodDate }}
                  </el-descriptions-item>
                  <el-descriptions-item
                    v-if="
                      descriptionsAuto.prodDate === '' &&
                      descriptionsAuto.vin === '' &&
                      descriptionsAuto.gosnum === ''
                    "
                    >{{ descriptionsAuto.model }} /
                    {{ descriptionsAuto.modification }}
                  </el-descriptions-item>
                  <el-descriptions-item v-if="descriptionsAuto.vin">{{
                    descriptionsAuto.vin
                  }}</el-descriptions-item>
                  <el-descriptions-item v-if="descriptionsAuto.gosnum">{{
                    descriptionsAuto.gosnum
                  }}</el-descriptions-item>
                </el-descriptions>
              </el-timeline-item>

              <el-timeline-item
                v-if="percentage > 25"
                :hide-timestamp="true"
                placement="top"
                :color="percentageColor"
                class="steps-info__item"
                :class="[{ 'step-active': percentage > 50 }]"
              >
                <el-descriptions
                  title="Сервисные работы"
                  class="step-descriptions"
                >
                  <el-descriptions-item
                    v-if="descriptionsService.service !== ''"
                  >
                    {{ descriptionsService.service.join(' / ') }}
                  </el-descriptions-item>
                  <el-descriptions-item
                    v-if="descriptionsService.comment !== ''"
                  >
                    {{ descriptionsService.comment }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-timeline-item>

              <el-timeline-item
                v-if="
                  dealerStep === 4 &&
                  percentage > 50 &&
                  descriptionsDealer.title !== ''
                "
                :hide-timestamp="true"
                placement="top"
                :color="percentageColor"
                class="steps-info__item"
                :class="[{ 'step-active': percentage > 75 }]"
              >
                <el-descriptions
                  :title="descriptionsDealer.title"
                  class="step-descriptions"
                  v-if="
                    descriptionsDealer.title !== undefined &&
                    descriptionsDealer.title !== null
                  "
                >
                  <el-descriptions-item
                    v-if="
                      descriptionsDealer.address !== undefined &&
                      descriptionsDealer.address !== null &&
                      descriptionsDealer.address !== ''
                    "
                  >
                    {{ descriptionsDealer.address }}
                  </el-descriptions-item>
                  <el-descriptions-item
                    v-if="
                      descriptionsDealer.dealerPhone !== undefined &&
                      descriptionsDealer.dealerPhone !== null &&
                      descriptionsDealer.dealerPhone !== ''
                    "
                  >
                    <el-link
                      :href="'tel:' + descriptionsDealer.dealerPhone"
                      class="elis-text dealer-subtitle elis-link dealer-phone dealer-phone-descriptions"
                      type="primary"
                      >{{ descriptionsDealer.dealerPhone }}</el-link
                    >
                  </el-descriptions-item>
                  <el-descriptions-item
                    v-if="
                      descriptionsDealer.link !== undefined &&
                      descriptionsDealer.link !== null &&
                      descriptionsDealer.link !== ''
                    "
                  >
                    <el-link
                      type="primary"
                      :href="descriptionsDealer.link"
                      target="_blank"
                      class="elis-link dealer-link descriptions-link"
                    >
                      Перейти на сайт</el-link
                    >
                  </el-descriptions-item>
                </el-descriptions>
              </el-timeline-item>

              <el-timeline-item
                v-if="percentage > 75"
                :hide-timestamp="true"
                placement="top"
                :color="percentageColor"
                class="steps-info__item"
                :class="[{ 'step-active': percentage > 90 }]"
              >
                <el-descriptions
                  title="Дата и время визита"
                  class="step-descriptions"
                >
                  <el-descriptions-item
                    v-if="descriptionsContact.visit.length !== 0"
                  >
                    {{ descriptionsContact.visit.join(' в ') }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-timeline-item>

              <el-timeline-item
                v-if="percentage > 25"
                :hide-timestamp="true"
                placement="top"
                :color="percentageColor"
                class="steps-info__item"
                style="display: none"
              >
              </el-timeline-item>
            </el-timeline>
          </el-col>
        </el-row>

        <!-- Шаг 4. Контактные данные -->
        <!-- Согласие на обработку персональных данных -->
        <step-agreement-form
          v-if="percentage == 90"
          ref="refStepAgreementForm"
        />
      </template>
    </el-scrollbar>

    <!-- Навигационные кнопки -->
    <template #footer v-if="activeStep !== 0">
      <div class="elis-widget-footer">
        <el-button
          @click="backClick()"
          v-if="percentage >= 50 && percentage < 100"
          class="elis-widget-btn"
        >
          <el-icon>
            <ArrowLeftBold />
          </el-icon>
          Назад
        </el-button>
        <el-button
          v-if="percentage == 50"
          type="primary"
          class="elis-widget-btn"
          @click="nextClick()"
          >Следующий шаг
          <el-icon>
            <ArrowRightBold />
          </el-icon>
        </el-button>
        <el-button
          v-if="percentage == 90"
          type="primary"
          class="elis-widget-btn"
          :disabled="isSubmit"
          @click="submitForm()"
          >Записаться
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import {
  ElRow,
  ElCol,
  ElButton,
  ElDrawer,
  ElProgress,
  ElIcon,
  ElLink,
  ElText,
  ElImage,
  ElTimeline,
  ElTimelineItem,
  ElDescriptions,
  ElDescriptionsItem,
  ElScrollbar,
  ElNotification
} from 'element-plus'
import { Request } from './api/http'
import {
  Close,
  Right,
  Setting,
  User,
  Search,
  ArrowLeftBold,
  ArrowRightBold
} from '@element-plus/icons-vue'
import StepAutoForm from './components/StepAutoForm.vue'
import StepServiceForm from './components/StepServiceForm.vue'
import StepDealerForm from './components/StepDealerForm.vue'
import StepContactForm from './components/StepContactForm.vue'
import StepAgreementForm from './components/StepAgreementForm.vue'

export default {
  components: {
    StepAutoForm,
    StepServiceForm,
    StepDealerForm,
    StepContactForm,
    StepAgreementForm,
    ElRow,
    ElCol,
    ElButton,
    ElDrawer,
    ElProgress,
    ElIcon,
    ElLink,
    ElText,
    Close,
    Right,
    Setting,
    User,
    Search,
    ArrowLeftBold,
    ArrowRightBold,
    ElTimeline,
    ElTimelineItem,
    ElDescriptions,
    ElDescriptionsItem,
    ElImage,
    ElScrollbar
  },
  data() {
    return {
      id: '',
      dealerStep: window.elis_widget_booking_dealer_step || 3,
      elis_widget_booking_drawer: true,
      direction: 'rtl',
      percentage: 0,
      percentageColor: '#014637',
      timeLineColor: '0 0 0',
      activeStep: 0,
      loading: false,
      isSubmit: false,
      // Данные для отображения пройденных шагов на панели справа из каждой формы
      descriptionsAuto: {
        img: '',
        vin: '',
        model: '',
        modification: '',
        prodDate: '',
        gosnum: ''
      },

      descriptionsService: {
        service: [],
        comment: ''
      },

      descriptionsDealer: {
        dealerId: null,
        title: '',
        dealerPhone: '',
        address: '',
        link: ''
      },

      descriptionsContact: {
        visit: [],
        date: '',
        time: '',
        email: '',
        name: '',
        patronymic: '',
        phoneNumber: '',
        surname: '',
        bookingId: null
      },

      descriptionsAgreement: {
        personalData: true
      }
    }
  },
  mounted() {
    let params = new URL(document.location).searchParams
    console.log('🚀 ~ mounted ~ params:', params)
    let id = params.get('id')
    let step = params.get('step')
    console.log(
      '🚀 ~ mounted ~ window.elis_widget_booking_dealer_step:',
      window.elis_widget_booking_dealer_step
    )

    this.id = Number(id) || 24
    this.dealerStep = Number(step) || 3
    console.log('mounted id:', this.id, ' dealerStep:', this.dealerStep)
    // const elis_widget_booking = document.querySelector('#elis_widget_booking')
    // elis_widget_booking.addEventListener('click', this.toggleOpen)
    // setTimeout(() => {
    //   this.toggleOpen()
    // }, 0)
  },
  methods: {
    // Вернуться на шаг назад
    backClick() {
      // Для дилеров
      if (this.dealerStep === 3) {
        // Процентаж
        if (this.percentage === 100) {
          this.percentage = 90
        } else if (this.percentage === 90) {
          this.percentage = 50
        } else if (this.percentage === 50) {
          this.percentage = 0
        }
      }
      // Для УАЗа
      else if (this.dealerStep === 4) {
        if (this.percentage === 100) {
          this.percentage = 90
        } else if (this.percentage === 90) {
          this.percentage = 75
        } else if (this.percentage === 75) {
          this.percentage = 50
        } else if (this.percentage === 50) {
          this.percentage = 0
        }
      } else {
        console.log('dealerStep not found!')
      }
      if (this.activeStep > 0) this.activeStep -= 1
      this.dialogVisibleVinInfo = false
    },
    // Перейти на следующий шаг
    nextClick() {
      if (this.activeStep === 0) {
        this.$nextTick(() => {
          this.percentage = this.$refs['refStepAutoForm'].percentageAutoInfo
          this.activeStep = this.$refs['refStepAutoForm'].activeStepAutoInfo

          if (this.percentage === 25) {
            return
          } else if (this.percentage === 50) {
            this.descriptionsAuto.img =
              this.$refs['refStepAutoForm'].descriptions.img
            this.descriptionsAuto.vin =
              this.$refs['refStepAutoForm'].descriptions.vin
            this.descriptionsAuto.model =
              this.$refs['refStepAutoForm'].descriptions.model
            this.descriptionsAuto.modification =
              this.$refs['refStepAutoForm'].descriptions.modification
            this.descriptionsAuto.prodDate =
              this.$refs['refStepAutoForm'].descriptions.prodDate
            this.descriptionsAuto.gosnum =
              this.$refs['refStepAutoForm'].descriptions.gosnum
          }
        })
        return
      }
      // Валидация шага 2 и переход к шагу 3
      if (this.percentage === 50) {
        this.$refs['refStepServiceForm'].$refs['refService'].validate(
          async (valid, fields) => {
            if (valid) {
              this.descriptionsService.service =
                this.$refs['refStepServiceForm'].serviceForm.service

              this.descriptionsService.comment =
                this.$refs['refStepServiceForm'].serviceForm.comment

              if (this.dealerStep === 3) {
                this.percentage = 90
              } else {
                this.percentage = 75
              }

              this.activeStep += 1
            } else {
              console.log('error submit!', fields)
            }
          }
        )
        return
      }

      // Валидация шага 3 и переход к шагу 4
      if (this.percentage === 75) {
        this.$nextTick(() => {
          this.descriptionsDealer.dealerId =
            this.$refs['refStepDealerForm'].descriptions.dealerId
          this.descriptionsDealer.title =
            this.$refs['refStepDealerForm'].descriptions.title
          this.descriptionsDealer.dealerPhone =
            this.$refs['refStepDealerForm'].descriptions.dealerPhone
          this.descriptionsDealer.dealerPhone =
            this.$refs['refStepDealerForm'].descriptions.dealerPhone
          this.descriptionsDealer.address =
            this.$refs['refStepDealerForm'].descriptions.address
          this.descriptionsDealer.link =
            this.$refs['refStepDealerForm'].descriptions.link
          this.percentage = 90
          this.activeStep += 1
        })
        return
      }
    },
    // Функция скролла контейнера вверх при нажатии на кнопку пагинации. Вызывается из шага выбора дилера
    scrollToTop() {
      this.$nextTick(() => {
        this.$refs['refScrollContainer'].scrollTo(0, 0)
      })
    },
    // Получаем описание пройденного шага "Сервисные работы"
    callbackServiceDescriptions() {
      this.descriptionsService.service =
        this.$refs['refStepServiceForm'].serviceForm.service
      this.descriptionsService.comment =
        this.$refs['refStepServiceForm'].serviceForm.comment
    },
    // Получаем описание пройденного шага "Выбор дилерского центра"
    callbackDealerDescriptions() {
      this.descriptionsDealer.dealerId =
        this.$refs['refStepServiceForm'].dealerForm.dealerId
      this.descriptionsDealer.title =
        this.$refs['refStepServiceForm'].descriptions.title
      this.descriptionsDealer.dealerPhone =
        this.$refs['refStepServiceForm'].dealerForm.dealerPhone
      this.descriptionsDealer.dealerPhone =
        this.$refs['refStepServiceForm'].dealerForm.dealerPhone
      this.descriptionsDealer.address =
        this.$refs['refStepServiceForm'].dealerForm.address
      this.descriptionsDealer.link =
        this.$refs['refStepServiceForm'].dealerForm.link
    },
    // Получаем описание пройденного шага "Контактные данные"
    callbackVisitDescriptions() {
      this.descriptionsContact.visit = []
      // this.descriptionsContact.visit =
      //   this.$refs['refStepContactForm'].descriptions.visit

      if (this.$refs['refStepContactForm'].contactForm.date !== '') {
        this.descriptionsContact.visit.push(
          this.$refs['refStepContactForm'].formatDate(
            this.$refs['refStepContactForm'].contactForm.date
          )
        )
      }

      if (this.$refs['refStepContactForm'].contactForm.time !== '') {
        this.descriptionsContact.visit.push(
          this.$refs['refStepContactForm'].contactForm.time
        )
      }
      this.descriptionsContact.date =
        this.$refs['refStepContactForm'].contactForm.date
      this.descriptionsContact.time =
        this.$refs['refStepContactForm'].contactForm.time
      this.descriptionsContact.email =
        this.$refs['refStepContactForm'].contactForm.email
      this.descriptionsContact.name =
        this.$refs['refStepContactForm'].contactForm.name
      this.descriptionsContact.patronymic =
        this.$refs['refStepContactForm'].contactForm.patronymic
      this.descriptionsContact.phoneNumber =
        this.$refs['refStepContactForm'].contactForm.phoneNumber
      this.descriptionsContact.surname =
        this.$refs['refStepContactForm'].contactForm.surname
      this.descriptionsContact.bookingId =
        this.$refs['refStepContactForm'].contactForm.bookingId
    },
    // Отправка данных для записи на сервис
    submitForm() {
      this.isSubmit = true
      let statusValidСontactForm = false
      let statusValidAgreementForm = false
      this.loading = true

      this.$nextTick(() => {
        this.$refs['refStepContactForm'].$refs['refСontact'].validate(
          (valid) => {
            let now = new Date()
            let [hours, minutes] = this.descriptionsContact.time
              .split(':')
              .map(Number)
            let [year, month, date] = this.descriptionsContact.date
              .split('-')
              .map(Number)
            let slotTime = new Date(year, month - 1, date, hours, minutes)
            if (slotTime < now) {
              ElNotification({
                title: 'Превышено время ожидания записи на сервис!',
                message:
                  'На выбранное время запись уже прошла. Выберите другое время.',
                type: 'error'
              })
              statusValidСontactForm = false
            } else {
              statusValidСontactForm = valid
            }
          }
        )
      })
      this.$nextTick(() => {
        this.$refs['refStepAgreementForm'].$refs['refAgreement'].validate(
          async (valid) => {
            statusValidAgreementForm = valid
          }
        )
      })
      setTimeout(async () => {
        if (statusValidСontactForm && statusValidAgreementForm) {
          this.loading = true
          this.callbackVisitDescriptions()

          const params = {
            dealer_id: this.id,
            // dealer_id: this.descriptionsDealer.dealerId,
            slotStart: this.descriptionsContact.time,
            date: this.descriptionsContact.date,
            booking_id: this.descriptionsContact.bookingId,
            status: 'busy',
            vin: this.descriptionsAuto.vin,
            gosnomer: this.descriptionsAuto.gosnum,
            lname: this.descriptionsContact.surname,
            fname: this.descriptionsContact.name,
            mname: this.descriptionsContact.patronymic,
            email: this.descriptionsContact.email,
            phone: this.descriptionsContact.phoneNumber,
            comment: this.descriptionsService.comment,
            service: [...this.descriptionsService.service]
          }
          const res = await Request({
            url: '/booking/' + this.descriptionsContact.bookingId,
            method: 'put',
            params
          })
          if (res) {
            this.percentage = 100
            // this.activeStep += 1
          } else {
            console.log('submit error!')
          }

          this.loading = false
          this.isSubmit = false
        } else {
          console.log('validation error!')
          this.loading = false
          this.isSubmit = false
        }
      }, 0)
    },
    // toggleOpen() {
    //   this.elis_widget_booking_drawer = true // !this.drawer
    //   // alert('toggleOpen 1')
    //   // debugger
    //   // this.nextClick()
    // },
    // Сбрасываем данные форм
    resetDate() {
      this.$nextTick(() => {
        console.log(
          "🚀 ~ this.$nextTick ~ this.$refs['refStepServiceForm']:",
          this.$refs['refStepServiceForm']
        )
        if (
          this.$refs['refStepServiceForm'] ||
          this.$refs['refStepDealerForm'] ||
          this.$refs['refStepContactForm'] ||
          this.$refs['refStepAgreementForm']
        ) {
          this.$refs['refStepServiceForm'].$refs['refService'].resetFields()
          this.$refs['refStepDealerForm'].$refs['refDealer'].resetFields()
          this.$refs['refStepContactForm'].$refs['refContact'].resetFields()
          this.$refs['refStepAgreementForm'].$refs['refAgreement'].resetFields()
        }
      })

      // Сбрасываем данные для отображения пройденных шагов на панели справа из каждой формы
      this.descriptionsAuto = {
        img: '',
        vin: '',
        model: '',
        modification: '',
        prodDate: '',
        gosnum: ''
      }
      this.descriptionsService = {
        service: '',
        comment: ''
      }
      this.descriptionsDealer = {
        dealerId: null,
        title: '',
        dealerPhone: '',
        address: '',
        link: ''
      }
      this.descriptionsContact = {
        visit: [],
        date: '',
        time: '',
        email: '',
        name: '',
        patronymic: '',
        phoneNumber: '',
        surname: '',
        bookingId: null
      }
      this.descriptionsAgreement = {
        personalData: true
      }

      this.vinInfo = {
        number: '',
        img: '',
        model: '',
        modification: '',
        prodDate: ''
      }
    },

    // Закрываем виджет, сбрасываем данные записи на сервис
    closedDrawer(evt) {
      window.top.postMessage('closeDrawer', '*')
      // this.elis_widget_booking_drawer = true
      this.tooltipVisible = false

      if (this.percentage == 100) {
        this.currentVin = ''
        this.currentGosnum = ''
        this.$refs['refStepAutoForm'].$refs['refAuto'].resetFields()
        this.resetDate()
        this.activeName = 'vin'
        this.activeStep = 0
        this.percentage = 0
      }
    }
  }
}
</script>

<style>
@import './font/font.css';
@import './css/main.css';
</style>
