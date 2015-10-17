class GroupRenderer_ThreejsWebGl {
    
    //ui-side
    slots                   = []; //Array of VisualItems to be rendered
    transitioner            = -1;
    rendererCanvas          = null;
    perspectiveTransform	= {x:400, y:240, f:60};
    
    //renderer-side
    surfaces            = [];
    surfaceMaterials    = [];
    
    camera      = null;
    scene       = null;
    renderer    = null;
    lights      = [];
    
    //temrporary
    _texture    = null; 
    _material   = null;
    _plane      = null;
    
    

    constructor(surface, useParent) {
        //check if THREE library is loaded
        if(THREE == undefined) return;
        this.initSurface();
    }

    initSurface() {
        this.renderer = new THREE.WebGLRenderer({ clearColor: 0x232329, clearAlpha: 1, antialias: true });
        this.renderer.autoClear = false;
        this.renderer.setSize(w, h);
        document.getElementById( 'container' ).appendChild( this.renderer.domElement );

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
        this.camera.position.x = 0; this.camera.position.y = -700; this.camera.position.z = 600;
        
        this.lights.push(new THREE.DirectionalLight(0xffffff, 0.5));
        this.lights[0].position.set(0, 5, 0);
    
        this.scene = new THREE.Scene(); //WebGL Scee
        this.scene.add(this.lights[0]);
    }
    
    
    newChild(factory):VisualItem { //factory is the path to the bitmap
        //renderer-side
        //http://threejs.org/docs/#Reference/Core/Object3D
        this._texture = THREE.ImageUtils.loadTexture(factory);
        this._material = new THREE.MeshBasicMaterial({ map : this._texture, transparent:true });
        this._plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 450), this._material);
        this._plane.doubleSided = true;      
        
        //client-side
        var vi:VisualItem = new VisualItem();
        vi.render = this._plane;
        vi.factory = factory;
        
        this.slots.push(vi); 
        this.surfaces.push(this._plane);
        this.surfaceMaterials.push(this._material);
        return vi;
    }
    
    newChildList(factory, number):void {
        for(var i=0; i<number; i++) {
            this.newChild(factory);
        }
    }
    
    update(slots):void {
        var values:VisualItem;
        var child, childMat;
        var i = 0;
        
        
        for(i=0; i< slots.length; i++) {
            values = slots[i];
            child = this.surfaces[i];
            childMat = this.surfaceMaterials[i];
            
            if(this.transitioner == -1) {
                child.position.x = values.x;
                child.position.y = values.y;
                child.position.z = values.z;
                childMat.opacity = values.alpha;
                child.visible = values.visible;
                child.rotation.x = values.rotationX;
                child.rotation.y = values.rotationY;
                child.rotation.z = values.rotationZ;
                child.scale.x = values.scaleX;
                child.scale.y = values.scaleY;
            } 
            
//            if(transitioner >=0) {
//                TweenMax.to(child, transitioner, { 
//                    x:values.x, 
//                    y:values.y, 
//                    z:values.z, 
//                    alpha:values.alpha, 
//                    visible:values.visible, 
//                    rotationY:values.rotationY, 
//                    rotationX:values.rotationX, 
//                    rotationZ:values.rotationZ, 
//                    scale.x:values.scaleX, 
//                    scale.y:values.scaleY, 
//                    ease:Quad.easeInOut
//                });
//            }
        }
    }
};


//        	public var drawables:Array = new Array();
//		
//		private var bitmap:Bitmap;
//		private var rendererCanvas:DisplayObjectContainer;
//		private var rendererChilds:Array = new Array();
//
//		private var surfaceContext:DisplayObjectContainer;
//    sortLayeringByZ():void {
//        var sc:Vector.<DisplayObject> = new Vector.<DisplayObject>(childRenderers.length);
//        var f1:Function = function (d:DisplayObject, idx:int, v:Object ):void { sc[idx] = d;};
//        childRenderers.forEach(f1);
//        
//        
//        sc.sort(
//            function(b1:DisplayObject, b2:DisplayObject):Number 
//            {  return (b1.z < b2.z)?1:(b1.z > b2.z?-1:0);  }
//    );
//    
//    var f2:Function = function(item:DisplayObject, index:int, vector:Vector.<DisplayObject>):void {
//        rendererCanvas.setChildIndex(item, index);
//    };
//    sc.forEach(f2);



//		
//		public function set renderSurface(surface:DisplayObjectContainer):void {
//			rendererCanvas = surface;
////			var p:PerspectiveProjection = new PerspectiveProjection();
////			p.fieldOfView = perspectiveTransform.f;
////			p.projectionCenter= new Point(perspectiveTransform.x, perspectiveTransform.y);
////			_renderSurface.transform.perspectiveProjection = p;
//		}
//		
//		public function addChild(v:VisualItem):void {
//			v.render= IFactory(v.factory).newInstance();
//			rendererCanvas.addChild(v.render);
//			
//		}
//		
//		public function removeChild(v:VisualItem):void {
//			rendererCanvas.removeChild(v.render);
//			childRenderers.pop(); 
//			v.render = null;
////		}
//	}
//}
