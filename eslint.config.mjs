import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import reactNamingConventionPlugin from "eslint-plugin-react-naming-convention";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

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
			"react-naming-convention": reactNamingConventionPlugin,
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/naming-convention": [
				"warn",
				{
					selector: "memberLike",
					modifiers: ["readonly"],
					format: ["UPPER_CASE"],
				},
			],
			...pluginReact.configs.flat.recommended.rules,
			"react/no-unescaped-entities": "warn",
			"react/prop-types": "off",
			"react/jsx-pascal-case": [
				"warn",
				{
					allowAllCaps: true,
					ignore: [],
				},
			],
			"react/react-in-jsx-scope": "off",
			"react-naming-convention/context-name": "warn",
			"react-naming-convention/filename-extension": ["warn", "as-needed"],
			"react-naming-convention/use-state": "warn",
			"no-console": "error",

			"@typescript-eslint/explicit-member-accessibility": [
				"warn",
				{
					accessibility: "explicit",
					overrides: {
						constructors: "no-public",
					},
				},
			],
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	{
		files: ["*.ts", "*.mts", "*cts"],
		rules: {
			"react-naming-convention/filename": ["warn", { rule: "PascalCase" }],
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
