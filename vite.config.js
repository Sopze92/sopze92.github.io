import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import mkcert from "vite-plugin-mkcert"

//import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: {
    https: true,
  },
  plugins: [
    react(),
    mkcert(),
    svgr({
      svgrOptions: { 
        exportType: "default", 
        ref: false, svgo: false, titleProp: false, prettier: false, expandProps:true,
        icon: true, dimensions: false
      },
      include: "**/*.svg"
    })
  ],
  base: "/",
  build: {
    minify: true,
    assetsInlineLimit: 512
  }
})
