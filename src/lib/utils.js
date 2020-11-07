/**
 * JsonSchema属性名
 * @type {string[]}
 */
export const schemaAttributes = [
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

/**
 * 支持的类型
 * @type {string[]}
 */
export const supportType = [
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
export const getType = function(value) {
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
export const isSchema = function(obj) {
    return isObject(obj) && supportType.indexOf(obj.type) !== -1;
};

/**
 * 检查值是否为对象
 * @param {*} obj
 * @returns {Boolean}
 */
export const isObject = function(obj) {
    return obj !== null && !isArray(obj) && typeof obj === 'object';
};

/**
 * 检查变量是否为函数
 * @param {Function} fun
 * @returns {boolean}
 */
export const isFunction = function(fun) {
    return typeof fun === 'function';
};

/**
 * 检查值是否数组类型
 * @param {*} arr
 * @return {Boolean}
 */
export const isArray = function(arr) {
    return Array.isArray(arr);
};

/**
 * 是否为空数组
 * @param {Array} arr
 * @returns {boolean}
 */
export const isEmptyArray = function(arr) {
    return isArray(arr) && arr.length === 0;
};

/**
 * 是否为空对象
 * @param {Object} obj
 * @returns {boolean}
 */
export const isEmptyObject = function(obj) {
    return isObject(obj) && isEmptyArray(Object.keys(obj));
};

/**
 * 检查是否在数组中
 * @param {Array} arr
 * @param {*} val
 * @return {boolean}
 */
export const includes = function(arr, val) {
    for (var k in arr) {
        if (arr[k] === val) {
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
export const hasOwnProperty = function(obj, key) {
    return isObject(obj) && obj.hasOwnProperty(key);
};

/**
 * 遍历对象/数组
 * @param {Object|Array} obj
 * @param {Function} callback
 */
export const forEach = function(obj, callback) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            callback.call(obj, obj[key], key, obj);
        }
    }
};

/**
 * 是否为对象结构
 * @param {Object} schema
 * @returns {boolean}
 */
export const isObjectSchema = function(schema) {
    return !!(isObject(schema) && isObject(schema.properties) && schema.type === 'object');
};

/**
 * 是否为数组结构
 * @param {Object} schema
 * @returns {boolean}
 */
export const isArraySchema = function(schema) {
    return !!(isObject(schema) && isObject(schema.items) && schema.type === 'array');
};

/**
 * 合并对象
 * @param target
 * @param second
 * @returns {*}
 */
export const merge = function(target, second) {
    for (var key in second) {
        if (second.hasOwnProperty(key)) {
            target[key] = target[key] && target[key].toString() === '[object Object]' ?
                merge(target[key], second[key]) : target[key] = second[key];
        }
    }
    return target;
};

/**
 * 设置schema结构属性值，如果属性名不属于标准schema，则添加@作为属性名前缀
 * @param {Object} schema
 * @param {String} name
 * @param {*} value
 * @returns {*}
 */
export const setSchemaAttribute = function(schema, name, value) {
    if (includes(schemaAttributes, name)) {
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
export const getSchemaAttribute = function(schema, name) {
    if (includes(schemaAttributes, name)) {
        return schema[name];
    }

    return schema['@' + name];
};

/**
 * 导出全部
 */
export default {
    schemaAttributes,
    supportType,
    getType,
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
    setSchemaAttribute,
    getSchemaAttribute,
};
