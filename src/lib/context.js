import Schema from './schema';
import Convert from './convert';

/**
 * 把给定JSON数据，转换成描述对象一致的结构
 * @param {Object} input                        待过滤数据
 * @param {Object} schema                       描述对象
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
function Context(input, schema, options) {
    if (this) {
        return {
            convert: Convert,
            schema: Schema,
        };
    }

    return Convert(input, schema, options);
}

// 版本号
Context.version = '1.1.0';

Context.schema = Schema;

Context.convert = Convert;

export default Context;
