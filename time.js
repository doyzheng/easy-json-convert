/**
 * 题目定时器
 * @constructor
 */
function CountTime(time = 1) {
    this.time = time;
    this.interval = 0;
    if (this) {
        CountTime.instances.push(this);
    }
}

/**
 * 启动定时器
 */
CountTime.prototype.start = function() {
    if (this.interval) {
        return;
    }
    this.interval = setInterval(() => {
        this.time++;
    }, 1000);
    // 记录最后一次启动的计时器
    CountTime.lastCountTime = this;
};

/**
 * 停止定时器
 */
CountTime.prototype.stop = function() {
    clearInterval(this.interval);
};

/**
 * 获取累计时间
 * @returns {number}
 */
CountTime.prototype.getTime = function() {
    return this.time;
};

/**
 * 已创建计时器集合
 * @type {*[]}
 */
CountTime.instances = [];

/**
 * 停止全部已创建的计时器
 */
CountTime.stopAll = function() {
    for (let countTime of CountTime.instances) {
        if (countTime instanceof CountTime) {
            countTime.stop();
        }
    }
};

/**
 * 启动全部已创建的计时器
 */
CountTime.startAll = function() {
    for (let countTime of CountTime.instances) {
        if (countTime instanceof CountTime) {
            countTime.start();
        }
    }
};

/**
 * 最后一次启动的计时器
 * @type {null}
 */
CountTime.lastCountTime = null;

/**
 * 启动最后一次启动的计时器
 */
CountTime.startLastCountTime = function() {
    if (CountTime.lastCountTime instanceof CountTime) {
        CountTime.lastCountTime.start();
    }
};

/**
 * 停止最后一次启动的计时器
 */
CountTime.stopLastCountTime = function() {
    if (CountTime.lastCountTime instanceof CountTime) {
        CountTime.lastCountTime.stop();
    }
};

var countTime = new CountTime();

var start = true;

if (start) {
    countTime.start();
}
else {
    countTime.stop();
}

