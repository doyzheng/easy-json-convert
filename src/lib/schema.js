import {
    isSchema,
    isObject,
    isArray,
    includes,
    merge,
    getType,
} from './utils';

/**
 * 解析json，转换成可描述对象
 * @param {Object} jsonTemplate         json模板
 * @param {Object} options              全局默认配置项
 * @param {Object} options.title        标题
 * @param {Object} options.description  描述
 * @param {Object} options.requiredSign 标记必须存在的属性标识
 * @param {Object} options.aliasSign    标记别名属性标识
 * @param {Object} options.allRequired  默认全部属性必须存在
 * @return {Object}
 */
function Schema(jsonTemplate, options) {

    options = merge({
        title: '',
        description: '',
        requiredSign: '*',
        aliasSign: '@',
        allRequired: false,
    }, options);

    /**
     * 解析json格式为json-schema
     * @param {Object} json
     * @param {Object} schema
     * @return {Object}
     */
    var parse = function(json, schema) {
        if (json === undefined) {
            return;
        }
        schema = schema || {};
        // 解析数组
        if (isArray(json)) {
            parseArray(json, schema);
        }
        // 解析对象
        else if (isObject(json)) {
            parseObject(json, schema);
        }
        else {
            schema.type = getType(json);
        }
        return schema;
    };

    /**
     * 处理结构
     * @param {Object} json
     * @param {Object} schema
     */
    var handleSchema = function(json, schema) {
        merge(schema, json);
        if (schema.type === 'object') {
            delete schema.properties;
            if (json.properties) {
                parse(json.properties, schema);
            }
        }
        if (schema.type === 'array') {
            delete schema.items;
            schema.items = {};
            if (json.items) {
                parse(json.items, schema.items);
            }
        }
    };

    /**
     * 处理数组
     * @param {Array} arr
     * @param {Object} schema
     */
    var parseArray = function(arr, schema) {
        schema.type = 'array';
        var props = schema.items = {};
        if (arr.length) {
            parse(arr[0], props);
        }
    };

    /**
     * 处理对象类型
     * @param {Object} json
     * @param {Object} schema
     */
    var parseObject = function(json, schema) {
        if (isSchema(json)) {
            return handleSchema(json, schema);
        }

        schema.type = 'object';
        schema.required = [];
        schema.properties = {};

        for (var key in json) {
            if (!json.hasOwnProperty(key)) {
                continue;
            }

            var newKey = key,
                value = json[newKey],
                curSchema = schema.properties[newKey] = {},
                aliasSign = options.aliasSign,
                requiredSign = options.requiredSign,
                allRequired = options.allRequired;

            /** 使用约定符号指定别名例如：*user_id@uid **/
            var alias = '';
            var aliasIndex = newKey.indexOf(aliasSign);
            if (aliasIndex !== -1) {
                delete schema.properties[newKey];// 删除原属性结构信息
                // 标识符号左边为原名右边为别名
                alias = newKey.substr(aliasIndex + aliasSign.length);
                newKey = newKey.substr(0, aliasIndex);
                curSchema = schema.properties[newKey] = {};
            }

            /** 使用约定符号标记必须项例如：*user_id **/
            var existRequiredSign = newKey[0] === requiredSign;
            if (existRequiredSign) {
                delete schema.properties[newKey];// 删除原属性结构信息
                newKey = newKey.substr(1);// 去掉前面的标记符号
                curSchema = schema.properties[newKey] = {};// 清空上级属性列表
                schema.required.push(newKey);// 必须项放入上级schema.required中
            }
            // 如果配置了全部属性为必须项
            if (allRequired) {
                // 避免重复添加
                if (!existRequiredSign) {
                    schema.required.push(newKey);
                }
            }

            // 如果存在别名，在当前schema.alias属性记录
            if (alias) {
                curSchema.alias = alias;
            }

            // 记录当前节点对应的key
            curSchema.name = newKey;

            normAttribute(curSchema);

            parse(value, curSchema);
        }
    };

    /**
     * 将不符合jsonSchema规范的属性前加上@前缀
     * @param schema
     * @returns {*}
     */
    var normAttribute = function(schema) {
        for (var name in schema) {
            if (!schema.hasOwnProperty(name)) {
                continue;
            }

            if (!includes(schema.attributes, name)) {
                schema['@' + name] = schema[name];
                delete schema[name];
            }
        }
        return schema;
    };

    var jsonSchema = Object.assign({
        'title': options.title,
        'description': options.description,
    }, Schema.baseSchema);

    return Object.assign(jsonSchema, parse(jsonTemplate));
}

// 标准结构
Schema.baseSchema = {
    'id': 'http://json-schema.org/draft-04/schema#',
    '$schema': 'http://json-schema.org/draft-04/schema#',
    'title': '',
    'description': '',
};

/**
 * 设置schema结构属性值，如果属性名不属于标准schema，则添加@作为属性名前缀
 * @param {Object} schema
 * @param {String} name
 * @param {*} value
 * @returns {*}
 */
Schema.setAttribute = function(schema, name, value) {
    if (includes(this.attributes, name)) {
        schema[name] = value;
    }
    else {
        schema['@' + name] = value;
    }

    return schema;
};

/**
 * 获取schema结构属性值，如果属性名不属于标准schema，则添加@作为属性名前缀
 * @param {Object} schema
 * @param {String} name
 * @returns {*}
 */
Schema.getAttribute = function(schema, name) {
    if (includes(this.attributes, name)) {
        return schema[name];
    }

    return schema['@' + name];
};

Schema.attributes = [
    // 参考来源 https://www.jianshu.com/p/1711f2f24dcf?utm_campaign=hugo
    '$schema',//The $schema 关键字状态，这种模式被写入草案V4规范。
    'title',// 将使用此架构提供一个标题，title一般用来进行简单的描述，可以省略
    'description',// 架构的一点描述，description一般是进行详细的描述信息，可以省略
    'type',//	用于约束校验的JSON元素的数据类型，是JSON数据类型关键字定义的第一个约束条件：它必须是一个JSON对象
    'properties',//	定义属性：定义各个键和它们的值类型，最小和最大值中要使用JSON文件
    'required',//	必需属性，这个关键字是数组，数组中的元素必须是字符串
    'minimum',//	这是约束的值，并代表可接受的最小值
    'exclusiveMinimum',//	如果“exclusiveMinimum”的存在，并且具有布尔值true的实例是有效的，如果它是严格的最低限度的值
    'maximum',//这是约束的值被提上表示可接受的最大值
    'exclusiveMaximum',//	如果“exclusiveMaximum”的存在，并且具有布尔值true的实例是有效的，如果它是严格的值小于“最大”。
    'multipleOf',//	数值实例有效反对“multipleOf”分工的实例此关键字的值，如果结果是一个整数。
    'maxLength',//	字符串实例的长度被定义为字符的最大数目
    'minLength',//	字符串实例的长度被定义为字符的最小数目
    'pattern',//	String实例被认为是有效的，如果正则表达式匹配成功实例

    'maxProperties',//	最大属性个数
    'minProperties',//	最小属性个数
    'additionalProperties',//	如果待校验JSON对象中存在，既没有在properties中被定义，又没有在patternProperties中被定义，那么这些一级key必须通过additionalProperties的校验。true or false or object 参考

    'items',//	array 每个元素的类型
    'minItems',//	约束属性，数组最小的元素个数
    'maxItem',//s	约束属性，数组最大的元素个数
    'uniqueItems',//	约束属性，每个元素都不相同
    'additionalProperties',//	约束items的类型，不建议使用 示例
    'Dependencies',//	属性依赖 用法
    'patternProperties',//

    'maxLength',//		定义字符串的最大长度，>=0
    'minLength',//		定义字符串的最小长度，>=0
    'pattern',//		用正则表达式约束字符串，只有待校验JSON元素符合该关键字指定的正则表达式，才算通过校验
    'format',//		字符串的格式

    'minimum',//		最小值
    'exclusiveMinimum',//		如果存在 "exclusiveMinimum" 并且具有布尔值 true，如果它严格意义上大于 "minimum" 的值则实例有效。
    'maximum',//		约束属性，最大值
    'exclusiveMaximum',//		如果存在 "exclusiveMinimum" 并且具有布尔值 true，如果它严格意义上小于 "maximum" 的值则实例有效。
    'multipleOf',//		是某数的倍数，必须大于0的整数

    '$ref',// 用来引用其他的schema
    'definitions',// 当一个schema写的很大的时候，可能需要创建内部结构体，再使用$ref进行引用
    'allOf', // 该关键字的值是一个非空数组，数组里面的每个元素都必须是一个有效的JSON Schema。 只有待校验JSON元素通过数组中所有的JSON Schema校验，才算真正通过校验。意思是展示全部属性，建议用requires替代，不建议使用
    'anyOf',// 该关键字的值是一个非空数组，数组里面的每个元素都必须是一个有效的JSON Schema。如果待校验JSON元素能够通过数组中的任何一个JSON Schema校验，就算通过校验。意思是展示任意属性，建议用requires替代和minProperties替代
    'oneOf', // 该关键字的值是一个非空数组，数组里面的每个元素都必须是一个有效的JSON Schema。如果待校验JSON元素能且只能通过数组中的某一个JSON Schema校验，才算真正通过校验。不能通过任何一个校验和能通过两个及以上的校验，都不算真正通过校验。
    'not',// 该关键字的值是一个JSON Schema。只有待校验JSON元素不能通过该关键字指定的JSON Schema校验的时候，待校验元素才算通过校验。
    'default',
];

export default Schema;
