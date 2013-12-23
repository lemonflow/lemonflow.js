function GroupRenderer_QtScenegraph(surface) {
    this.childRenderers = []; //Array of VisualItems to be rendered
    this.transitioner = -1;

    //the rendering surface
    this.rendererCanvas = {};
    this.perspectiveTransform    = {x:400, y:240, f:60};

    this.rendererCanvas = surface;
    this.factory = null;

//    this.setRenderSurface = function(surfaceContainer) {
//        rendererCanvas = surface;
//        //          var p:PerspectiveProjection = new PerspectiveProjection();
//        //          p.fieldOfView = perspectiveTransform.f;
//        //          p.projectionCenter= new Point(perspectiveTransform.x, perspectiveTransform.y);
//        //          _renderSurface.transform.perspectiveProjection = p;
//    }

//    this.addChild = function(v) {
//        v.render= Qt.createComponent(v.factory);
//        rendererCanvas.addChild(v.render);

//    }

    this.removeChild = function(v) {
        v.destroy(0);
    }

    this.newChildList = function(factory, number) {
        for(var i=0; i<number; i++)
            newChild(factory);
    }

    this.newChildFinish = function() {
        var ri = this.factory.createObject(this.rendererCanvas, {"x": 0, "y": 0});
        this.childRenderers.push(ri);
        return ri;
    }

    this.newChild = function(factory) {
        this.factory = factory;
        if(this.factory.status == 3) {
            this.factory.statusChanged.connect(this.newChildFinish);
        }
        else {
            return this.newChildFinish();
        }

//        var vi = new VisualItem();
//        vi.render = ri;
//        return vi;
    }



//    this.validateDisplayList = function(slots) {
//        var values;
//        var child;
//        var i = 0;


//        for(i=0; i< slots.length; i++) {
//            values = slots[i];
//            child = childRenderers[i];
//            if(transitioner == -1) {
//                child.x = values.x;
//                child.y = values.y;
//                child.z = values.z;
//                child.alpha = values.alpha;
//                child.visible = values.visible;
//                child.rotationY = values.rotationY;
//                child.rotationX = values.rotationX;
//                child.rotationZ = values.rotationZ;
//                child.scaleX = values.scaleX;
//                child.scaleY = values.scaleY;
//            } else {
//                TweenMax.to(child, transitioner, {
//                                x:values.x,
//                                y:values.y,
//                                z:values.z,
//                                alpha:values.alpha,
//                                visible:values.visible,
//                                rotationY:values.rotationY,
//                                rotationX:values.rotationX,
//                                rotationZ:values.rotationZ,
//                                scaleX:values.scaleX,
//                                scaleY:values.scaleY,
//                                ease:Quad.easeInOut
//                            });
//            }
//        }
//    }

//    this.sortLayeringByZ() = function {
//        var sc = new Array(childRenderers.length);
//        var f1 = function (d, idx, v ) { sc[idx] = d;};
//        childRenderers.forEach(f1);


//        sc.sort(function(b1, b2) {return (b1.z < b2.z)?1:(b1.z > b2.z?-1:0);  } );
//        var f2 = function(item, index, vector) { rendererCanvas.setChildIndex(item, index); };
//        sc.forEach(f2);
//    }
};


