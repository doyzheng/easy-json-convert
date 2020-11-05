var input = require('./input');
var output = require('./output');
var template = require('./template');
var jsonConvert = require('../../index');
var util = require('../utils');
util.__dirname = __dirname;

describe('8.1直接使用jsonConvert方法快速转换，第一个参数是输入数据，第二参数是json模板或jsonSchema，第三参数是配置', () => {

    it('输出的过滤数据是否正确', () => {
        util.deepEqualOutput(jsonConvert(input, template, {

            redundancy: true
        }), output, __dirname);
    });

});



