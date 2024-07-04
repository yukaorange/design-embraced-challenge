import glsl from 'vite-plugin-glsl'
import fs from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import handlebars from 'vite-plugin-handlebars'
import { rollupFiles } from './rollup'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const configs = {
  global: {},
  meta: {}
}

// JSONファイルを読み込むための関数（./src/config/*.jsonでの利用を想定）
const readConfigJSONFile = filePath => {
  return new Promise(async resolve => {
    const file = fs.readFileSync(filePath)
    resolve(JSON.parse(file))
  })
}

const root = resolve(__dirname, 'src/pages')

export default defineConfig(async () => {
  // ビルド対象のHTMLファイルをリスト化する
  const rollupOptionsInput = await rollupFiles('./src/pages', '.html', {})
  // サイト設定のJSONファイルを読み込む
  configs.global = await readConfigJSONFile('./src/configs/global.json')
  configs.meta = await readConfigJSONFile('./src/configs/meta.json')

  return {
    root: root,
    base: './',
    publicDir: resolve(__dirname, 'public'),
    server: {
      port: 8080
    },
    build: {
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        input: rollupOptionsInput
      },
      css: {
        devSourcemap: true,
        postcss: {
          // .browserslistrcで指定したブラウザ用にCSSを自動で調整してくれる
          plugins: [autoprefixer()]
        }
      }
    },
    plugins: [
      // production -> minifyだけを行う（静的サイトとしてデプロイを前提とするため。）
      ViteMinifyPlugin(),
      // 共通パーツを読み込むための記述
      // partialDirectoryで指定したディレクトリのパーツが読み込まれる。
      handlebars({
        partialDirectory: [
          resolve(__dirname, 'src/includes/globals'),
          resolve(__dirname, 'src/includes/components'),
          resolve(__dirname, 'src/includes/modules')
        ],
        context(pagePath) {
          return {
            ...configs.global,
            page:
              typeof configs.meta[pagePath] !== 'undefined' &&
              configs.meta[pagePath],
            pagePath: pagePath
          }
        }
      }),
      ViteImageOptimizer(configs.global.image.optimization),
      glsl()
    ],
    resolve: {
      // src/assets/scss を @ として読み込むことができる。SCSSファイルで外部ファイルを読み込むときに活用すると便利。
      alias: {
        '@': resolve(__dirname, 'src/assets/scss'),
        '@ts': resolve(__dirname, 'src/assets/ts')
      }
    }
  }
})
