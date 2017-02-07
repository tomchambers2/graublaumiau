module.exports = {
    "plugins": [
      "react",
      "react-native",
      "standard",
      "promise"
    ],
    "extends": ["standard", "eslint:recommended", "plugin:react/all", "plugin:react-native/all"],
    "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true
      },
    },
    "parser": "babel-eslint",
    "rules": {
      "react/forbid-component-props": 0,
      "react/forbid-prop-types": 0,
      "react/sort-prop-types": 0,
      "react/jsx-handler-names": 0,
      "react/no-set-state": 0,
      "react/jsx-filename-extension": 0,
      "react/no-deprecated": 2,
      "react/prefer-es6-class": 2,
      "react/jsx-curly-spacing": 2,
      "react/jsx-equals-spacing": 2,
      "react/jsx-no-undef": 2,
      "react/jsx-uses-react": 2,
      "react-native/no-unused-styles": 2,
      "react-native/split-platform-components": 2,
      "react-native/no-inline-styles": 2,
      "react-native/no-color-literals": 2,
      "semi": 0,
      "comma-dangle": ["error", {
          "arrays": "always-multiline",
          "objects": "always-multiline",
          "imports": "always-multiline",
          "exports": "always-multiline",
          "functions": "ignore"
      }]
    }
};
