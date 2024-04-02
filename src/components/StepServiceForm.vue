<template>
  <el-col :span="13" style="text-align: left">
    <el-text class="elis-text elis-widget-step-title" tag="h3">
      Выберите сервисные работы
    </el-text>

    <el-form
      ref="refService"
      :model="serviceForm"
      :rules="rulesService"
      class="step-service"
    >
      <el-form-item prop="service" class="step-form-item step-service__item">
        <el-checkbox-group
          v-model="serviceForm.service"
          class="step-service__service-work"
          @change="watchService()"
        >
          <el-checkbox-button
            class="checkbox-button"
            v-for="work in serviceList"
            :key="work"
            :label="work"
            :checked="serviceForm.service.includes(work)"
          >
            {{ work }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="comment" class="step-form-item">
        <el-input
          v-model="serviceForm.comment"
          class="elis-input step-service__comment"
          type="textarea"
          autosize
          maxlength="250"
          show-word-limit
          resize="none"
          placeholder="Ваш комментарий..."
          @input="watchComment()"
        />
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
  ElText,
  ElCheckbox,
  ElCheckboxGroup,
  ElCheckboxButton
} from 'element-plus'

export default {
  name: 'StepServiceForm',
  components: {
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElText,
    ElCheckbox,
    ElCheckboxGroup,
    ElCheckboxButton
  },
  props: ['parentDescriptionsService'],
  emits: ['nextStep', 'callbackService'],
  mounted() {
    console.log(
      'this.parentDescriptionsService',
      this.parentDescriptionsService
    )

    this.clearValid()
    if (this.parentDescriptionsService.service.length > 0) {
      this.serviceForm = this.parentDescriptionsService
    }
  },
  data() {
    return {
      activeStepService: 1,
      percentageService: 50,
      serviceList: [
        'Техническое обслуживание',
        'Кузовной ремонт',
        'Ремонт',
        'Диагностика',
        'Шиномонтаж',
        'Другое'
      ],

      // Форма данных о сервисных работах
      serviceForm: {
        service: [],
        comment: ''
      },
      rulesService: {
        service: [
          {
            type: 'array',
            required: true,
            message: 'Выберите сервисные работы',
            trigger: 'change'
          }
        ]
      },
      descriptions: {
        service: [],
        comment: ''
      }
    }
  },

  methods: {
    clearValid() {
      return this.$nextTick(() => {
        this.$refs['refService'].clearValidate()
      })
    },
    watchService() {
      this.descriptions.service = this.serviceForm.service.join(' / ')
      this.$emit('callbackService')
    },
    watchComment() {
      this.descriptions.comment = this.serviceForm.comment
      this.$emit('callbackService')
    }
  }
}
</script>
