/// <reference path="../../lemonflow.ts" />
var InteractionState = (function () {
    function InteractionState() {
        this.view = null;
        this._selectedIndex = 0;
        this._oldSelectedIndex = 0;
        this._initSelectedIndex = 0;
        this._currentIndex = 0;
        this._direction = 0;
        this._selectedState = 0;
        this._oldSelectedState = 0;
        this._initState = 0;
        this._currentState = 0;
        this._currentIndex = this._selectedIndex = this._oldSelectedIndex = this._initSelectedIndex;
    }
    InteractionState.prototype.scrollRelative = function (step, duration) {
        if (typeof step === "undefined") { step = 0; }
        if (typeof duration === "undefined") { duration = -1; }
        if (this._selectedIndex + step < 0)
            return false;
        this._oldSelectedIndex = this._selectedIndex;
        this._selectedIndex += step;
        this.transitionToIndex(duration);
        return true;
    };

    InteractionState.prototype.scrollAbsolute = function (target, duration) {
        if (typeof target === "undefined") { target = 0; }
        if (typeof duration === "undefined") { duration = -1; }
        if (target < 0)
            return false;
        this._oldSelectedIndex = this._selectedIndex;
        this._selectedIndex = target;
        this.transitionToIndex(duration);
        return true;
    };

    InteractionState.prototype.transitionToIndex = function (duration) {
        if (this._currentIndex != this._selectedIndex) {
            this._direction = this._selectedIndex - this._oldSelectedIndex;
            //            Tweener.addTween(this, {
            //                currentIndex:	this._selectedIndex,
            //                time: duration!=-1?duration:(this.view.transitionDuration/1000),
            //                transition: this.view.easing, onUpdate:this.view.invalidate});
        }
    };

    InteractionState.prototype.set_component = function (c) {
        this.view = c;
    };

    InteractionState.prototype.set_initSelectedIndex = function (s) {
        this._selectedIndex = this._initSelectedIndex = s;
    };
    InteractionState.prototype.get_initSelectedIndex = function () {
        return this._initSelectedIndex;
    };
    InteractionState.prototype.set_selectedIndex = function (s) {
        this.scrollAbsolute(s);
    };
    InteractionState.prototype.get_selectedIndex = function () {
        return this._selectedIndex;
    };
    InteractionState.prototype.set_currentIndex = function (s) {
        this._currentIndex = s;
    };
    InteractionState.prototype.get_currentIndex = function () {
        return this._currentIndex;
    };

    InteractionState.prototype.get_direction = function () {
        return this._direction;
    };
    InteractionState.prototype.get_oldSelectedIndex = function () {
        return this._oldSelectedIndex;
    };
    return InteractionState;
})();
