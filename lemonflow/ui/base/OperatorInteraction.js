var OperatorInteraction = (function () {
    function OperatorInteraction() {
        this.group = null;
        this.active = true;
        this.doTween = false;
        this.sortByZ = false;
        this.tween = false;
        this.inFocus = false;
    }
    OperatorInteraction.prototype.setup = function (slots) {
        if (typeof slots === "undefined") { slots = null; }
    };
    OperatorInteraction.prototype.update = function (slots, currentIdx, nextIndex) {
        if (typeof slots === "undefined") { slots = null; }
        if (typeof currentIdx === "undefined") { currentIdx = 0; }
        if (typeof nextIndex === "undefined") { nextIndex = 0; }
    };
    OperatorInteraction.prototype.processUserInput = function (e) {
        if (typeof e === "undefined") { e = null; }
    };
    return OperatorInteraction;
})();
