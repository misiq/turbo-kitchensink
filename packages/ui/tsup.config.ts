import {defineConfig, Options} from 'tsup';

export default defineConfig((options: Options) => ({
    entry: [
        'src/index.tsx',
        'src/atoms/index.tsx'
    ],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    splitting: false,
    external: ['react', 'react-dom', '@misq/tailwind-config'],
    esbuildOptions(options) {
        return {
            ...options,
            target: 'ES2020',
            define: {
                global: 'globalThis'
            }
        }
    },
    clean: true
}))