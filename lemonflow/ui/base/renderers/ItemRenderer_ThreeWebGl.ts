
class ItemRenderer_ThreeWebGl  {
    
    nativeObject        = null;
    nativeObjectMat     = null;
    visualItem          = null;
    factory             = ""; //path to the file to load
    
    constructor(surface, factory) {
        vi = new VisualItem();
        vi.render = this;
        vi.factory = factory;
        
        setup(surface);
        update(vi);
    }
    
    setup(surface):void {
        var texture = THREE.ImageUtils.loadTexture( "assets/" + vi.factory);
        nativeObjectMat = new THREE.MeshBasicMaterial({ map:texture, transparent:true });
        nativeObject = new THREE.Mesh(new THREE.PlaneGeometry(1000, 450), material);
        nativeObject.doubleSided = true;
        
        surface.add(nativeObject);
    }
    
    update(values):void {
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
    }
}
