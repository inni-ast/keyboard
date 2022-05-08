module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        "no-tabs": 0,
        "import/extensions": [0, { js: "always" }],
        "indent": ["off", 2],
        'no-plusplus': ['off'],
        'func-names': 'off'

    }

};
