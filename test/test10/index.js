var input = require('./input');
var output = require('./output');
var template = require('./template');
var schema = require('./schema');
var convert = require('../../index');
var jsonSchema = convert.schema;
var filterJson = convert.convert;
var util = require('../utils');

describe('10#使用options参数', () => {

    it('输出的模板描述对象是否正确', () => {
        util.deepEqualSchema(jsonSchema(template, {
            // 标记必须存在的属性标识
            requiredSign: '?',
            // 标记别名属性标识
            aliasSign: '|',
            // 默认全部属性必须存在
            allRequired: false,
        }), schema, __dirname);
    });

    it('输出的过滤数据是否正确', () => {
        util.deepEqualOutput(filterJson(input, schema), output, __dirname);
    });

});

