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

class InputManager extends EventDispatcher{
    
    inputStateStack:Array = new Array();
    lastEvent:String = "";
    activeConnectors:Array = new Array();
    
    private static _instance:InputManager = null;
    constructor() { super(); InputManager._instance = this; }
    public static getInstance():InputManager { 
        return ((InputManager._instance===null)?(InputManager._instance = new InputManager()):InputManager._instance); 	
    }
    
    /** _____________________________________________________________________________
		 *  connects input device connectors to an interactive surface
		 **/
    connectInputDeviceConnector(connectorClass, nativeWindow):void {
        this.activeConnectors.push(connectorClass.instance);
//        this.activeConnectors[this.activeConnectors.length-1].bindInputEventSource(nativeWindow);
    }
    
    /** _____________________________________________________________________________
		 *  sends input events from Device to UI
		 **/
    routeFromInputDevice(event=null):void {
        this.lastEvent = event.type;
        if(this.routeStaticFromInputDevice(event) == false) 
            this.dispatchEvent(event);
    }
    
    /** _____________________________________________________________________________
		 *  informs all Connectors to update device state
		 **/
    routeToInputDevice(event=null):boolean {
//        for(var i=0;i<this.activeConnectors.length;i++) 
//            this.activeConnectors[i].updateInputDevice();
        return true;
    }
    
    routeStaticFromInputDevice(event):boolean {
        switch (event.type) {
            default:
                return false;
        }
        return true;
    }
}
