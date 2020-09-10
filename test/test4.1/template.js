module.exports = {
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
};
