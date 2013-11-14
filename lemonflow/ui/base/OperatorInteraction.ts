class OperatorInteraction {
    group:IUIDataGroup = null;
    active:boolean = true;
    doTween:boolean = false;
    sortByZ:boolean = false;
    tween:boolean = false;
    inFocus:boolean = false;
    
    constructor() {}
    setup(slots = null):void {}
    update(slots = null, currentIdx:Number = 0, nextIndex:Number = 0):void {}
    processUserInput(e = null):void {}
}
