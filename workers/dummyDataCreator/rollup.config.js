import esbuild from 'rollup-plugin-esbuild'
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default defineConfig([
    {
        input: 'workers/dummyDataCreator/src/index.ts',
        plugins: [
            esbuild.default(),
            commonjs(),
            nodeResolve({
                browser: true,
            }),
        ],
        output: {
            name: 'dummyDataCreator',
            file: 'public/worker/dummyImports.js',
            format: 'iife',
            sourcemap: true,
            exports: 'named',
        },
    },
])
