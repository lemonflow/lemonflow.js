/// <reference path="../../lemonflow.ts" />
var BaseTransition = (function () {
    function BaseTransition(s) {
        this.operatorUpdateFunction = function () {
        };
        this.operatorCompleteFunction = function () {
        };
        this.scheduler = s;
    }
    BaseTransition.prototype.run = function (e) {
        if (typeof e === "undefined") { e = null; }
    };
    return BaseTransition;
})();
