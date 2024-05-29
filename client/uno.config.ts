// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [presetAttributify(), presetUno(), presetRemToPx({ baseFontSize: 4 })],
  shortcuts: [
    { 'f-center': 'flex justify-center items-center' },
    { fullscreen: 'w-screen h-screen' },
  ],
})
