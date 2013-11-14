class OperatorStates extends OperatorInteraction {
    active:boolean = false;
    eventTypes = [];
    _zbeData = {index:0,length:1};
    _lastEvent = null;
    
    _model = null;
    _context = null;
    _view;
    
    changeWatchers;
    
    constructor() {
        super();
    }
    
    setup(slots = null):void {
        if(!this.hasOwnProperty("model")) return;
        
        //TODO more sophisticated check the structural correctness of the JSON model for UI flow
        //for now we assume, it will have the numberended structure and capture type/reference errors by exception handling
        //			var valid:boolean = true;
        //			valid &&= this.hasOwnProperty("model");
        //			for(var i:number=0; i< this._model.length; i++) { 	
        //				valid &&= this["model"][i].hasOwnProperty("changes"); 
        //				for(var k:number=0; k< this._model[i].changes.length; k++) 
        //					valid &&= this._model[i].changes[k].hasOwnProperty("type")
        //					for(var t:number=0; t<stateObjectTypes.length; t++) 
        //						types.push(stateObjectTypes[t]);
        //				}
        //			}
        //			if(!valid) return;
        
        
        this._model = this["model"];
        this._context =  this.hasOwnProperty("context")?this["context"]:(this.hasOwnProperty("transitioner")?this["transitioner"]:{"view":null, "state":"main"});
        
        //build events listener types
        var types:Array = new Array();
        for(var i:number=0; i< this._model.length; i++) {
            for(var k:number=0; k< this._model[i].changes.length; k++) {
                var stateObjectTypes = (this._model[i].changes[k].type instanceof Array ?  this._model[i].changes[k].type : [this._model[i].changes[k].type]);
                for(var t:number=0; t<stateObjectTypes.length; t++) types.push(stateObjectTypes[t]);
            }
        }
        types.sort(); //nice to have
        
        this.eventTypes = types.filter(function(e, i:number, a:Array):boolean { return a.indexOf(e) == i; });
}

processUserInput(e = null):void {
    this._lastEvent = e;
    this.update();
}

update(slots = null, currentIdx:Number = 0, nextIndex:Number = 0):void {
    if(!this._model) this._model = this["model"];
    if(!this._context) {
        this._context =  this.hasOwnProperty("context")?
            this["context"]:(this.hasOwnProperty("transitioner")?
                             this["transitioner"]:{"view":null, "state":"main"});
    }
    if(this._context["view"]!=this._view) this._context["view"]= this._view; 
    
    for(var i:number=0; i< this._model.length; i++) {
        var s:Object = this._model[i];
        if(this._context["state"] == s["state"] || s["state"] == "global") {
            var q:Array = s["changes"]
            for(var j:number=0; j< q.length; j++) {
                var stateChange:Object = q[j];
                
                //iterate through all events and then trigger the actions and transitions
                var types:Array = stateChange["type"] instanceof Array? stateChange["type"] : [stateChange["type"]];
                for(var u:number=0; u<types.length; u++) {
                    //current event?
                    if(types[u] != this._lastEvent.type) continue;
                    
                    //guard is true?
                    var guardValue:boolean = true;
                    if(stateChange.hasOwnProperty("guard")){ 
                        var f:Function = stateChange["guard"];
                        var transtioner = this._context;
                        guardValue = f();
                    }
                    if(!guardValue) continue;
                    
                    //do the state change
                    //							trace("component: "+Object(this).toString()+"\t |  state: "+s["state"] + " | \t trigger: " +this._lastEvent.type );
                    if(stateChange.hasOwnProperty("transition") && stateChange["transition"] != null) {
                        for(var k:number=0; k< stateChange["transition"].length; k++) {
                            (new stateChange["transition"][k](this._context)).run(this._lastEvent);
                        }
                    }
                    
                    //do actions
                    if(stateChange.hasOwnProperty("actions") && stateChange["actions"] != null) {
                        for(var k2:number=0; k2< stateChange["actions"].length; k2++) {
                            (new stateChange["actions"][k2](this._context)).run();
                            //									trace("    actions: "+stateChange["actions"][k2].toString());
                        }
                    }
                    
                    //                    //do binding to input
                    //                    if(stateChange.hasOwnProperty("bind") && stateChange["bind"] != null) {
                    //                        var o:Object = stateChange["bind"];
                    //                        this.changeWatchers.push(BindingUtils.bindProperty(this._view, o.outlet, o.device, o.property)); 
                    //                    }
                    //                    if(stateChange.hasOwnProperty("unbind") && stateChange["unbind"] != null) {
                    //                        for (var i2=0;i<this.changeWatchers.length;i++) 
                    //                            this.changeWatchers[i2].unwatch();
                    //                    }
                    //                    
                    //do focus change
                    if(stateChange.hasOwnProperty("focusActivate") && stateChange["focusActivate"] != null) {
                        var c:String = stateChange["focusActivate"][0];
                        FocusModel.instance.activate(this._view[c].controllers[0]);
                    }
                    if(stateChange.hasOwnProperty("focusDeactivate") && stateChange["focusDeactivate"] != null) {
                        var c2:String = stateChange["focusDeactivate"];
                        FocusModel.instance.deactivate(this._view[c2].controllers[0]);
                    }							
                    //							
                    //do focusChange
                    //														if(stateChange.hasOwnProperty("focusChange") && stateChange["focusChange"] != null) {
                    //															var c:Class = stateChange["focusChange"];
                    //							//								FocusModel.instance.transferFocus(
                    //							//									FocusModel.instance.focusComponentStack[FocusModel.instance.focusComponentStack.length-1],
                    //							//									c);
                    //							//								trace("focusChange: "+Object(FocusModel.instance.focusComponentStack[FocusModel.instance.focusComponentStack.length-1]).toString()+"to: "
                    //							//									+c.toString());
                    //															for(var k3:number=0; k3< FocusModel.instance.availableViews.length; k3++) {
                    //																if(FocusModel.instance.availableViews[k3] is c) {
                    //																	FocusModel.instance.transferFocus(
                    //																		FocusModel.instance.focusComponentStack[FocusModel.instance.focusComponentStack.length-1],
                    //																		c.controller);
                    //																		trace("focusChange: "+Object(FocusModel.instance.focusComponentStack[FocusModel.instance.focusComponentStack.length-1]).toString()+"to: "
                    //																		+Object(c.controller).toString());
                    //																}
                    //																
                    //															}
                    //														}
                    
                    if(!stateChange.hasOwnProperty("newState")) return;
                    //store new state
                    //							trace("    new state: "+stateChange["newState"]);
                    
                    var oldState:String = this._context["state"];							
                    if(oldState == stateChange["newState"]) 
                    {
                        // trace("    new state: "+stateChange["newState"]);
                        this._context["state"]  =  stateChange["newState"];
                        return;
                    }
                    
                    // search for new state in the model and execute onLeave methods
                    if(s.hasOwnProperty("onLeave") && s["onLeave"] != null) {
                        for(k=0; k< s["onLeave"].length; k++) {
                            (new s["onLeave"][k](this._context)).run();											
                        }									
                    }
                    
                    // trace("    new state: "+stateChange["newState"]);
                    this._context["state"]  =  stateChange["newState"];
                    
                    // search for new state in the model and execute onEnter methods
                    for(j=0; j< this._model.length; j++) {
                        s = this._model[j];
                        if(this._context["state"] == s["state"]) {
                            if(s.hasOwnProperty("onEnter") && s["onEnter"] != null) {
                                for(k=0; k< s["onEnter"].length; k++) {
                                    (new s["onEnter"][k](this._context)).run();											
                                }									
                            }
                        }
                    }
                    return;	
                }
            }
        }
    }
} 

set_view(v):void { 
    if(this._view==v) return; 
    this._view = v; 
    FocusModel.instance.availableViews.push(v); 
    this.setup(); 
    this.processUserInput("viewAttached");
}
}
