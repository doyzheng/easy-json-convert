// 对象嵌套对象
module.exports = {
    '*string': {
        type: 'string',
        default: 'abc',
        '@filter': val => {
            return val + val + val;
        },
    },
    '*number': {
        type: 'number',
        default: 123456,
        '@filter': val => {
            return val + val + val;
        },
    },
    '*boolean': {
        type: 'boolean',
        default: true,
        '@filter': val =>  {
            return !val;
        },
    },
    '*array': {
        type: 'array',
        default: [1, 2, 3, 4],
        '@filter': val =>  {
            return [...val, ...val];
        },
    },
    '*object': {
        type: 'object',
        default: {
            string: 'abc',
            name: 'name',
        },
        '@filter': val =>  {
            val.string += val.string;
            val.number = parseInt(val.number) * 100;
            return val;
        },
    },
};
