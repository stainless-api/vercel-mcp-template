import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    extends: [js.configs.recommended], 
    languageOptions: { globals: globals.browser } 
  },
  tseslint.configs.recommended,
  globalIgnores(['.next/**']),
]);