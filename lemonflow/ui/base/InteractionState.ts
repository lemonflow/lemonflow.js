/// <reference path="../../lemonflow.ts" />


class InteractionState {
    
    view:IUIDataGroup = null;
    
    _selectedIndex:number 				= 0;
    _oldSelectedIndex:number				= 0;
    _initSelectedIndex:number			= 0;
    _currentIndex:number = 0;
    _direction:number = 0;
    
    _selectedState:number 				= 0;
    _oldSelectedState:number				= 0;
    _initState:number				= 0;
    _currentState:number = 0;
    
    
    constructor() {
        this._currentIndex = this._selectedIndex = this._oldSelectedIndex = this._initSelectedIndex;
    }
    
    scrollRelative(step:number=0, duration:number=-1):boolean {
        if(this._selectedIndex+step<0) return false;
        this._oldSelectedIndex = this._selectedIndex;
        this._selectedIndex+=step;
        this.transitionToIndex(duration);
        return true;
    }
    
    scrollAbsolute(target:number=0, duration:number=-1):boolean {
        if(target<0) return false;
        this._oldSelectedIndex = this._selectedIndex;
        this._selectedIndex=target;
        this.transitionToIndex(duration);
        return true;
    }
    
    transitionToIndex(duration:number):void {
        if(this._currentIndex != this._selectedIndex) {
            this._direction = this._selectedIndex -this._oldSelectedIndex;
//            Tweener.addTween(this, { 
//                currentIndex:	this._selectedIndex, 
//                time: duration!=-1?duration:(this.view.transitionDuration/1000), 
//                transition: this.view.easing, onUpdate:this.view.invalidate});
        }
    }
    
    set_component(c:IUIDataGroup):void { this.view = c; }
    
    set_initSelectedIndex(s:number):void {  this._selectedIndex = this._initSelectedIndex = s;  }
    get_initSelectedIndex():number { return this._initSelectedIndex; }
    set_selectedIndex(s:number):void {	this.scrollAbsolute(s);  }
    get_selectedIndex():number { return this._selectedIndex; }
    set_currentIndex(s:number):void { this._currentIndex = s; }
    get_currentIndex():number { return this._currentIndex; }
    
    get_direction():number { return this._direction; }
    get_oldSelectedIndex():number { return this._oldSelectedIndex; }
}