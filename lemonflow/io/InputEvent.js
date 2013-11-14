var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var InputEvent = (function (_super) {
    __extends(InputEvent, _super);
    function InputEvent(type, bubbles, cancelable) {
        if (typeof type === "undefined") { type = "input"; }
        if (typeof bubbles === "undefined") { bubbles = false; }
        if (typeof cancelable === "undefined") { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
    }
    return InputEvent;
})(Eventl);
