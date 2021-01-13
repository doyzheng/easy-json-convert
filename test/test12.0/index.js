var input = require('./input');
var output = require('./output');
var schema = require('./schema');
var convert = require('../../index');
var filterJson = convert.convert;
var util = require('../utils');

describe('10#使用options参数', () => {
    it('输出的过滤数据是否正确', () => {
        util.deepEqualOutput(filterJson(input, schema), output, __dirname);
    });
});

