module.exports = {
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
};
