var GroupRenderer_ThreejsWebGl = (function () {
    function GroupRenderer_ThreejsWebGl(surface, useParent) {
        this.slots = [];
        this.transitioner = -1;
        this.rendererCanvas = null;
        this.perspectiveTransform = { x: 400, y: 240, f: 60 };
    }
    GroupRenderer_ThreejsWebGl.prototype.newChild = function (factory) {
        //        var ri = factory.newInstance();
        var vi = new VisualItem();
        vi.render = ri;
        slots.push(vi);
        return vi;
    };

    GroupRenderer_ThreejsWebGl.prototype.newChildList = function (factory, number) {
        for (var i = 0; i < number; i++)
            newChild(factory);
    };

    GroupRenderer_ThreejsWebGl.prototype.update = function (slots) {
        var values;
        var child;
        var i = 0;

        for (i = 0; i < slots.length; i++) {
            values = slots[i];
            child = childRenderers[i];
            if (transitioner == -1) {
                child.x = values.x;
                child.y = values.y;
                child.z = values.z;
                child.alpha = values.alpha;
                child.visible = values.visible;
                child.rotationY = values.rotationY;
                child.rotationX = values.rotationX;
                child.rotationZ = values.rotationZ;
                child.scaleX = values.scaleX;
                child.scaleY = values.scaleY;
            } else {
                TweenMax.to(child, transitioner, {
                    x: values.x,
                    y: values.y,
                    z: values.z,
                    alpha: values.alpha,
                    visible: values.visible,
                    rotationY: values.rotationY,
                    rotationX: values.rotationX,
                    rotationZ: values.rotationZ,
                    scaleX: values.scaleX,
                    scaleY: values.scaleY,
                    ease: Quad.easeInOut
                });
            }
        }
    };
    return GroupRenderer_ThreejsWebGl;
})();
;
var ItemRenderer_ThreeWebGl = (function () {
    function ItemRenderer_ThreeWebGl(surface, factory) {
        this.nativeObject = null;
        this.nativeObjectMat = null;
        this.visualItem = null;
        this.factory = "";
        vi = new VisualItem();
        vi.render = this;
        vi.factory = factory;

        setup(surface);
        update(vi);
    }
    ItemRenderer_ThreeWebGl.prototype.setup = function (surface) {
        var texture = THREE.ImageUtils.loadTexture("assets/" + vi.factory);
        nativeObjectMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        nativeObject = new THREE.Mesh(new THREE.PlaneGeometry(1000, 450), material);
        nativeObject.doubleSided = true;

        surface.add(nativeObject);
    };

    ItemRenderer_ThreeWebGl.prototype.update = function (values) {
        nativeObject.x = values.x;
        nativeObject.y = values.y;
        nativeObject.z = values.z;
        nativeObject.rotationY = values.rotationY;
        nativeObject.rotationX = values.rotationX;
        nativeObject.rotationZ = values.rotationZ;
        //        nativeObject.alpha = values.alpha;
        //        nativeObject.visible = values.visible;
        //        nativeObject.scaleX = values.scaleX;
        //        nativeObject.scaleY = values.scaleY;
        //			trace("update child ["+this+"]: { x-" + values.x + " y-"+ values.y + " z-"+ values.z + " v-"+ values.visible + " a-"+ values.alpha +"}");
    };
    return ItemRenderer_ThreeWebGl;
})();
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
