var VisualItem = (function () {
    function VisualItem() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.alpha = 1;
        this.visible = true;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.data = new Object();
        this.render = null;
        this.factory = null;
        this._renderer = null;
    }
    VisualItem.prototype.set_renderer = function (r) {
        this._renderer = r;
        this.dirty();
    };

    VisualItem.prototype.dirty = function () {
    };
    VisualItem.prototype.commitChanges = function () {
        //			if (_dirty != DIRTY) return;
        //			_dirty = VISIT;
        //			render();
    };
    return VisualItem;
})();
