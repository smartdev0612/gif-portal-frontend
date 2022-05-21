import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from "vite";

export default defineConfig({
    define: {
        global: {},
        process: {
            'env': {}
        }
    },
    plugins: [reactRefresh()],
    server: {
        host: '0.0.0.0',
        hmr: {
            port: 443,
        }
    }
})