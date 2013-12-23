class OperatorStates extends OperatorInteraction {
    
    active:boolean  = false;
    eventTypes      = [];
    zbeData         = {index:0,length:1};
    lastEvent       = null;
    
    context         = { "view": this._view, "state": "main" };
    flow            = null;
    _view           = null;
    
    changeWatchers  = [];

    private self    = null;
    
    constructor() {
        super();
    }
    
    setup():void {
        this.self = this;
        
        if (!this.flow) return;
        
        if (this.context.view != this._view)
            this.context.view = this._view;
        
        //build events listener types
        var types = new Array();
        for (var i = 0; i < this.flow.length; i++) {
            for (var k = 0; k < this.flow[i].changes.length; k++) {
                var stateObjectTypes = 
                    (this.flow[i].changes[k].type instanceof Array ? this.flow[i].changes[k].type : [this.flow[i].changes[k].type]);
                for (var t = 0; t < stateObjectTypes.length; t++)
                    types.push(stateObjectTypes[t]);
            }
        }
        types.sort();
        this.eventTypes = types.filter(function (e, i, a) {
            return a.indexOf(e) == i;
        });
    }
    
    processUserInput(e):void {
        this.self.lastEvent = e;
        this.self.update.call(this.self);
    }
    
    update():void {
        for (var i = 0; i < this.flow.length; i++) {
            var s = this.flow[i];
            
            if (this.context["state"] == s["state"] || s["state"] == "global") {
                
                var q = s["changes"];
                
                for (var j = 0; j < q.length; j++) {
                    var stateChange = q[j];

                    //iterate through all events and then trigger the actions and transitions
                    var types = stateChange["type"] instanceof Array ? stateChange["type"] : [stateChange["type"]];
                    for (var u = 0; u < types.length; u++) {
                        if (types[u] != this.lastEvent.type)
                            continue;

                        //guard is true?
                        var guardValue = true;
                        if (stateChange.hasOwnProperty("guard")) {
                            var f = stateChange["guard"];
                            var transtioner = this.context;
                            guardValue = f();
                        }
                        if (!guardValue)
                            continue;

                        console.log(this.lastEvent+ " "+(stateChange["transition"][k]));
                        if (stateChange.hasOwnProperty("transition") && stateChange["transition"] != null) {
                            for (var k = 0; k < stateChange["transition"].length; k++) {
                                 console.log(stateChange["transition"][k]);
                                (stateChange["transition"][k]).call(this.context, this.lastEvent);
                            }
                        }

                        if (stateChange.hasOwnProperty("actions") && stateChange["actions"] != null) {
                            for (var k2 = 0; k2 < stateChange["actions"].length; k2++) {
                                (stateChange["actions"][k2]).call(this.context);
                            }
                        }

                        if (stateChange.hasOwnProperty("focusActivate") && stateChange["focusActivate"] != null) {
                            var c = stateChange["focusActivate"][0];
                            FocusModel.instance.activate(this.view[c].controllers[0]);
                        }
                        if (stateChange.hasOwnProperty("focusDeactivate") && stateChange["focusDeactivate"] != null) {
                            var c2 = stateChange["focusDeactivate"];
                            FocusModel.instance.deactivate(this.view[c2].controllers[0]);
                        }

                        if (!stateChange.hasOwnProperty("newState"))
                            return;
                        var oldState = this.context["state"];
                        if (oldState == stateChange["newState"]) {
                            this.context["state"] = stateChange["newState"];
                            return;
                        }

                        if (s.hasOwnProperty("onLeave") && s["onLeave"] != null) {
                            for (k = 0; k < s["onLeave"].length; k++) {
                                (s["onLeave"][k]).call(this.context);
                            }
                        }

                        this.context["state"] = stateChange["newState"];

                        for (j = 0; j < this.flow.length; j++) {
                            s = this.flow[j];
                            if (this.context["state"] == s["state"]) {
                                if (s.hasOwnProperty("onEnter") && s["onEnter"] != null) {
                                    for (k = 0; k < s["onEnter"].length; k++) {
                                        (s["onEnter"][k]).call(this.context);
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

    get view() { return this._view ; }
    set view(v) { 
            if (this._view == v) return;
            this._view = v;
            this.setup();
            FocusModel.instance.availableViews.push(v);
            this.processUserInput(new Eventl("viewAttached"));
    }
}
