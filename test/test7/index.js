var input = require('./input');
var output = require('./output');
var template = require('./template');
var schema = require('./schema');
var convert = require('../../index');
var jsonSchema = convert.schema;
var filterJson = convert.convert;
var util = require('../utils');

describe('7#使用自定义filter（过滤器）过滤字段', () => {

    it('输出的模板描述对象是否正确', () => {
      //  util.deepEqualSchema(jsonSchema(template), schema, __dirname);
    });

    it('输出的过滤数据是否正确', () => {
        util.deepEqualOutput(filterJson(input, jsonSchema(template)), output, __dirname);
    });

});
