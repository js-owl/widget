import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), ElementPlus()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  cssCodeSplit: true,
  scssCodeSplit: true,
  preprocessCss: {
    webpack: (css) => ({
      code: css.replace(/\/\*.*?\*\//g, '')
    })
  }
})
