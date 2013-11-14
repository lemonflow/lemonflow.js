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
	import lemonflow.io.device.CCEDevice;
	import lemonflow.io.InputManager;
	import lemonflow.io.events.NInputEvent;
	
	import flash.display.InteractiveObject;
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	
	import mx.core.UIComponent;

	public class IOConnectorKeyboard
	{
		protected var newZbeEvent:NInputEvent;
		protected var eventSource:InteractiveObject = null;
		
		private static var _instance:IOConnectorKeyboard = null;
		public function IOConnectorKeyboard() { _instance = this; }
		public static function get instance():IOConnectorKeyboard { return _instance?_instance:(_instance = new IOConnectorKeyboard()); }		

		public function updateInputDevice():void {
		}
		
		public function bindInputEventSource(s):void { 
			if(eventSource!= null && eventSource.stage) eventSource.stage.removeEventListener(KeyboardEvent.KEY_UP, handleInput);
			eventSource = s;
			
			if(s.stage == null) { 
				s.addEventListener(Event.ADDED_TO_STAGE, function (e:Event = null):void {
					s.stage.addEventListener(KeyboardEvent.KEY_UP, handleInput)
				}); 
			}
			else {
				s.stage.addEventListener(KeyboardEvent.KEY_UP, handleInput)
			}
		}
		
		protected function handleInput(e:*):void {
			if(e.type != KeyboardEvent.KEY_UP) return;
			switch (e.keyCode)
			{
				case Keyboard.SPACE:
					InputManager.instance.routeFromInputDevice(new NInputEvent(NInputEvent.TRIGGERSPACE_RELEASED));
					break;
				case Keyboard.M:
					break;
				case Keyboard.P:
					break;
				case Keyboard.R:	
					break;
				case Keyboard.A:
					break;
				case Keyboard.NUMBER_0:
					InputManager.instance.routeFromInputDevice(new NInputEvent(NInputEvent.TRIGGER0_RELEASED));
					break;
				case Keyboard.NUMBER_1:
					InputManager.instance.routeFromInputDevice(new NInputEvent(NInputEvent.TRIGGER1_RELEASED));
					break;
				case Keyboard.NUMBER_2:
					InputManager.instance.routeFromInputDevice(new NInputEvent(NInputEvent.TRIGGER2_RELEASED));
					break;
				case Keyboard.NUMBER_3:
					InputManager.instance.routeFromInputDevice(new NInputEvent(NInputEvent.TRIGGER3_RELEASED));
					break;	
				case  Keyboard.UP:  
					InputManager.instance.routeFromInputDevice(new NInputEvent(NInputEvent.UP_RELEASED));
					break;
				case  Keyboard.DOWN:  
					InputManager.instance.routeFromInputDevice(new NInputEvent(NInputEvent.DOWN_RELEASED));
					break;
				case  Keyboard.RIGHT:  
					InputManager.instance.routeFromInputDevice(new NInputEvent(NInputEvent.RIGHT_RELEASED));
					break;
				case  Keyboard.LEFT:  
					InputManager.instance.routeFromInputDevice(new NInputEvent(NInputEvent.LEFT_RELEASED));
					break;
			}
		}
	}
}