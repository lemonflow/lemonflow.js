function OperatorStates() {
    this.allowOnEnter = false;
    this._active = false;
    this._eventTypes = [];
    this._zbeData = {index:0,length:1};
    this.lastEvent = null;

    this._model = null;
    this.context = null;
    this._view = null;

    this.changeWatchers = new Array();

    this.setup = function(slots) {
        //        if(!this.hasOwnProperty("model")) return;

        //        _model = this["model"];
        //        this.context =  this.hasOwnProperty("context")?this["context"]:(this.hasOwnProperty("transitioner")?this["transitioner"]:{"view":null, "state":"main"});

        //        //build events listener types
        //        var types = new Array();
        //        for(var i:uint=0; i< _model.length; i++) {
        //            for(var k:int=0; k< _model[i].changes.length; k++) {
        //                var stateObjectTypes = (_model[i].changes[k].type is Array?  _model[i].changes[k].type : [_model[i].changes[k].type]);
        //                for(var t:int=0; t<stateObjectTypes.length; t++) types.push(stateObjectTypes[t]);
        //            }
        //        }
        //        types.sort(); //nice to have

        //        _eventTypes = types.filter(function(e:*, i:int, a) { return a.indexOf(e) == i; });
        //        trace(this + " listens to: " +_eventTypes);
    }

    this.processInput = function(e) {
        this.lastEvent = e;
        this.update();
    }

    this.update = function() {
        if(!this.flow) return;
        if(!this.context || !this.context.state) return;
        if(!this.context.view) return;

        //finds the first occurance of the active state (linear search)
        //iterate through all events and
        //in case the current event matches the one in the state table
        //then trigger the defined actions and transitions

                for(var i=0; i< this.flow.length; i++) {
                    var s = this.flow[i];

                    if(this.context.state == s.state || s.state == "global") {
                        var q = s.changes;
                        for(var j=0; j<q.length; j++) {
                            var stateChange = q[j];

                            var types = stateChange.type instanceof Array? stateChange.type : [stateChange.type];
                            for(var u=0; u<types.length; u++) {
                                //linear search for current event?
                                if(types[u] != this.lastEvent.type) continue;

                                //guard is true?
                                var guardValue = true;
                                if(stateChange.hasOwnProperty("guard")){
                                    var f = stateChange.guard;
                                    var transtioner = this.context;
                                    guardValue = f(); //return true or false;
                                }
                                if(!guardValue) continue;

                                //do the state change
                                console.log("component: "+Object(this).toString()+"\t |  state: "+s.state + " | \t trigger: " +this.lastEvent.type );
                                if(stateChange.hasOwnProperty("transition") && stateChange.transition != null) {
                                    for(var k=0; k< stateChange.transition.length; k++) {
                                        (new stateChange.transition[k](this.context)).run(this.lastEvent);
                                    }
                                }

                                //do actions
                                if(stateChange.hasOwnProperty("actions") && stateChange.actions != null) {
                                    for(var k2=0; k2< stateChange["actions"].length; k2++) {
                                        (new stateChange.actions[k2](this.context)).run();
                                    }
                                }

        //                        //do binding to input
        //                        if(stateChange.hasOwnProperty("bind") && stateChange["bind"] != null) {
        //                            var o = stateChange["bind"];
        //                            changeWatchers.push(BindingUtils.bindProperty(_view, o.outlet, o.device, o.property));
        //                        }
        //                        if(stateChange.hasOwnProperty("unbind") && stateChange["unbind"] != null) {
        //                            for each (var i2:ChangeWatcher in changeWatchers)
        //                            i2.unwatch();
        //                        }

        //                        //do focus change
        //                        if(stateChange.hasOwnProperty("focusActivate") && stateChange["focusActivate"] != null) {
        //                            var c:String = stateChange["focusActivate"][0];
        //                            FocusModel.instance.activate(_view[c].controllers[0]);
        //                        }
        //                        if(stateChange.hasOwnProperty("focusDeactivate") && stateChange["focusDeactivate"] != null) {
        //                            var c2:String = stateChange["focusDeactivate"];
        //                            FocusModel.instance.deactivate(_view[c2].controllers[0]);
        //                        }

                                if(!stateChange.hasOwnProperty("newState")) return;

                                //store new state
                                var oldState = this.context.state;
                                if(oldState == stateChange.newState) {
                                    return;
                                }
                                else {
                                    console.log("    new state: "+stateChange.newState);
                                    this.context.state  =  stateChange.newState;
                                    if(!this.allowOnEnter) return;

                                    // search for new state and execute potential onEnter methods
                                    var saveEvent = this.lastEvent;
                                    this.lastEvent = {type:"onEnter"}; //potentially could set a different newState
                                    this.update();
                                    this.lastEvent = saveEvent;
                                    this.context.state  =  stateChange.newState;
                                }
                            }
                        }
                    }
                }
    }

    //    public function get eventTypes()  { return this._eventTypes; }
    //    public function set zbeBoundaries(o):void  {this._zbeData = o; }
    //    public function get zbeBoundaries()  { return _zbeData; }
    //    public function set activeIOState (a):void {_active = a; }
    //    public function get activeIOState () { return _active; }
    //    public function set view(v:*):void { if(_view==v) return; _view = v; FocusModel.instance.availableViews.push(v); setup(); processUserInput(new Event("viewAttached")) }
    //    public function get view():* { return _view; }

}
