import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'src/main.es6',
    format: 'cjs',
    plugins: [json(), babel({
        presets: ['es2015-rollup'],
        babelrc: false
    }), uglify()],
    dest: 'main.js'
};