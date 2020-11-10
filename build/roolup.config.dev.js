import {uglify} from 'rollup-plugin-uglify';

export default {
    input: 'src/main.js',
    output: {
        name: 'jsonConvert',
        format: 'umd',
        file: 'index.js',
    },
    plugins: [
      //  uglify(),
    ],
};
