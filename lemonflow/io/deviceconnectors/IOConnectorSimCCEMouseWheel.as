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

package lemonflow.io.deviceconnectors
{
	import flash.events.MouseEvent;
	
	import lemonflow.io.IInputDeviceConnector;
	import lemonflow.io.InputManager;
	import lemonflow.io.device.CCEDevice;
	import lemonflow.io.events.NInputEvent;
	
	import mx.core.UIComponent;

	public class IOConnectorSimCCEMouseWheel implements IInputDeviceConnector
	{
		private var eventSource = null;
		
		private static var _instance:IOConnectorSimCCEMouseWheel = null;
		public function IOConnectorSimCCEMouseWheel() { _instance = this; }
		public static function get instance():IOConnectorSimCCEMouseWheel { return _instance?_instance:(_instance = new IOConnectorSimCCEMouseWheel()); }		

		public function updateInputDevice():void {}
		
		public function bindInputEventSource(s):void {
			
			if(eventSource!= null) {
				s.removeEventListener(MouseEvent.MOUSE_WHEEL, handleInput);
				s.removeEventListener(MouseEvent.MOUSE_UP, handleInput);
			}
			
			if(s!= null) {
				s.addEventListener(MouseEvent.MOUSE_WHEEL, handleInput);
			 	s.addEventListener(MouseEvent.MOUSE_UP, handleInput);
				eventSource = s;
			}
		}
				
		private var deltaIndex:int = 0;
		private var realIndex:uint = 0;
		private var realLength:uint = 0;
		private var firstUpdate:Boolean = true;
		private var simIndex:int = 0;
		private var simLength:int = 255;
		private var firstZBE:Boolean = true;
		
		protected function handleInput(e:*):void {
			var newEvent:NInputEvent;
			
			if(firstZBE) { //first ZBE response will be ignored > send two times
				newEvent = new NInputEvent(NInputEvent.ZBE, simIndex, simLength);
				firstZBE = false;
			}
			
			switch(e.type) {
				case MouseEvent.MOUSE_WHEEL:
					simIndex+=(e as MouseEvent).delta;
					newEvent = new NInputEvent(NInputEvent.ZBE, simIndex, simLength);
					break;
				case MouseEvent.MOUSE_UP:
					simIndex++;
					newEvent = new NInputEvent(NInputEvent.ZBE, simIndex, simLength);
					break;
				case MouseEvent.RIGHT_MOUSE_UP:	
					newEvent = new NInputEvent(NInputEvent.BACK_RELEASED);
					break;
			}
			
			if(newEvent.type == NInputEvent.ZBE) {
				deltaIndex = firstUpdate?0:newEvent.zbeIndex- realIndex;
				realIndex = newEvent.zbeIndex;
				realLength = newEvent.zbeLength;
				firstUpdate = false;
				
				if(CCEDevice.instance._index+deltaIndex>=CCEDevice.instance.length || CCEDevice.instance._index+deltaIndex<0) return;
				CCEDevice.instance._index = CCEDevice.instance._index+deltaIndex;
			}
			CCEDevice.instance.lastEvent = newEvent.type;
			CCEDevice.instance.updateInteractionVariables();
			
			InputManager.instance.routeFromInputDevice(newEvent);
		}
	}
}