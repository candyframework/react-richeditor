module.exports = {
    // ESLint typescript parser
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "globals": {
        "window": true,
        "document": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "rules": {
        "semi": ["error", "always"],
        "quotes": [ 2, "single" ],
        "yoda": 0,
        "semi": 0,
        "no-unused-vars": 0,

        "react/prop-types": 0
    }
}
