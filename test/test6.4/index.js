var input = require('./input');
var output = require('./output');
var template = require('./template');
var schema = require('./schema');
var convert = require('../../index');
var jsonSchema = convert.schema;
var filterJson = convert.convert;
var util = require('../utils');

describe('6.2多层对象数组，使用allRequired参数，aliasSign指定别名，保证输出数据和模板的一致性', () => {

    it('输出的模板描述对象是否正确', () => {
        util.deepEqualSchema(jsonSchema(template, {
            allRequired: true,
            aliasSign: '|',
        }), schema, __dirname);
    });

    it('输出的过滤数据是否正确', () => {
        util.deepEqualOutput(filterJson(input, schema), output, __dirname);
    });

});
