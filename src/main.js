import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ru from 'element-plus/dist/locale/ru.mjs'
import { vMaska } from 'maska' // https://beholdr.github.io/maska/#/
import 'dayjs/locale/ru'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: ru
})

app.directive('maska', vMaska)
app.mount('#widget')
