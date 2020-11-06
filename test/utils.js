var fs = require('fs');
var assert = require('assert').strict;
var recast = require('recast');

/**
 * 打印输出并结束程序
 */
function exit() {
    [...arguments].forEach(item => {
        if (typeof item === 'object') {
            console.log(formatJson(JSON.stringify(item)), '\r\n');
        }
        else {
            console.log(item, '\r\n');
        }
    });
    process.exit();
}

/**
 * 输入数据写到文件中
 * @param filename
 * @param data
 */
function writeFileSync(filename, data) {
    if (data) {
        fs.writeFileSync(filename, typeof data === 'object' ? formatJson(data) : data);
    }
}

/**
 * 格式化json数据
 * @param json
 * @returns {string}
 */
function formatJson(json) {
    return JSON.stringify(json, null, 4);
}

/**
 * 描述对象数据写到文件中
 * @param dirname
 * @param schema
 */
function writeSchemaFile(dirname, schema) {
    writeFileSync(dirname + '/schema.json', schema);
}

/**
 * 输出数据写到文件中
 * @param dirname
 * @param output
 */
function writeOutputFile(dirname, output) {
    writeFileSync(dirname + '/output.json', output);
}

/**
 * 验证描述对象是否相同
 * @param val
 * @param schema
 * @param dirname
 */
function deepEqualSchema(val, schema, dirname) {
    if (Object.keys(schema).length === 0) {
        writeSchemaFile(dirname, val);
        schema = val;
    }
    assert.deepEqual(val, schema);
}

/**
 * 验证输出数据是否相同
 * @param val
 * @param output
 * @param dirname
 */
function deepEqualOutput(val, output, dirname) {
    if (Object.keys(output).length === 0) {
        writeOutputFile(dirname, val);
        output = val;
    }
    assert.deepEqual(val, output);
}

module.exports.exit = exit;
module.exports.formatJson = formatJson;
module.exports.writeFileSync = writeFileSync;
module.exports.deepEqualSchema = deepEqualSchema;
module.exports.deepEqualOutput = deepEqualOutput;

