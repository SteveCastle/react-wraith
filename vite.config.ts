/// <reference types="node" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // When building on GitHub Actions / Pages the site is served from
  // <username>.github.io/<repo>/ so we need to prefix asset URLs with
  // the repo name. Locally we keep the root path.
  base: process.env.GITHUB_ACTIONS ? "/react-wraith/" : "/",
  plugins: [react()],
});
