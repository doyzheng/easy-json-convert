var input = require('./input');
var output = require('./output');
var template = require('./template');
var schema = require('./schema');
var convert = require('../../index');
var jsonSchema = convert.schema;
var filterJson = convert.convert;
var util = require('../utils');

describe('4.2指定全局默认值，输入字段不存在时，返回自定义默认值', () => {

    it('输出的模板描述对象是否正确', () => {
        util.deepEqualSchema(jsonSchema(template), schema, __dirname);
    });

    it('输出的过滤数据是否正确', () => {
        util.deepEqualOutput(filterJson(input, schema, {
            defaults: {
                string: 'default',
                number: 123456,
                boolean: true,
                null: null,
                array: [0, 1, 2],
                object: {default: 'default'},
            },

        }), output, __dirname);
    });

});
