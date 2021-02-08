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
    if (!(this instanceof Convert)) {
        return new Convert(input, jsonSchema, options);
    }

    // 合并配置项
    this.options = merge({}, Convert.config, options);

    //  上下文执行环境，方便在过滤器中使用convert,Schema方法
    this.context = new Context;

    return this.parse(input, jsonSchema);
}

/**
 * 全局默认配置
 */
Convert.config = Object.create(null);

/**
 * 默认返回值
 * @type {{number: number, boolean: boolean, string: string, null: null}}
 */
Convert.config.defaults = {
    string: '',
    number: 0,
    boolean: false,
    null: null,
};

/**
 * 默认过滤器
 */
Convert.config.filters = {
    string: function(val) {
        return includes([undefined, null], val) ? '' : String(val);
    },
    number: function(val) {
        return includes([undefined, null, ''], val) ? 0 : Number(val);
    },
    boolean: function(val) {
        return Boolean(val);
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
};

/**
 * 是否冗余字段
 * @type {boolean}
 */
Convert.config.redundancy = false;

/**
 * 解析入口
 * @param input
 * @param schema
 * @returns {Array|Object}
 */
Convert.prototype.parse = function(input, schema) {

    if (isEmptyObject(schema)) {
        return input;
    }

    if (!isSchema(schema)) {
        schema = new Schema(schema);
    }

    // 处理对象类型
    if (isObjectSchema(schema)) {
        return this.parseObject(input, schema);
    }

    // 处理数组类型
    if (isArraySchema(schema)) {
        return this.parseArray(input, schema);
    }
};

/**
 * 根据描述对象获取用于取出输入数据的字段名
 * @param {Object} schema
 * @returns {String}
 */
Convert.prototype.getInputKey = function(schema) {
    return Schema.getAttribute(schema, 'alias') || Schema.getAttribute(schema, 'name');
};

/**
 * 根据描述对象获取输入值
 * @param {Object|Array} input
 * @param {Object} schema
 * @return {*}
 */
Convert.prototype.getValue = function(input, schema) {
    var key = this.getInputKey(schema);

    // 只有属性存在时才能获取属性值
    if (hasOwnProperty(input, key)) {
        // 处理过滤器
        this.handleFilter(input, schema);

        // 处理枚举值
        this.handleEnums(input, schema);

        return input[key];
    }

    // 未定义
    return this.getDefault(schema);
};

/**
 * 处理枚举值
 * @param input
 * @param schema
 */
Convert.prototype.handleEnums = function(input, schema) {
    var enums = Schema.getAttribute(schema, 'enums');
    //  验证是否含义枚举值
    if (isEmptyArray()) {
        return;
    }
    var key = this.getInputKey(schema);

    for (var i in enums) {
        var item = enums[i];

        // 根据枚举值定义类型，转换正确枚举值
        var inputFilter = this.options.filters[item.input_type];
        var outputFilter = this.options.filters[item.output_type];
        if (isFunction(inputFilter)) {
            item.input_value = inputFilter(item.input_value);
        }
        if (isFunction(outputFilter)) {
            item.output_value = outputFilter(item.output_value);
        }

        if (input[key] === item.input_value) {
            input[key] = item.output_value;
            return;
        }
    }
};

/**
 * 处理过滤器
 * @param input
 * @param schema
 */
Convert.prototype.handleFilter = function(input, schema) {
    var key = this.getInputKey(schema);
    var value = input[key];

    // 使用自定义过滤器返回数据
    var filter = Schema.getAttribute(schema, 'filter') || this.options.filters[schema.type];
    if (isFunction(filter)) {
        input[key] = filter.call(this.context, value, input, schema);
    }
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
    var defaults = this.options.defaults;
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
        this.forEach(schema.properties, function(prop, key) {
            res[key] = this.getDefault(prop);
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
Convert.prototype.parseObject = function(input, schema) {
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
    this.forEach(schema.properties, function(prop, key) {
        var inputKey = this.getInputKey(prop);

        // 如果输出字段存在输出字段中
        if (hasOwnProperty(input, inputKey)) {
            var value = this.getValue(input, prop);

            // 对象结构再次解析
            if (isObjectSchema(prop)) {
                output[key] = this.parseObject(value, prop);
            }
            else if (isArraySchema(prop)) {
                output[key] = this.parseArray(value, prop);
            }
            else {
                // 基本类型直接赋值
                output[key] = value;
            }
        }
        // 如果字段必须存在的，取默认值
        else if (includes(schema.required, key)) {
            output[key] = this.getDefault(prop);
        }
    });

    // 处理冗余数据
    if (this.options.redundancy) {
        var redundancy = JSON.parse(JSON.stringify(input));
        // 遍历属性
        this.forEach(schema.properties, function(prop) {
            var inputKey = this.getInputKey(prop);
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
Convert.prototype.parseArray = function(input, schema) {
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
        return input.map.call(this, function(item) {
            return this.parseObject(item, schema.items);
        });
    }

    return input;
};

Convert.prototype.forEach = function(obj, callback) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            callback.call(this, obj[key], key, obj);
        }
    }
};

export default Convert;
