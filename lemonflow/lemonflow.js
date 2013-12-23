/*
* Event
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/
var Eventl = (function () {
    function Eventl(type, bubbles, cancelable) {
        if (typeof bubbles === "undefined") { bubbles = false; }
        if (typeof cancelable === "undefined") { cancelable = false; }
        this.type = null;
        this.target = null;
        this.currentTarget = null;
        this.eventPhase = 0;
        this.bubbles = false;
        this.cancelable = false;
        this.timeStamp = 0;
        this.defaultPrevented = false;
        this.propagationStopped = false;
        this.immediatePropagationStopped = false;
        this.removed = false;
        this.initialize(type, bubbles, cancelable);
    }
    Eventl.prototype.initialize = function (type, bubbles, cancelable) {
        if (typeof bubbles === "undefined") { bubbles = false; }
        if (typeof cancelable === "undefined") { cancelable = false; }
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.timeStamp = (new Date()).getTime();
    };

    Eventl.prototype.preventDefault = function () {
        this.defaultPrevented = true;
    };

    Eventl.prototype.stopPropagation = function () {
        this.propagationStopped = true;
    };

    Eventl.prototype.stopImmediatePropagation = function () {
        this.immediatePropagationStopped = this.propagationStopped = true;
    };

    Eventl.prototype.remove = function () {
        this.removed = true;
    };

    Eventl.prototype.clone = function () {
        return new InputEvent(this.type, this.bubbles, this.cancelable);
    };

    Eventl.prototype.toString = function () {
        return "[Event (type=" + this.type + ")]";
    };
    return Eventl;
})();
/*
* EventDispatcher
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/
/**
* EventDispatcher provides methods for managing queues of event listeners and dispatching events.
*
* You can either extend EventDispatcher or mix its methods into an existing prototype or instance by using the
* EventDispatcher {{#crossLink "EventDispatcher/initialize"}}{{/crossLink}} method.
*
* Together with the CreateJS Event class, EventDispatcher provides an extended event model that is based on the
* DOM Level 2 event model, including addEventListener, removeEventListener, and dispatchEvent. It supports
* bubbling / capture, preventDefault, stopPropagation, stopImmediatePropagation, and handleEvent.
*
* EventDispatcher also exposes a {{#crossLink "EventDispatcher/on"}}{{/crossLink}} method, which makes it easier
* to create scoped listeners, listeners that only run once, and listeners with associated arbitrary data. The
* {{#crossLink "EventDispatcher/off"}}{{/crossLink}} method is merely an alias to
* {{#crossLink "EventDispatcher/removeEventListener"}}{{/crossLink}}.
*
* Another addition to the DOM Level 2 model is the {{#crossLink "EventDispatcher/removeAllEventListeners"}}{{/crossLink}}
* method, which can be used to listeners for all events, or listeners for a specific event. The Event object also
* includes a {{#crossLink "Event/remove"}}{{/crossLink}} method which removes the active listener.
*
* <h4>Example</h4>
* Add EventDispatcher capabilities to the "MyClass" class.
*
*      EventDispatcher.initialize(MyClass.prototype);
*
* Add an event (see {{#crossLink "EventDispatcher/addEventListener"}}{{/crossLink}}).
*
*      instance.addEventListener("eventName", handlerMethod);
*      function handlerMethod(event) {
*          console.log(event.target + " Was Clicked");
*      }
*
* <b>Maintaining proper scope</b><br />
* Scope (ie. "this") can be be a challenge with events. Using the {{#crossLink "EventDispatcher/on"}}{{/crossLink}}
* method to subscribe to events simplifies this.
*
*      instance.addEventListener("click", function(event) {
*          console.log(instance == this); // false, scope is ambiguous.
*      });
*
*      instance.on("click", function(event) {
*          console.log(instance == this); // true, "on" uses dispatcher scope by default.
*      });
*
* If you want to use addEventListener instead, you may want to use function.bind() or a similar proxy to manage scope.
*
*
* @class EventDispatcher
* @constructor
**/
var EventDispatcher = (function () {
    function EventDispatcher() {
        this.parent = null;
        this._listeners = null;
        this._captureListeners = null;
        this.off = this.removeEventListener;
    }
    EventDispatcher.prototype.addEventListener = function (type, listener, useCapture) {
        if (typeof useCapture === "undefined") { useCapture = false; }
        var listeners;
        if (useCapture) {
            listeners = this._captureListeners = this._captureListeners || {};
        } else {
            listeners = this._listeners = this._listeners || {};
        }
        var arr = listeners[type];
        if (arr) {
            this.removeEventListener(type, listener, useCapture);
        }
        arr = listeners[type];
        if (!arr) {
            listeners[type] = [listener];
        } else {
            arr.push(listener);
        }
        return listener;
    };

    EventDispatcher.prototype.on = function (type, listener, scope, once, data, useCapture) {
        if (listener.handleEvent) {
            scope = scope || listener;
            listener = listener.handleEvent;
        }
        scope = scope || this;
        return this.addEventListener(type, function (evt) {
            listener.call(scope, evt, data);
            once && evt.remove();
        }, useCapture);
    };

    EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
        if (typeof useCapture === "undefined") { useCapture = false; }
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) {
            return;
        }
        var arr = listeners[type];
        if (!arr) {
            return;
        }
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] == listener) {
                if (l == 1) {
                    delete (listeners[type]);
                } else {
                    arr.splice(i, 1);
                }
                break;
            }
        }
    };

    EventDispatcher.prototype.removeAllEventListeners = function (type) {
        if (typeof type === "undefined") { type = null; }
        if (!type) {
            this._listeners = this._captureListeners = null;
        } else {
            if (this._listeners) {
                delete (this._listeners[type]);
            }
            if (this._captureListeners) {
                delete (this._captureListeners[type]);
            }
        }
    };

    EventDispatcher.prototype.dispatchEvent = function (eventObj, target) {
        if (typeof target === "undefined") { target = null; }
        if (typeof eventObj == "string") {
            // won't bubble, so skip everything if there's no listeners:
            var listeners = this._listeners;
            if (!listeners || !listeners[eventObj]) {
                return false;
            }
            eventObj = new InputEvent(eventObj);
        }

        // TODO: deprecated. Target param is deprecated, only use case is MouseEvent/mousemove, remove.
        eventObj.target = target || this;

        if (!eventObj.bubbles || !this.parent) {
            this._dispatchEvent(eventObj, 2);
        } else {
            var top = this, list = [top];
            while (top.parent) {
                list.push(top = top.parent);
            }
            var i, l = list.length;

            for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
                list[i]._dispatchEvent(eventObj, 1 + Number(i == 0));
            }

            for (i = 1; i < l && !eventObj.propagationStopped; i++) {
                list[i]._dispatchEvent(eventObj, 3);
            }
        }
        return eventObj.defaultPrevented;
    };

    EventDispatcher.prototype.hasEventListener = function (type) {
        var listeners = this._listeners, captureListeners = this._captureListeners;
        return !!((listeners && listeners[type]) || (captureListeners && captureListeners[type]));
    };

    EventDispatcher.prototype.toString = function () {
        return "[EventDispatcher]";
    };

    EventDispatcher.prototype._dispatchEvent = function (eventObj, eventPhase) {
        var l, listeners = (eventPhase == 1) ? this._captureListeners : this._listeners;
        if (eventObj && listeners) {
            var arr = listeners[eventObj.type];
            if (!arr || !(l = arr.length)) {
                return;
            }
            eventObj.currentTarget = this;
            eventObj.eventPhase = eventPhase;
            eventObj.removed = false;
            arr = arr.slice();
            for (var i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
                var o = arr[i];
                if (o.handleEvent) {
                    o.handleEvent(eventObj);
                } else {
                    o(eventObj);
                }
                if (eventObj.removed) {
                    this.off(eventObj.type, o, eventPhase == 1);
                    eventObj.removed = false;
                }
            }
        }
    };
    return EventDispatcher;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var InputEvent = (function (_super) {
    __extends(InputEvent, _super);
    function InputEvent(type, bubbles, cancelable) {
        if (typeof type === "undefined") { type = "input"; }
        if (typeof bubbles === "undefined") { bubbles = false; }
        if (typeof cancelable === "undefined") { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
    }
    return InputEvent;
})(Eventl);
/*
Copyright (c) 2006-2011, Philipp Fischer & Andreas Nuernberger
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

* The name Philipp Fischer or Andreas Nuernberger may not be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
/** @author Philipp Fischer
* 	@date	2008/07/30
**/
/**
* retrieves direct user input events and other triggers (cce, touch events, hard keys, mouse, keyboard)
* from the devices.
*
* manages state of the devices (e.g. setting length or haptical feedback)
*
* communicates to/from hardware, e.g. by using a serial socket connected to an extrenal software wrapper
* in case of the cce
*
* forwards events to the framework by using an internal event dispatching mechanism
*/
var InputManager = (function (_super) {
    __extends(InputManager, _super);
    function InputManager() {
        _super.call(this);
        this.inputStateStack = new Array();
        this.lastEvent = "";
        this.activeConnectors = new Array();
        InputManager._instance = this;
    }
    InputManager.getInstance = function () {
        return ((InputManager._instance === null) ? (InputManager._instance = new InputManager()) : InputManager._instance);
    };

    /** _____________________________________________________________________________
    *  connects input device connectors to an interactive surface
    **/
    InputManager.prototype.connectInputDeviceConnector = function (connectorClass, nativeWindow) {
        this.activeConnectors.push(connectorClass.instance);
        //        this.activeConnectors[this.activeConnectors.length-1].bindInputEventSource(nativeWindow);
    };

    /** _____________________________________________________________________________
    *  sends input events from Device to UI
    **/
    InputManager.prototype.routeFromInputDevice = function (event) {
        if (typeof event === "undefined") { event = null; }
        this.lastEvent = event.type;
        if (this.routeStaticFromInputDevice(event) == false)
            this.dispatchEvent(event);
    };

    /** _____________________________________________________________________________
    *  informs all Connectors to update device state
    **/
    InputManager.prototype.routeToInputDevice = function (event) {
        if (typeof event === "undefined") { event = null; }
        //        for(var i=0;i<this.activeConnectors.length;i++)
        //            this.activeConnectors[i].updateInputDevice();
        return true;
    };

    InputManager.prototype.routeStaticFromInputDevice = function (event) {
        switch (event.type) {
            default:
                return false;
        }
        return true;
    };
    InputManager._instance = null;
    return InputManager;
})(EventDispatcher);
/*
Copyright (c) 2006-2011, Philipp Fischer & Andreas Nuernberger
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

* The name Philipp Fischer or Andreas Nuernberger may not be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
var FocusModel = (function () {
    function FocusModel() {
        this.availableViews = [];
        this.focusComponentStack = [];
        this.focusView = null;
        this.syncConnection = null;
    }
    FocusModel.prototype.transferFocus = function (oldactiveC, newactiveC) {
        this.deactivate(oldactiveC);
        this.focusComponentStack.push(newactiveC);
        this.activate(newactiveC);
    };

    FocusModel.prototype.setFocus = function (newactiveC) {
        this.deactivate(this.focusComponentStack[this.focusComponentStack.length - 1]);
        this.focusComponentStack.push(newactiveC);
        this.activate(newactiveC);
    };

    FocusModel.prototype.deactivateFocus = function (oldactiveC) {
        this.deactivate(oldactiveC);
        this.focusComponentStack.pop();
        var newactiveC;
        newactiveC = this.focusComponentStack.length > 0 ? this.focusComponentStack[this.focusComponentStack.length - 1] : null;
        this.activate(newactiveC);
    };

    FocusModel.prototype.activateFocus = function (newactiveC) {
        var oldactiveC;
        oldactiveC = this.focusComponentStack.length > 0 ? this.focusComponentStack[this.focusComponentStack.length - 1] : null;
        this.deactivate(oldactiveC);
        this.focusComponentStack.push(newactiveC);
        this.activate(newactiveC);
    };

    //component gains focus, i.e. all input events get routed to this component
    FocusModel.prototype.activate = function (c) {
        if (c == null)
            return;
        for (var i = 0; i < c.eventTypes.length; i++)
            InputManager.getInstance().addEventListener(c.eventTypes[i], c.processUserInput);

        this.focusView = c;
        c.inFocus = true;
        c.processUserInput(new UIStateEvent(UIStateEvent.FOCUS_ACTIVATE));
    };

    //component looses focus
    FocusModel.prototype.deactivate = function (c) {
        if (c == null)
            return;

        for (var i = 0; i < c.eventTypes.length; i++)
            InputManager.getInstance().removeEventListener(c.eventTypes[i], c.processUserInput);

        c.inFocus = false;
        c.processUserInput(new UIStateEvent(UIStateEvent.FOCUS_DEACTIVATE));
    };
    FocusModel.instance = new FocusModel();
    return FocusModel;
})();
/*
Copyright (c) 2006-2011, Philipp Fischer & Andreas Nuernberger
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

* The name Philipp Fischer or Andreas Nuernberger may not be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/
var UIStateEvent = (function (_super) {
    __extends(UIStateEvent, _super);
    function UIStateEvent(type) {
        if (typeof type === "undefined") { type = "focusactivate"; }
        _super.call(this, type);
    }
    UIStateEvent.FOCUS_ACTIVATE = "focusactivate";
    UIStateEvent.FOCUS_DEACTIVATE = "focusdeactivate";
    return UIStateEvent;
})(Eventl);
/// <reference path="../../lemonflow.ts" />
var BaseScheduler = (function () {
    function BaseScheduler() {
    }
    return BaseScheduler;
})();
/// <reference path="../../lemonflow.ts" />
var BaseTransition = (function () {
    function BaseTransition(s) {
        this.operatorUpdateFunction = function () {
        };
        this.operatorCompleteFunction = function () {
        };
        this.scheduler = s;
    }
    BaseTransition.prototype.run = function (e) {
        if (typeof e === "undefined") { e = null; }
    };
    return BaseTransition;
})();
/// <reference path="../../lemonflow.ts" />
var InteractionState = (function () {
    function InteractionState() {
        this.view = null;
        this._selectedIndex = 0;
        this._oldSelectedIndex = 0;
        this._initSelectedIndex = 0;
        this._currentIndex = 0;
        this._direction = 0;
        this._selectedState = 0;
        this._oldSelectedState = 0;
        this._initState = 0;
        this._currentState = 0;
        this._currentIndex = this._selectedIndex = this._oldSelectedIndex = this._initSelectedIndex;
    }
    InteractionState.prototype.scrollRelative = function (step, duration) {
        if (typeof step === "undefined") { step = 0; }
        if (typeof duration === "undefined") { duration = -1; }
        if (this._selectedIndex + step < 0)
            return false;
        this._oldSelectedIndex = this._selectedIndex;
        this._selectedIndex += step;
        this.transitionToIndex(duration);
        return true;
    };

    InteractionState.prototype.scrollAbsolute = function (target, duration) {
        if (typeof target === "undefined") { target = 0; }
        if (typeof duration === "undefined") { duration = -1; }
        if (target < 0)
            return false;
        this._oldSelectedIndex = this._selectedIndex;
        this._selectedIndex = target;
        this.transitionToIndex(duration);
        return true;
    };

    InteractionState.prototype.transitionToIndex = function (duration) {
        if (this._currentIndex != this._selectedIndex) {
            this._direction = this._selectedIndex - this._oldSelectedIndex;
            //            Tweener.addTween(this, {
            //                currentIndex:	this._selectedIndex,
            //                time: duration!=-1?duration:(this.view.transitionDuration/1000),
            //                transition: this.view.easing, onUpdate:this.view.invalidate});
        }
    };

    InteractionState.prototype.set_component = function (c) {
        this.view = c;
    };

    InteractionState.prototype.set_initSelectedIndex = function (s) {
        this._selectedIndex = this._initSelectedIndex = s;
    };
    InteractionState.prototype.get_initSelectedIndex = function () {
        return this._initSelectedIndex;
    };
    InteractionState.prototype.set_selectedIndex = function (s) {
        this.scrollAbsolute(s);
    };
    InteractionState.prototype.get_selectedIndex = function () {
        return this._selectedIndex;
    };
    InteractionState.prototype.set_currentIndex = function (s) {
        this._currentIndex = s;
    };
    InteractionState.prototype.get_currentIndex = function () {
        return this._currentIndex;
    };

    InteractionState.prototype.get_direction = function () {
        return this._direction;
    };
    InteractionState.prototype.get_oldSelectedIndex = function () {
        return this._oldSelectedIndex;
    };
    return InteractionState;
})();
var VisualItem = (function () {
    function VisualItem() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.alpha = 1;
        this.visible = true;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.data = new Object();
        this.render = null;
        this.factory = null;
        this._renderer = null;
    }
    VisualItem.prototype.set_renderer = function (r) {
        this._renderer = r;
        this.dirty();
    };

    VisualItem.prototype.dirty = function () {
    };
    VisualItem.prototype.commitChanges = function () {
        //			if (_dirty != DIRTY) return;
        //			_dirty = VISIT;
        //			render();
    };
    return VisualItem;
})();
var OperatorInteraction = (function () {
    function OperatorInteraction() {
        this.group = null;
        this.active = true;
        this.doTween = false;
        this.sortByZ = false;
        this.tween = false;
        this.inFocus = false;
    }
    OperatorInteraction.prototype.setup = function () {
    };
    OperatorInteraction.prototype.update = function () {
    };
    OperatorInteraction.prototype.processUserInput = function (e) {
    };
    return OperatorInteraction;
})();
var OperatorStates = (function (_super) {
    __extends(OperatorStates, _super);
    
    var self = null;
    
    function OperatorStates() {
        _super.call(this);
        this.active = false;
        this.eventTypes = [];
        this.zbeData = { index: 0, length: 1 };
        this.lastEvent = null;
        this.context = { "view": this._view, "state": "main" };
        this.flow = null;
        this._view = null;
        this.changeWatchers = [];
        
    }
    OperatorStates.prototype.setup = function () {
        self = this;

        if (!this.flow)
            return;

        if (this.context.view != this._view)
            this.context.view = this._view;

        //build events listener types
        var types = new Array();
        for (var i = 0; i < this.flow.length; i++) {
            for (var k = 0; k < this.flow[i].changes.length; k++) {
                var stateObjectTypes = (this.flow[i].changes[k].type instanceof Array ? this.flow[i].changes[k].type : [this.flow[i].changes[k].type]);
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
        self.lastEvent = e;
        self.update.call(self);
    };

    OperatorStates.prototype.update = function () {
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

                        console.log(this.lastEvent + " " + (stateChange["transition"][k]));
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
    };

    Object.defineProperty(OperatorStates.prototype, "view", {
        get: function () {
            return this._view;
        },
        set: function (v) {
            if (this._view == v)
                return;
            this._view = v;
            this.setup();
            FocusModel.instance.availableViews.push(v);
            this.processUserInput(new Eventl("viewAttached"));
        },
        enumerable: true,
        configurable: true
    });
    return OperatorStates;
})(OperatorInteraction);
