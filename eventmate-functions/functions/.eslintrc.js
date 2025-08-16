// functions/.eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser', // Le dice a ESLint que use el parser de TypeScript
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended', // Reglas recomendadas por ESLint
    'plugin:@typescript-eslint/recommended', // Reglas recomendadas para TypeScript
    'plugin:prettier/recommended', // Integra Prettier, debe ser la última
  ],
  rules: {
    // Aquí puedes añadir o sobrescribir reglas. Por ejemplo:
    '@typescript-eslint/no-unused-vars': 'warn', // Advierte sobre variables no usadas en lugar de dar error
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Permite no tener que tipar el retorno de cada función
  },
  env: {
    node: true, // Define que el entorno es Node.js
    es6: true,
  },
};
