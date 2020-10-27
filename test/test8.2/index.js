var input = require('./input');
var output = require('./output');
var template = require('./template');
var jsonConvert = require('../../index2');
var util = require('../utils');
util.__dirname = __dirname;

describe('8案例：在过滤器中使用JSON.parse后再次使用转换器', () => {

    it('输出的过滤数据是否正确', () => {

        // jsonConvert(input, template);

        new jsonConvert;

        // console.log(new jsonConvert.convert().convert(input, template));
        // console.log(jsonConvert.schema().parse(template));
        // util.deepEqualOutput(jsonConvert(input, template), output, __dirname);
    });

});



