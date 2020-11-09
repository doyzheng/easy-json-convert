import Schema from './schema';
import Context from './context';
import {
    isSchema,
    isObject,
    isFunction,
    isArray,
    isEmptyArray,
    isEmptyObject,
    includes,
    hasOwnProperty,
    forEach,
    isObjectSchema,
    isArraySchema,
    merge,
} from './utils';

/**
 * 把给定JSON数据，转换成描述对象一致的结构
 * @param {Object} input                        待过滤数据
 * @param {Object} jsonSchema                       描述对象
 * @param {Object} options                      可选配置项
 * @param {Object} options.redundancy           是否保留冗余属性，默认false
 * @param {Object} options.defaults             基本数据类型默认定义
 * @param {*} options.defaults.string           字符串类型默认值，默认''
 * @param {*} options.defaults.number           数字类型默认值，默认0
 * @param {*} options.defaults.boolean          布尔类型默认值，默认false
 * @param {*} options.defaults.null             null类型默认值，默认null
 * @param {Object} options.filters              数据过滤方法
 * @param {Function} options.filters.string     字符串类型转换方法，，默认内部处理
 * @param {Function} options.filters.number     数字类型转换方法，，默认内部处理
 * @param {Function} options.filters.boolean    布尔类型转换方法，，默认内部处理
 * @param {Function} options.filters.null       null类型转换方法，，默认内部处理
 * @param {Function} options.filters.array      数组类型转换方法，，默认内部处理
 * @param {Function} options.filters.object     对象类型转换方法，默认内部处理
 * @return {Array|Object}
 */
function Convert(input, jsonSchema, options) {
    if (!jsonSchema) {
        return input;
    }

    // 合并配置项
    options = merge({}, Convert.config, options);

    /**
     * 上下文执行环境，方便在过滤器中使用convert,Schema方法
     */
    var context = new Context;

    /**
     * @param input
     * @param schema
     * @returns {Array|Object}
     */
    var parse = function(input, schema) {

        if (isEmptyObject(schema)) {
            return input;
        }

        if (!isSchema(schema)) {
            schema = new Schema(schema);
        }

        // 处理对象类型
        if (isObjectSchema(schema)) {
            return parseObject(input, schema);
        }

        // 处理数组类型
        if (isArraySchema(schema)) {
            return parseArray(input, schema);
        }
    };

    /**
     * 根据描述对象获取用于取出输入数据的字段名
     * @param {Object} schema
     * @returns {String}
     */
    var getInputKey = function(schema) {
        return Schema.getAttribute(schema, 'alias') || Schema.getAttribute(schema, 'name');
    };

    /**
     * 根据描述对象获取输入值
     * @param {Object|Array} input
     * @param {Object} schema
     * @return {*}
     */
    var getValue = function(input, schema) {
        var key = getInputKey(schema);

        // 只有属性存在时才能获取属性值
        if (hasOwnProperty(input, key)) {

            // 处理枚举值
            handleEnums(input, schema);

            // 处理过滤器
            return handleFilter(input, schema);
        }

        // 未定义
        return getDefault(schema);
    };

    /**
     * 处理枚举值
     * @param input
     * @param schema
     */
    var handleEnums = function(input, schema) {
        var enums = Schema.getAttribute(schema, 'enums');
        if (isEmptyArray(enums)) {
            return;
        }

        var key = getInputKey(schema);

        for (var k in enums) {
            var item = enums[k];
            if (item.name === input[key]) {
                input[key] = item.value;
                return;
            }
        }
    };

    /**
     * 处理过滤器
     * @param input
     * @param schema
     * @returns {*}
     */
    var handleFilter = function(input, schema) {
        var key = getInputKey(schema);
        var value = input[key];

        // 使用自定义过滤器返回数据
        var filter = Schema.getAttribute(schema, 'filter') || options.filters[schema.type];
        if (isFunction(filter)) {
            return filter.call(context, value, input, schema);
        }

        // 使用默认过滤器
        return value;
    };

    /**
     * 根据描述结构获取默认值
     * @param {Object} schema
     * @returns {*}
     */
    var getDefault = function(schema) {
        if (hasOwnProperty(schema, 'default')) {
            return schema.default;
        }

        //  基本数据类型默认值定义
        var defaults = options.defaults;
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
            forEach(schema.properties, function(prop, key) {
                res[key] = getDefault(prop);
            });
            return res;
        }
    };

    /**
     * 解析对象
     * @param {Object|Array} input
     * @param {Object} schema
     * @returns {Object|Array}
     */
    var parseObject = function(input, schema) {
        input = isObject(input) ? input : {};

        if (!isObjectSchema(schema)) {
            return input;
        }

        // 如果描述对象中不包含任何属性直接返回输入数据
        if (isEmptyObject(schema.properties)) {
            return input;
        }

        // 待输出数据
        var output = {};

        // 遍历属性
        forEach(schema.properties, function(prop, key) {
            var inputKey = getInputKey(prop);

            // 如果输出字段存在输出字段中
            if (hasOwnProperty(input, inputKey)) {
                var value = getValue(input, prop);

                // 对象结构再次解析
                if (isObjectSchema(prop)) {
                    output[key] = parseObject(value, prop);
                }
                else if (isArraySchema(prop)) {
                    output[key] = parseArray(value, prop);
                }
                else {
                    // 基本类型直接赋值
                    output[key] = value;
                }
            }
            // 如果字段必须存在的，取默认值
            else if (includes(schema.required, key)) {
                output[key] = getDefault(prop);
            }
        });

        // 处理冗余数据
        if (options.redundancy) {
            var redundancy = JSON.parse(JSON.stringify(input));
            // 遍历属性
            forEach(schema.properties, function(prop) {
                var inputKey = getInputKey(prop);
                // 如果输出字段存在输出字段中
                if (hasOwnProperty(input, inputKey)) {
                    // 删除匹配到的字段，剩余的都是冗余字段
                    delete redundancy[inputKey];
                }
            });
            merge(output, redundancy);
        }

        return output;
    };

    /**
     * 解析数组
     * @param {Array} input
     * @param {Object} schema
     * @returns {Array}
     */
    var parseArray = function(input, schema) {
        input = isArray(input) ? input : [];

        if (!isArraySchema(schema)) {
            return input;
        }

        var output = [];

        // 如果输入数据是空数组，没有必要继续遍历，直接返回空数组
        if (isEmptyArray(input)) {
            return output;
        }

        // 如果是数组对象
        if (isObjectSchema(schema.items)) {
            return input.map(function(item) {
                return parseObject(item, schema.items);
            });
        }

        return input;
    };

    return parse(input, jsonSchema);
}

/**
 * 全局默认配置
 */
Convert.config = {
    // 默认返回值
    defaults: {
        string: '',
        number: 0,
        boolean: false,
        null: null,
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
            if (val === 'true') {
                return true;
            }
            if (val === 'false') {
                return true;
            }
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
    },
    // 是否冗余字段
    redundancy: false,
};

export default Convert;
