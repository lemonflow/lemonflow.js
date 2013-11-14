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
        this._listeners = null;
        this._captureListeners = null;
        this.off = this.removeEventListener;
    }
    EventDispatcher.initialize = function (target) {
        target.addEventListener = this.addEventListener;
        target.on = this.on;
        target.removeEventListener = target.off = this.removeEventListener;
        target.removeAllEventListeners = this.removeAllEventListeners;
        target.hasEventListener = this.hasEventListener;
        target.dispatchEvent = this.dispatchEvent;
        target._dispatchEvent = this._dispatchEvent;
    };

    EventDispatcher.prototype.addEventListener = function (type, listener, useCapture) {
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
        if (typeof eventObj == "string") {
            // won't bubble, so skip everything if there's no listeners:
            var listeners = this._listeners;
            if (!listeners || !listeners[eventObj]) {
                return false;
            }
            eventObj = new Event(eventObj);
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
                list[i]._dispatchEvent(eventObj, 1 + (i == 0));
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
