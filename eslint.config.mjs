import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
			globals: globals.browser,
		},
		plugins: {
			js,
			"@typescript-eslint": tseslint.plugin,
			react: pluginReact,
		},
	},

	...tseslint.configs.recommended,

	{
		files: ["**/*.{jsx,tsx}"],
		rules: {
			...pluginReact.configs.flat.recommended.rules,
		},
	},

	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"react/no-unescaped-entities": "warn",
			"react/prop-types": "off",
		},
	},
	{
		files: ["*.config.js"],
		rules: {
			"@typescript-eslint/no-require-imports": "off",
		},
	},
	globalIgnores(["node_modules/*", ".expo/*", "builds/*", "android"]),
]);
