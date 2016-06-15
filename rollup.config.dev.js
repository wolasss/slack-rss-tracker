import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/main.es6',
    format: 'cjs',
    plugins: [json(), babel({
        presets: ['es2015-rollup'],
        babelrc: false
    })],
    dest: 'main.js'
};