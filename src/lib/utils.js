/**
 * 支持的类型
 * @type {string[]}
 */
export var supportType = [
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
export var getType = function(value) {
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
export var isSchema = function(obj) {
    return isObject(obj) && supportType.indexOf(obj.type) !== -1;
};

/**
 * 检查值是否为对象
 * @param {*} obj
 * @returns {Boolean}
 */
export var isObject = function(obj) {
    return obj !== null && !isArray(obj) && typeof obj === 'object';
};

/**
 * 检查变量是否为函数
 * @param {Function} fun
 * @returns {boolean}
 */
export var isFunction = function(fun) {
    return typeof fun === 'function';
};

/**
 * 检查值是否数组类型
 * @param {*} arr
 * @return {Boolean}
 */
export var isArray = function(arr) {
    return Array.isArray(arr);
};

/**
 * 是否为空数组
 * @param {Array} arr
 * @returns {boolean}
 */
export var isEmptyArray = function(arr) {
    return isArray(arr) && arr.length === 0;
};

/**
 * 是否为空对象
 * @param {Object} obj
 * @returns {boolean}
 */
export var isEmptyObject = function(obj) {
    return isObject(obj) && isEmptyArray(Object.keys(obj));
};

/**
 * 检查是否在数组中
 * @param {Array} arr
 * @param {*} val
 * @return {boolean}
 */
export var includes = function(arr, val) {
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
export var hasOwnProperty = function(obj, key) {
    return isObject(obj) && obj.hasOwnProperty(key);
};

/**
 * 遍历对象/数组
 * @param {Object|Array} obj
 * @param {Function} callback
 */
export var forEach = function(obj, callback) {
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
export var isObjectSchema = function(schema) {
    return !!(isObject(schema) && isObject(schema.properties) && schema.type === 'object');
};

/**
 * 是否为数组结构
 * @param {Object} schema
 * @returns {boolean}
 */
export var isArraySchema = function(schema) {
    return !!(isObject(schema) && isObject(schema.items) && schema.type === 'array');
};

/**
 * 合并对象
 * @param target
 * @param second
 * @returns {*}
 */
export var merge = function(target, second) {
    for (var key in second) {
        if (second.hasOwnProperty(key)) {
            target[key] = target[key] && target[key].toString() === '[object Object]' ?
                merge(target[key], second[key]) : target[key] = second[key];
        }
    }
    return target;
};

/**
 * 导出全部
 */
export default {
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
};