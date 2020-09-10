'use strict';

var recast = require('recast');

/**
 * @param {Object} input
 * @param {Object|Schema} schema
 * @param options 全局默认配置项
 * @param {String} options.requiredSign         标记必须存在的属性标识
 * @param {String} options.aliasSign            标记别名属性标识
 * @param {Boolean} options.allRequired         默认全部属性必须存在
 * @param {Object} options.defaults             默认取值配置
 * @param {String} options.defaults.string      字符串类型默认值
 * @param {Number} options.defaults.number      数字类型默认值
 * @param {Boolean} options.defaults.boolean    布尔类型默认值
 * @param {Null} options.defaults.null          空类型默认值
 * @param {Object} options.filters              转换值过滤器
 * @param {Function} options.filters.string     字符串类型过滤器
 * @param {Function} options.filters.number     字符串类型过滤器
 * @param {Function} options.filters.boolean    字符串类型过滤器
 * @param {Function} options.filters.null       字符串类型过滤器
 * @param {Function} options.filters.array      字符串类型过滤器
 * @param {Function} options.filters.object     字符串类型过滤器
 * @return {Object}
 * @constructor
 */
var Context = function(input, schema, options) {
    return Context.convert(input, schema, options);
};

/**
 * 把给定JSON数据，转换成描述对象一致的结构
 * @param {Object} input
 * @param {Object|Schema} schema
 * @param {Object} options                      可选配置项
 * @param {Object} options.defaults             默认取值配置
 * @param {String} options.defaults.string      字符串类型默认值
 * @param {Number} options.defaults.number      数字类型默认值
 * @param {Boolean} options.defaults.boolean    布尔类型默认值
 * @param {Null} options.defaults.null          空类型默认值
 * @param {Object} options.filters              转换值过滤器
 * @param {Function} options.filters.string     字符串类型过滤器
 * @param {Function} options.filters.number     字符串类型过滤器
 * @param {Function} options.filters.boolean    字符串类型过滤器
 * @param {Function} options.filters.null       字符串类型过滤器
 * @param {Function} options.filters.array      字符串类型过滤器
 * @param {Function} options.filters.object     字符串类型过滤器
 * @return {Array|Object}
 */
Context.convert = function(input, schema, options) {
    return new Convert(input, schema, options);
};

/**
 * 解析json，转换成可描述对象
 * @param {Object} jsonTemplate
 * @param {Object} options              全局默认配置项
 * @param {String} options.requiredSign 标记必须存在的属性标识
 * @param {String} options.aliasSign    标记别名属性标识
 * @param {Boolean} options.allRequired 默认全部属性必须存在
 * @return {schema}
 */
Context.schema = function(jsonTemplate, options) {
    return new Schema(jsonTemplate, options);
};

/**
 * 支持的类型
 * @type {string[]}
 */
var supportType = [
    'string',
    'number',
    'boolean',
    'null',
    'object',
    'array',
];

/**
 * 获取给定值数据类型
 * @param {*} value
 * @return {String}
 */
var getType = function(value) {
    if (value === null) {
        return null;
    }
    if (supportType.indexOf(typeof value) !== -1) {
        return typeof value;
    }

    return 'string';
};

/**
 * 是否为Schema格式
 * @param {Object} obj
 * @returns {boolean}
 */
var isSchema = function(obj) {
    return isObject(obj) && supportType.indexOf(obj.type) !== -1;
};

/**
 * 检查值是否为对象
 * @param {*} obj
 * @returns {Boolean}
 */
var isObject = function(obj) {
    return obj !== null && !isArray(obj) && typeof obj === 'object';
};

/**
 * 检查变量是否为函数
 * @param {Function} fun
 * @returns {boolean}
 */
var isFunction = function(fun) {
    return typeof fun === 'function';
};

/**
 * 检查值是否数组类型
 * @param {*} arr
 * @return {Boolean}
 */
var isArray = function(arr) {
    return Array.isArray(arr);
};

/**
 * 是否为空数组
 * @param {Array} arr
 * @returns {boolean}
 */
var isEmptyArray = function(arr) {
    return isArray(arr) && arr.length === 0;
};

/**
 * 是否为空对象
 * @param {Object} obj
 * @returns {boolean}
 */
var isEmptyObject = function(obj) {
    return isObject(obj) && isEmptyArray(Object.keys(obj));
};

/**
 * 检查是否在数组中
 * @param {Array} arr
 * @param {*} val
 * @return {boolean}
 */
var includes = function(arr, val) {
    for (var v of arr) {
        if (val === v) {
            return true;
        }
    }
    return false;
};

/**
 * 检查对象是否存在指定属性
 * @param {Object} obj
 * @param {String} key
 * @returns {boolean}
 */
var hasOwnProperty = function(obj, key) {
    return isObject(obj) && obj.hasOwnProperty(key);
};

/**
 * 遍历对象/数组
 * @param {Object|Array} obj
 * @param {Function} callback
 */
var forEach = function(obj, callback) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            callback.call(obj, obj[key], key, obj);
        }
    }
};

/**
 * 格式化json数据
 * @param json
 * @returns {string}
 */
var formatJson = function(json) {
    var code = recast.parse('var json = ' + JSON.stringify(json));
    var data = recast.prettyPrint(code).code;
    return data.substr(11, data.length - 12);
};

/**
 * 工具方法
 * @type {{}}
 */
Context.utils = {
    getType: getType,
    isSchema: isSchema,
    isObject: isObject,
    isFunction: isFunction,
    isArray: isArray,
    isEmptyArray: isEmptyArray,
    isEmptyObject: isEmptyObject,
    includes: includes,
    hasOwnProperty: hasOwnProperty,
    forEach: forEach,
    formatJson: formatJson,
};

/**
 * 根据描述对象获取用于取出输入数据的字段名
 * @param {Object} schema
 * @returns {String}
 */
var getInputKey = function(schema) {
    return schema.alias ? schema.alias : schema.key;
};

/**
 * 是否为对象结构
 * @param {Object} schema
 * @returns {boolean}
 */
var isObjectSchema = function(schema) {
    return !!(isObject(schema) && isObject(schema.properties) && schema.type === 'object');
};

/**
 * 是否为数组结构
 * @param {Object} schema
 * @returns {boolean}
 */
var isArraySchema = function(schema) {
    return !!(isObject(schema) && isObject(schema.items) && schema.type === 'array');
};

/**
 * 把给定JSON数据，转换成描述对象一致的结构
 * @param {Object} input
 * @param {Object|Schema} schema
 * @param {Object} options                      可选配置项
 * @return {Array|Object}
 */
var Convert = function(input, schema, options) {
    /**
     * 配置选项
     * @type {Object}
     */
    this.options = {
        // 默认返回值
        defaults: {
            string: '',
            number: 0,
            boolean: false,
            null: null,
            ...options ? options.defaults : {},
        },
        // 默认过滤器
        filters: {
            string: function(val) {
                return includes([undefined, null], val) ? '' : String(val);
            },
            number: function(val) {
                return includes([undefined, null, ''], val) ? 0 : Number(val);
            },
            boolean: function(val) {
                return includes(['0', ''], val) ? false : Boolean(val);
            },
            null: function(val) {
                return val === null ? val : null;
            },
            array: function(val) {
                return isArray(val) ? val : [];
            },
            object: function(val) {
                return isObject(val) ? val : {};
            },
            ...options ? options.filters : {},
        },
    };

    // 如果不是jsonSchema，转换后再处理
    if (!isSchema(schema)) {
        schema = new Schema(schema, options);
    }

    return this.filter(input, schema);
};

/**
 * 原型链关联上下文
 * @type {function(Object, (Object|Schema), *=): Array|Object}
 */
Convert.prototype.context = Context;

/**
 * 根据给定描述对象，过滤输入数据
 * @param {Object} input  待过滤数据
 * @param {Object} schema 描述对象
 * @param input
 * @param schema
 * @return {Array|Object}
 */
Convert.prototype.filter = function(input, schema) {
    // 处理对象类型
    if (isObjectSchema(schema)) {
        return this.filterObject(input, schema);
    }

    // 处理数组类型
    if (isArraySchema(schema)) {
        return this.filterArray(input, schema);
    }
};

/**
 * 过滤器
 * @param {*} val
 * @param {String} type
 * @returns {*}
 */
Convert.prototype.filters = function(val, type) {
    // 基本数据类型过滤方法
    const filters = this.options.filters;
    if (filters[type]) {
        return filters[type].call(this, val);
    }

    // 如果过滤器不存在直接返回原值
    return val;
};

/**
 * 根据描述对象获取输入值
 * @param {Object|Array} input
 * @param {Object} schema
 * @return {*}
 */
Convert.prototype.getValue = function(input, schema) {
    var key = getInputKey(schema);

    // 只有属性存在时才能获取属性值
    if (hasOwnProperty(input, key)) {
        // 使用自定义过滤器返回数据
        if (isFunction(schema.filter)) {
            return schema.filter.call(this, input[key], schema);
        }

        // 使用默认过滤器
        return this.filters(input[key], schema.type);
    }

    // 未定义
    return this.getDefault(schema);
};

/**
 * 根据描述结构获取默认值
 * @param {Object} schema
 * @returns {*}
 */
Convert.prototype.getDefault = function(schema) {
    if (hasOwnProperty(schema, 'default')) {
        return schema.default;
    }

    //  基本数据类型默认值定义
    const defaults = this.options.defaults;
    if (defaults.hasOwnProperty(schema.type)) {
        return defaults[schema.type];
    }

    // 数组类型默认返回[]
    if (isArraySchema(schema)) {
        return [];
    }

    // 如果是对象，遍历对象的每一个属性，根据定义类型返回每一个默认属性值
    if (isObjectSchema(schema)) {

        if (isEmptyObject(schema.properties)) {
            return {};
        }

        // 递归遍历每个属性
        var res = {};
        forEach(schema.properties, (prop, key) => res[key] = this.getDefault(prop));
        return res;
    }
};

/**
 * 解析对象
 * @param {Object|Array} input
 * @param {Object} schema
 * @returns {Object|Array}
 */
Convert.prototype.filterObject = function(input, schema) {
    input = isObject(input) ? input : {};

    if (!isObjectSchema(schema)) {
        return input;
    }

    // 如果描述对象中不包含任何属性直接返回输入数据
    if (isEmptyObject(schema.properties)) {
        return input;
    }

    var this$1 = this;
    const output = {};

    // 遍历属性
    forEach(schema.properties, function(prop, key) {
        // 如果输出字段存在输出字段中
        if (hasOwnProperty(input, getInputKey(prop))) {
            const value = this$1.getValue(input, prop);
            // 对象结构再次解析
            if (isObjectSchema(prop)) {
                output[key] = this$1.filterObject(value, prop);
            }
            else if (isArraySchema(prop)) {
                output[key] = this$1.filterArray(value, prop);
            }
            else {
                // 基本类型直接赋值
                output[key] = value;
            }
        }
        // 如果字段必须存在的，取默认值
        else if (includes(schema.required, key)) {
            output[key] = this$1.getDefault(prop);
        }
    });

    return output;
};

/**
 * 解析数组
 * @param {Array} input
 * @param {Object} schema
 * @returns {Array}
 */
Convert.prototype.filterArray = function(input, schema) {
    input = isArray(input) ? input : [];

    if (!isArraySchema(schema)) {
        return input;
    }

    var this$1 = this;
    var output = [];

    // 如果输入数据是空数组，没有必要继续遍历，直接返回空数组
    if (isEmptyArray(input)) {
        return output;
    }

    // 如果是数组对象
    if (isObjectSchema(schema.items)) {
        return input.map(function(item) {
            return this$1.filterObject(item, schema.items);
        });
    }

    return input;
};

/**
 *  解析json，转换成可描述对象
 * @param {Object} jsonTemplate         json模板
 * @param {Object} options              全局默认配置项
 * @return {Object}
 */
var Schema = function(jsonTemplate, options) {
    this.options = {
        // 标记必须存在的属性标识
        requiredSign: '*',
        // 标记别名属性标识
        aliasSign: '@',
        // 默认全部属性必须存在
        allRequired: false,
        ...options || {},
    };

    return this.parse(jsonTemplate);
};

/**
 * @type {function(Object, (Object|Schema), *=): Array|Object}
 */
Schema.prototype.context = Context;

/**
 * 解析json格式为json-schema
 * @param {Object} json
 * @param {Object} schema
 * @return {Object}
 */
Schema.prototype.parse = function(json, schema) {
    if (json === undefined) {
        return;
    }
    schema = schema || {};
    // 解析数组
    if (isArray(json)) {
        this.parseArray(json, schema);
    }
    // 解析对象
    else if (isObject(json)) {
        this.parseObject(json, schema);
    }
    else {
        schema.type = getType(json);
    }
    return schema;
};

/**
 * 处理结构
 * @param json
 * @param schema
 */
Schema.prototype.handleSchema = function(json, schema) {
    Object.assign(schema, json);
    if (schema.type === 'object') {
        delete schema.properties;
        if (json.properties) {
            this.parse(json.properties, schema);
        }
    }
    if (schema.type === 'array') {
        delete schema.items;
        schema.items = {};
        if (json.items) {
            this.parse(json.items, schema.items);
        }
    }
};

/**
 * 处理数组
 * @param arr
 * @param schema
 */
Schema.prototype.parseArray = function(arr, schema) {
    schema.type = 'array';
    var props = schema.items = {};
    if (arr.length) {
        this.parse(arr[0], props);
    }
};

/**
 * 处理对象类型
 * @param json
 * @param schema
 */
Schema.prototype.parseObject = function(json, schema) {
    if (isSchema(json)) {
        return this.handleSchema(json, schema);
    }

    var options = this.options;

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
        curSchema.key = newKey;
        this.parse(value, curSchema);
    }
};

module.exports = Context;
