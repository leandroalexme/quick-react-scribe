
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [
		react(),
		mode === 'development' && componentTagger(),
	].filter(Boolean),
	server: {
		host: "::",
		port: 8080
	}
}))
