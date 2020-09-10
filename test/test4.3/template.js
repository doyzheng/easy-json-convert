module.exports = {
    '*string': '',
    '*num': 0,
    '*bool': false,
    '*empty': null,
    '*arr': {
        type: 'array',
        default: [1, 2, 3, 4],
    },
    '*obj': {
        type: 'object',
        default: {a: 1, b: 2},
    },
};
