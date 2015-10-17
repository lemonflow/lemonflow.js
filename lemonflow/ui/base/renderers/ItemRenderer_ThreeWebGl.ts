
class ItemRenderer_ThreeWebGl  {
    
    transitioner        = -1;
    nativeObject        = null;
    nativeObjectMat     = null;
    visualItem          = null;
    factory             = ""; //path to the file to load
    
    //temporary
    _texture    = null; 
    
    constructor(surface, factory) {
        this.setup(surface);
        this.update(this.visualItem);
    }
    
    setup(factory):void {
        //renderer-side  -  http://threejs.org/docs/#Reference/Core/Object3D
        this._texture = THREE.ImageUtils.loadTexture(factory);
        this.nativeObjectMat = new THREE.MeshBasicMaterial({ map : this._texture, transparent:true });
        this.nativeObject = new THREE.Mesh(new THREE.PlaneGeometry(1000, 450), this.nativeObjectMat);
        this.nativeObject.doubleSided = true;      
        
        //client-side
        this.visualItem = new VisualItem();
        this.visualItem.render = this.nativeObject;
        this.visualItem.factory = factory;
    }
    
    update(values):void {
        if(this.transitioner == -1) {
            this.nativeObject.position.x = values.x;
            this.nativeObject.position.y = values.y;
            this.nativeObject.position.z = values.z;
            this.nativeObjectMat.opacity = values.alpha;
            this.nativeObject.visible = values.visible;
            this.nativeObject.rotation.x = values.rotationX;
            this.nativeObject.rotation.y = values.rotationY;
            this.nativeObject.rotation.z = values.rotationZ;
            this.nativeObject.scale.x = values.scaleX;
            this.nativeObject.scale.y = values.scaleY;
        } 
    }
}
