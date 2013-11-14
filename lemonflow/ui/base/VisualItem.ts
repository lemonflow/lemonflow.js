class VisualItem  {
    parent;
    
    x:number						= 0;
    y:number						= 0;
    z:number						= 0;
    
    alpha:number					= 1;
    visible:boolean				= true;
    
    rotationX:number				= 0;
    rotationY:number				= 0;
    rotationZ:number				= 0;
    
    scaleX:number				= 1;
    scaleY:number				= 1;
    
    data						= new Object();
    render					= null;
    factory					= null;
    
    _renderer = null;
    set_renderer(r):void { this._renderer = r; this.dirty(); }
    
    dirty():void { }
    commitChanges():void {
        //			if (_dirty != DIRTY) return;
        //			_dirty = VISIT; 
        //			render(); 
    }
}
