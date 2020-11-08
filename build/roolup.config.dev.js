import {uglify} from 'rollup-plugin-uglify';

export default {
    input: 'src/main.js',
    output: {
        name: 'json-convert',
        format: 'umd',
        file: 'index.js'
    },
    plugins: [
        uglify(),
    ],
};
