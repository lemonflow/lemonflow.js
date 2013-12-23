var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var OperatorStates = (function (_super) {
    __extends(OperatorStates, _super);
    function OperatorStates() {
        _super.call(this);
        this.active = false;
        this.eventTypes = [];
        this._zbeData = { index: 0, length: 1 };
        this._lastEvent = null;
        this._model = null;
        this._context = null;
    }
    
    OperatorStates.prototype.setup = function (slots) {
        if (typeof slots === "undefined") { slots = null; }
        if (!this.hasOwnProperty("model"))
            return;

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
        this._context = this.hasOwnProperty("context") ? this["context"] : (this.hasOwnProperty("transitioner") ? this["transitioner"] : { "view": null, "state": "main" });

        //build events listener types
        var types = new Array();
        for (var i = 0; i < this._model.length; i++) {
            for (var k = 0; k < this._model[i].changes.length; k++) {
                var stateObjectTypes = (this._model[i].changes[k].type instanceof Array ? this._model[i].changes[k].type : [this._model[i].changes[k].type]);
                for (var t = 0; t < stateObjectTypes.length; t++)
                    types.push(stateObjectTypes[t]);
            }
        }
        types.sort();

        this.eventTypes = types.filter(function (e, i, a) {
            return a.indexOf(e) == i;
        });
    };

    OperatorStates.prototype.processUserInput = function (e) {
        if (typeof e === "undefined") { e = null; }
        this._lastEvent = e;
        this.update();
    };

    OperatorStates.prototype.update = function (slots, currentIdx, nextIndex) {
        if (typeof slots === "undefined") { slots = null; }
        if (typeof currentIdx === "undefined") { currentIdx = 0; }
        if (typeof nextIndex === "undefined") { nextIndex = 0; }
        if (!this._model)
            this._model = this["model"];
        if (!this._context) {
            this._context = this.hasOwnProperty("context") ? this["context"] : (this.hasOwnProperty("transitioner") ? this["transitioner"] : { "view": null, "state": "main" });
        }
        if (this._context["view"] != this._view)
            this._context["view"] = this._view;

        for (var i = 0; i < this._model.length; i++) {
            var s = this._model[i];
            if (this._context["state"] == s["state"] || s["state"] == "global") {
                var q = s["changes"];
                for (var j = 0; j < q.length; j++) {
                    var stateChange = q[j];

                    //iterate through all events and then trigger the actions and transitions
                    var types = stateChange["type"] instanceof Array ? stateChange["type"] : [stateChange["type"]];
                    for (var u = 0; u < types.length; u++) {
                        if (types[u] != this._lastEvent.type)
                            continue;

                        //guard is true?
                        var guardValue = true;
                        if (stateChange.hasOwnProperty("guard")) {
                            var f = stateChange["guard"];
                            var transtioner = this._context;
                            guardValue = f();
                        }
                        if (!guardValue)
                            continue;

                        if (stateChange.hasOwnProperty("transition") && stateChange["transition"] != null) {
                            for (var k = 0; k < stateChange["transition"].length; k++) {
                                (new stateChange["transition"][k](this._context)).run(this._lastEvent);
                            }
                        }

                        if (stateChange.hasOwnProperty("actions") && stateChange["actions"] != null) {
                            for (var k2 = 0; k2 < stateChange["actions"].length; k2++) {
                                (new stateChange["actions"][k2](this._context)).run();
                                //									trace("    actions: "+stateChange["actions"][k2].toString());
                            }
                        }

                        if (stateChange.hasOwnProperty("focusActivate") && stateChange["focusActivate"] != null) {
                            var c = stateChange["focusActivate"][0];
                            FocusModel.instance.activate(this._view[c].controllers[0]);
                        }
                        if (stateChange.hasOwnProperty("focusDeactivate") && stateChange["focusDeactivate"] != null) {
                            var c2 = stateChange["focusDeactivate"];
                            FocusModel.instance.deactivate(this._view[c2].controllers[0]);
                        }

                        if (!stateChange.hasOwnProperty("newState"))
                            return;

                        //store new state
                        //							trace("    new state: "+stateChange["newState"]);
                        var oldState = this._context["state"];
                        if (oldState == stateChange["newState"]) {
                            // trace("    new state: "+stateChange["newState"]);
                            this._context["state"] = stateChange["newState"];
                            return;
                        }

                        if (s.hasOwnProperty("onLeave") && s["onLeave"] != null) {
                            for (k = 0; k < s["onLeave"].length; k++) {
                                (new s["onLeave"][k](this._context)).run();
                            }
                        }

                        // trace("    new state: "+stateChange["newState"]);
                        this._context["state"] = stateChange["newState"];

                        for (j = 0; j < this._model.length; j++) {
                            s = this._model[j];
                            if (this._context["state"] == s["state"]) {
                                if (s.hasOwnProperty("onEnter") && s["onEnter"] != null) {
                                    for (k = 0; k < s["onEnter"].length; k++) {
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
    };

    OperatorStates.prototype.set_view = function (v) {
        if (this._view == v)
            return;
        this._view = v;
        FocusModel.instance.availableViews.push(v);
        this.setup();
        this.processUserInput("viewAttached");
    };
    return OperatorStates;
})(OperatorInteraction);
