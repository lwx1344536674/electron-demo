import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-electron-plugin'
import {
    alias,
    copy,
    dest,
    esmodule,
    customStart,
    loadViteEnv,
} from 'vite-electron-plugin/plugin'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({mode,command})=>{
    console.log(mode,command,'sss')
    return{
        plugins: [
            vue(),
            /*electron({
                entry: path.relative(__dirname,'electron/main.ts'),
                include: [
                    'electron',
                ],
            }),*/
               /* electron({
                    entry: 'electron/main.ts',
                    vite: {
                        build: { outDir: "dist/electron" }
                    },
                    include: [
                        'electron',
                        'dist-electron'
                    ],
                })*/
            electron({
                plugins: [
                    alias([
                        // `replacement` is recommented to use absolute path,
                        // it will be automatically calculated as relative path.
                        { find: '@', replacement: path.join(__dirname, 'src') },
                    ]),

                    copy([
                        // filename, glob
                        { from: 'foo/*.ext', to: 'dest' },
                    ]),

                    // Dynamic change the build dist path.
                    dest((_from, to) => to?.replace('dist-electron', 'dist-other')),

                    customStart(({ startup }) => {
                        // If you want to control the launch of Electron App yourself.
                        startup()
                    }),

                    // Support use ESM npm-package in Electron-Main.
                    esmodule({
                        // e.g. `execa`, `node-fetch`, `got`, etc.
                        include: ['execa', 'node-fetch', 'got'],
                    }),

                    // https://vitejs.dev/guide/env-and-mode.html#env-files
                    // Support use `import.meta.env.VITE_SOME_KEY` in Electron-Main
                    loadViteEnv(),
                ],
            }),
        ]
    }

})

