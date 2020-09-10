var input = require('./input');
var output = require('./output');
var template = require('./template');
var jsonConvert = require('../../index');
var util = require('../utils');
util.__dirname = __dirname;

describe('9#案例1', () => {
    it('输出的过滤数据是否正确', () => {
        util.deepEqualOutput(jsonConvert(input, template), output, __dirname);
    });
});

