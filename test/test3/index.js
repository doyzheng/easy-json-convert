var input = require('./input');
var output = require('./output');
var template = require('./template');
var schema = require('./schema');
var convert = require('../../index');
var jsonSchema = convert.schema;
var filterJson = convert.convert;
var util = require('../utils');

describe('3.使用*号标记为必须项，无论输入数据是否包含，输出数据中都会存在（根据模板定义的类型，返回对应的默认值）', () => {

    it('输出的模板描述对象是否正确', () => {
        util.deepEqualSchema(jsonSchema(template), schema, __dirname);
    });

    it('输出的过滤数据是否正确', () => {
        util.deepEqualOutput(filterJson(input, schema), output, __dirname);
    });

});
