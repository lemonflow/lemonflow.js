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

class Eventl {
    type = null;
    target = null;
    currentTarget = null;
    eventPhase = 0;
    bubbles = false;
    cancelable = false;
    timeStamp = 0;
    defaultPrevented = false;
    propagationStopped = false;
    immediatePropagationStopped = false;
    removed = false;
    
    constructor(type, bubbles=false, cancelable=false) {
        this.initialize(type, bubbles, cancelable);
    }
    
    initialize(type, bubbles=false, cancelable=false) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.timeStamp = (new Date()).getTime();
    }

    preventDefault() {
        this.defaultPrevented = true;
    }
    
    stopPropagation() {
        this.propagationStopped = true;
    }
    
    stopImmediatePropagation() {
        this.immediatePropagationStopped = this.propagationStopped = true;
    }
    
    remove() {
        this.removed = true;
    }
    
    clone() {
        return new InputEvent(this.type, this.bubbles, this.cancelable);
    }
    
    toString() {
        return "[Event (type="+this.type+")]";
    }
}