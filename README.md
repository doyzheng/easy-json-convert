#### 安装 npm install easy-json-convert

#### 使用方法
##### 1 使用@符合指定别名
```
var jsonConvert  = require('easy-json-convert');

var input = {
                "string": "abc",
                "number": 123456,
                "boolean": true,
                "null": null,
                "array": [],
                "object": {}
            }

var jsonTemplate = {
                'str@string': 'abc',
                'num@number': 123456,
                'bool@boolean': true,
                'empty@null': null,
                'arr@array': [],
                'obj@object': {},
}

jsonConvert(input, jsonTemplate);

输出
{
    "str": "abc",
    "num": 123456,
    "bool": true,
    "empty": null,
    "arr": [],
    "obj": {}
}
 
```
##### 2 使用*号标记为必须项，无论输入数据是否包含，输出数据中都会存在（根据模板定义的类型，返回对应的默认值）

```

var input = {
    "string": "abc",
    "number": 123456,
    "boolean": true,
    "null": null,
    "array": [],
    "object": {}
}

var template = {
    '*str': 'abc',
    '*num': 123456,
    '*bool': true,
    '*empty': null,
    '*arr': [],
    '*obj': {},
};

jsonConvert(input, jsonTemplate);

输出
{
    "str": "",
    "num": 0,
    "bool": false,
    "empty": null,
    "arr": [],
    "obj": {}
}

```
##### 3 指定默认值，输入字段不存在时，返回自定义默认值

```
var input = {
    "string": "abc",
    "number": 123456,
    "boolean": true,
    "null": null,
    "array": [],
    "object": {}
}

var template = {
    '*string': {
        type: 'string',
        default: 'abc',
    },
    '*num': {
        type: 'string',
        default: 123456,
    },
    '*bool': {
        type: 'string',
        default: true,
    },
    '*empty': {
        type: 'string',
        default: null,
    },
    '*arr': {
        type: 'string',
        default: [1, 2, 3, 4],
    },
    '*obj': {
        type: 'object',
        default: {a: 1, b: 2},
    },
}

jsonConvert(input, jsonTemplate);

输出
{
    "string": "abc",
    "num": 123456,
    "bool": true,
    "empty": null,
    "arr": [
        1,
        2,
        3,
        4
    ],
    "obj": {
        "a": 1,
        "b": 2
    }
}
```
##### 4 指定全局默认值，输入字段不存在时，返回自定义默认值
```
var input = {
} 

var template = {
    "*string": "abc",
    "*number": 123456,
    "*boolean": true,
    "*null": null,
    "*array": [],
    "*object": {}
}

jsonConvert(input, jsonTemplate);

输出

{
    "string": "default",
    "number": 123456,
    "boolean": true,
    "null": null,
    "array": [0, 1, 2],

    "object": {
        "default": "default"
    }
}

```
