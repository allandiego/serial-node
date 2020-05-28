module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },
  "extends": [
    "plugin:react/recommended",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    //"prettier/react",
    "plugin:prettier/recommended"

    // "eslint:recommended",
      // "plugin:@typescript-eslint/eslint-recommended",
      // "plugin:import/errors",
      // "plugin:import/warnings"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "react-hooks",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",

    "global-require": "off",
    "class-methods-use-this": "off",

    "react/display-name": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-filename-extension": ["error", { "extensions": [".tsx"] }],
    "react/prop-types": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-props-no-spreading": "off",


    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-function-return-type": "off",


    "no-unused-vars": ["error", { argsIgnorePattern: "_" }],
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    "no-unused-expressions": "off", // ref.current?.function()
    "camelcase": "off",

    // allow single export without default in a file
    "import/prefer-default-export": "off",
    // allow imports without specify this extensions
    "import/extensions": [
      "error",
      "ignorePackages",
      { "ts": "never", "tsx": "never" }
    ]
  },
  "settings": { "import/resolver": { "typescript": {} } },
};
