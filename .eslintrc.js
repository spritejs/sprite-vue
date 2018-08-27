// https://eslint.org/docs/user-guide/configuring

module.exports = {
  globals: {
    __WEEX__: true,
    WXEnvironment: true
  },
  extends: ['plugin:vue-libs/recommended'],
  plugins: [
    'flowtype'
  ],
  // add your custom rules here
  rules: {
    'no-undef': 'off',
  }
}
