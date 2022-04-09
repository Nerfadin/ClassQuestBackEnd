"use strict";
exports.__esModule = true;
exports.StatisticsUtils = void 0;
var StatisticsUtils = /** @class */ (function () {
    function StatisticsUtils() {
    }
    StatisticsUtils.prototype.getRandomResult = function (probability) {
        var result = Math.random() * (100 + 0);
        console.log(result);
    };
    return StatisticsUtils;
}());
exports.StatisticsUtils = StatisticsUtils;
