### 1、 安装 
```
npm install easy-json-convert
```

### 2、使用
``` 
var jsonConvert  = require('easy-json-convert');
```

### 3 API方法

#### 3.1  jsonConvert.convert (input, json|jsonSchema, [options]) json数据转换器
```  
   参数1: 输入数据，任何结构的标准json数据
   参数2：输出结构模板，任何结构的标准json数据或jsonSchema（json描述对象，由jsonConvert.schema方法生成）
   参数3：全局配置options
        * @param {String}   options.requiredSign        标记必须存在的属性标识
        * @param {String}   options.aliasSign           标记别名属性标识
        * @param {Boolean}  options.allRequired         默认全部属性必须存在
        
        * @param {Object}   options.defaults            默认取值配置
        * @param {String}   options.defaults.string     字符串类型默认值
        * @param {Number}   options.defaults.number     数字类型默认值
        * @param {Boolean}  options.defaults.boolean    布尔类型默认值
        * @param {Null}     options.defaults.null       空类型默认值
        
        * @param {Object}   options.filters            转换值过滤器
        * @param {Function} options.filters.string     字符串类型过滤器
        * @param {Function} options.filters.number     字符串类型过滤器
        * @param {Function} options.filters.boolean    字符串类型过滤器
        * @param {Function} options.filters.null       字符串类型过滤器
        * @param {Function} options.filters.array      字符串类型过滤器
        * @param {Function} options.filters.object     字符串类型过滤器
```

#### 3.2 jsonConvert.schema (json,  [options]) 根据指定json数据，生成json描述对象（jsonSchema）

```  
    参数1：待转换的json数据
    参数2：全局配置options
        * @param {String}   options.requiredSign        标记必须存在的属性标识
        * @param {String}   options.aliasSign           标记别名属性标识
        * @param {Boolean}  options.allRequired         默认全部属性必须存在
    
    示例：
    var json = {
         'string': 'abc',
    }
    转换后：
    {
        "type": "object",
        "required": [],
        "properties": {
            "string": {
                "key": "string",
                "type": "string"
            }
        }
    }
```
#### 3.3 jsonConvert(input, json|jsonSchema, [options]) json数据转换器
同jsonConvert.convert方法一样，jsonConvert.convert的简单调用方式（推荐写法），以后的示例中都将使用此方法

### 4 示例

#### 4.1.1 简单使用
##### 根据模板值自动获取字段的类型
```  
var jsonConvert  = require('easy-json-convert');

var input = {
     "string": "abc",
     "number": 123456,
     "boolean": true,
     "null": null,
     "array": [1, 2, 3, 4],
     "object": {
        "name" : "youlu"
    }
}

var template = {
    "string": "",
    "number": 0,
    "boolean": true,
    "null": null,
    "array": [],
    "object": {}
}

jsonConvert(input, template);

// 输出数据
var output = {
    "string": "abc",
    "number": 123456,
    "boolean": true,
    "null": null,
    "array": [1, 2, 3, 4],
    "object": {
       "name" : "youlu"
    }
}
```
#### 4.1.2 自定义字段的数据类型
自动转换成同模板一样的数据类型
```  
var input = {
    "string": "abc",
    "number": "123456",
    "boolean": 1,
    "null": '',
    "array": [1, 2, 3, 4],
    "object": {a: 1, b: 2}
}

var template =  {
    'string': {
        type: 'string',
    },
    'number': {
        type: 'number',
    },
    'boolean': {
        type: 'boolean',
    },
    'null': {
        type: 'null',
    },
    'array': {
        type: 'array',
    },
    'object': {
        type: 'object',
    },
};

jsonConvert(input, template);

// 输出数据
var output = {
    "string": "abc",
    "number": 123456,
    "boolean": true,
    "null": null,
    "array": [1, 2, 3, 4],
    "object": {a: 1, b: 2}
}

```

##### 4.2.1 别名
当输入数据字段名与输出字段名不一致时，可以使用@（可以自定义任何符号，详见4.2.2）指定输入字段的别名
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
    'str@string': 'abc',
    'num@number': 123456,
    'bool@boolean': true,
    'empty@null': null,
    'arr@array': [],
    'obj@object': {},
}

jsonConvert(input, template);

// 输出数据
var output = {
    "str": "abc",
    "num": 123456,
    "bool": true,
    "empty": null,
    "arr": [],
    "obj": {}
}
 
```
##### 4.2.2 使用"|"指定别名
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

var template = {
    'str|string': 'abc',
    'num|number': 123456,
    'bool|boolean': true,
    'empty|null': null,
    'arr|array': [],
    'obj|object': {},
}

jsonConvert(input, template, {
    aliasSign: '|',
});

// 输出数据
var output = {
    "str": "abc",
    "num": 123456,
    "bool": true,
    "empty": null,
    "arr": [],
    "obj": {}
}
 
```

##### 4.3.1 使用*(可以自定义任意符号，详见4.3.3)号标记为必须项
无论输入数据是否包含该字段，输出数据中都会存在（根据模板定义的类型，自动返回对应的默认值）
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

// 输出数据
var output = {
    "str": "",
    "num": 0,
    "bool": false,
    "empty": null,
    "arr": [],
    "obj": {}
}

```
##### 4.3.2 使用allRequired参数
allRequired=true 将标记所有项为必须项，不需要每项前面都添加*号了
```

var input = {
    "api": null,
    "result": "000000",
    "msg": null,
    "data": [
        {
            "id": "PROJECT20191126010000000338",
            "name": "医卫学院",
            "subList": [
                {
                    "id": "PROJECT20191126010000000243",
                    "name": "中医医术确有专长医师",
                    "subList": []
                },
                {
                    "id": "PROJECT20191126010000000405",
                    "name": "中医康复技术",
                    "subList": []
                },
                {
                    "id": "PROJECT20191126010000000168",
                    "name": "中医助理医师",
                    "subList": []
                }
            ]
        },
        {
            "id": "PROJECT20191126010000000333",
            "subList": [
                {
                    "name": "中医医术确有专长医师",
                    "subList": []
                },
                {
                    "id": "PROJECT20191126010000000243",
                    "subList": []
                },
                {
                    "id": "PROJECT20191126010000000243",
                    "name": "中医助理医师"
                }
            ]
        },
        {
           // 这里是个空对象，输出时返回一个同模板一样的结构
        }
    ],
    "seqno": null,
    "seqno2": null,
    "seqno3": null,
    "cid": null,
    "timestamp": null
}

var templatr = {
    'api': '',
    'result': '000000',
    'msg': '',
    'data': [
        {
            'id': 'PROJECT20191126010000000338',
            'name': '医卫学院',
            'subList': [
                {
                    'id': 'PROJECT20191126010000000243',
                    'name': '中医医术确有专长医师',
                    'subList': [],
                },
            ],
        },
    ],
    'seqno': '',
    'cid': '',
    'timestamp': 123,
}

// 输出数据
var output = {
  "api": "",
    "result": "000000",
    "msg": "",
    "data": [
        {
            "id": "PROJECT20191126010000000338",
            "name": "医卫学院",
            "subList": [
                {
                    "id": "PROJECT20191126010000000243",
                    "name": "中医医术确有专长医师",
                    "subList": []
                },
                {
                    "id": "PROJECT20191126010000000405",
                    "name": "中医康复技术",
                    "subList": []
                },
                {
                    "id": "PROJECT20191126010000000168",
                    "name": "中医助理医师",
                    "subList": []
                }
            ]
        },
        {
            "id": "PROJECT20191126010000000333",
            "name": "",
            "subList": [
                {
                    "id": "", // 输入数据不存在ID，根据模板规则将返回一个默认值
                    "name": "中医医术确有专长医师",
                    "subList": []
                },
                {
                    "id": "PROJECT20191126010000000243",
                    "name": "", // 输入数据不存在ID，根据模板规则将返回一个默认值
                    "subList": []
                },
                {
                    "id": "PROJECT20191126010000000243",
                    "name": "中医助理医师",
                    "subList": []
                }
            ]
        },
        {
            // 和模板结构保持一致性
            "id": "",
            "name": "",
            "subList": []
        }
    ],
    "seqno": "",
    "cid": "",
    "timestamp": 0
}
 
```
##### 4.3.3 使用"?"号标记为必须项
无论输入数据是否包含该项，输出数据中都会存在（根据模板定义的类型，自动返回对应的默认值）
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
    '?str': 'abc',
    '?num': 123456,
    '?bool': true,
    '?empty': null,
    '?arr': [],
    '?obj': {},
};

jsonConvert(input, jsonTemplate, {
     requiredSign: '?',
});

// 输出数据
var output = {
    "str": "",
    "num": 0,
    "bool": false,
    "empty": null,
    "arr": [],
    "obj": {}
}

```

##### 4.4.1 全局默认值
只有设置必须项目后才能生效，根据模板值自动获取默认值
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
}

jsonConvert(input, jsonTemplate);

// 输出数据
var output = {
    "str": "",
    "num": 0,
    "bool": false,
    "empty": null,
    "arr": [],
    "obj": {}
}


```

##### 4.4.2 默认值
输入字段不存在时，返回自定义默认值
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

// 输出数据
var output = {
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
##### 4.4.3 全局默认值
输入字段不存在时，根据类型返回全局默认值
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

// 输出数据
var output = {
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

##### 4.5.1 过滤器
``` 
var input = {
    "string": 123456,
    "number": "123456",
    "boolean": "0"
}

var template = {
    'string': {
        type: 'string',
        filter(val) {
            return String(val);
        },
    },
    'number': {
        type: 'number',
        filter(val) {
            return Number(val);
        },
    },
    'boolean': {
        type: 'boolean',
        filter(val) {
            return Boolean(val);
        },
    },
}

// 输出数据
var output = {
    "string": "123456",
    "number": 123456,
    "boolean": true
}

```
