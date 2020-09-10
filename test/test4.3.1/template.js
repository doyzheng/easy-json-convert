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
        '*string': {
            type: 'string',
            default: 'defStr',
        },
        '*num': 0,
        '*bool': false,
        '*empty': null,
        '*arr': [],
        '*obj2': {},
    },
};
