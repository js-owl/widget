<template>
  <el-row>
    <el-form
      ref="refAgreement"
      :model="agreementForm"
      :rules="rulesAgreement"
      class="step-agreement"
    >
      <el-form-item
        prop="personalData"
        class="step-form-item checkbox-agreement"
      >
        <el-checkbox v-model="agreementForm.personalData" label="true" checked>
          <el-text tag="label" class="elis-text checkbox-agreement__label">
            Я даю согласие на
            <el-link
              class="elis-link"
              type="primary"
              href="https://www.uaz.ru/uploads/docs/consent-to-processing-of-personal-data.pdf"
              target="_blank"
            >
              обработку моих персональных данных </el-link
            >*.
          </el-text>
        </el-checkbox>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import {
  ElRow,
  ElForm,
  ElFormItem,
  ElLink,
  ElText,
  ElCheckbox
} from 'element-plus'

export default {
  name: 'StepContactForm',
  components: {
    ElRow,
    ElForm,
    ElFormItem,
    ElLink,
    ElText,
    ElCheckbox
  },
  emits: ['nextStep', 'callbackVisit'],
  data() {
    var checkValidAgreement = (rule, value, callback) => {
      if (value === false) {
        return callback(new Error('Обязательное поле'))
      } else {
        callback()
      }
    }
    return {
      // Форма согласия на обработку ПД
      agreementForm: {
        personalData: true
      },
      rulesAgreement: {
        personalData: {
          validator: checkValidAgreement,
          trigger: 'change'
        }
      },

      descriptions: {
        personalData: true
      }
    }
  },
  methods: {}
}
</script>
