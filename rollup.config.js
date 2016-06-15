import json from 'rollup-plugin-json';

export default {
    entry: 'src/main.es6',
    format: 'cjs',
    plugins: [json()],
    dest: 'main.js'
};