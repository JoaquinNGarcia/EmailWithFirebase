module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  // This line is required to fix "unexpected token" errors
  parser: "babel-eslint",
  rules: {
    quotes: ["error", "double"],
  },
};
