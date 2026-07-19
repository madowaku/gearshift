import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  // Keep local development at the root while production assets resolve from
  // the GitHub Pages project path.
  base: mode === "development" ? "/" : "/gearshift/",
  server: {
    port: 5173,
  },
}));

