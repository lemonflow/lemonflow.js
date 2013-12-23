class GroupRenderer_ThreejsWebGl {
    
    //ui-side
    slots                   = []; //Array of VisualItems to be rendered
    transitioner            = -1;
    rendererCanvas          = null;
    perspectiveTransform	= {x:400, y:240, f:60};

    //renderer-side
    surfaces    = [];
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
        if(THREE = undefined) return;
        initSurface();
    }

    initSurface() {
        renderer = new THREE.WebGLRenderer({ clearColor: 0x232329, clearAlpha: 1, antialias: true });
        renderer.autoClear = false;
        renderer.setSize(w, h);
        document.getElementById( 'container' ).appendChild( renderer.domElement );

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
        camera.position.x = 0; camera.position.y = -700; camera.position.z = 600;
        
        lights.push(new THREE.DirectionalLight(0xffffff, 0.5));
        lights[0].position.set(0, 5, 0);
    
        scene = new THREE.Scene(); //WebGL Scee
        scene.add(lights[0]);
    }
    
    
    newChild(factory):VisualItem { //factory is the path to the bitmap
        //renderer-side
        _texture = THREE.ImageUtils.loadTexture(factory);
        _material = new THREE.MeshBasicMaterial({ map : texture, transparent:true });
        _plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 450), material);
        _plane.doubleSided = true;      
        
        //client-side
        var vi:VisualItem = new VisualItem();
        vi.render = _plane;
        slots.push(vi); 
        return vi;
    }
    
    newChildList(factory:IFactory, number:int):void {
        for(var i:Number=0; i<number; i++) {
            newChild(factory);
        }
    }
    
    update(slots):void {
        var values:VisualItem;
        var child:DisplayObject;
        var i:int = 0;
        
        
        for(i=0; i< slots.length; i++) {
            values = slots[i];
            child = childRenderers[i];
            if(transitioner == -1) {
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
                    x:values.x, 
                    y:values.y, 
                    z:values.z, 
                    alpha:values.alpha, 
                    visible:values.visible, 
                    rotationY:values.rotationY, 
                    rotationX:values.rotationX, 
                    rotationZ:values.rotationZ, 
                    scaleX:values.scaleX, 
                    scaleY:values.scaleY, 
                    ease:Quad.easeInOut
                });
            }
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
