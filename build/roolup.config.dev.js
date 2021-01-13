import {uglify} from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/main.js',
    output: {
        name: 'jsonConvert',
        format: 'umd',
        file: 'index.js',
    },
    plugins: [
       /* uglify(),*/
      /*  babel(),*/
    ],
};
