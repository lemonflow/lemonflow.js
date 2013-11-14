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
	
	import flash.display.InteractiveObject;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	
	import lemonflow.io.IInputDeviceConnector;
	import lemonflow.io.InputManager;
	import lemonflow.io.device.CCEDevice;
	import lemonflow.io.events.NInputEvent;

	public class IOConnectorSimGesture implements IInputDeviceConnector
	{
		protected var newZbeEvent:NInputEvent;
		protected var eventSource:InteractiveObject = null;
		
		private static var _instance:IOConnectorSimGesture = null;
		public function IOConnectorSimGesture() { _instance = this; }
		public static function get instance():IOConnectorSimGesture { return _instance?_instance:(_instance = new IOConnectorSimGesture()); }		

		private var deltaIndex:int = 0;
		private var realIndex:uint = 0;
		private var realLength:uint = 0;
		private var firstUpdate:Boolean = true;
		
		public function updateInputDevice():void {}
		
		public function bindInputEventSource(o):void { 
//			
//			if(eventSource!= null && eventSource.stage) {
//				eventSource.stage.removeEventListener(MouseEvent.MOUSE_MOVE, onMultitouchEvent);
//				eventSource.stage.removeEventListener(MouseEvent.MOUSE_DOWN, onMultitouchEvent);
//				eventSource.stage.removeEventListener(MouseEvent.MOUSE_UP,  onMultitouchEvent);
//			}
//			eventSource = s;
//			
//			if(eventSource.stage == null) { 
//				eventSource.addEventListener(Event.ADDED_TO_STAGE, function (e:Event = null):void {
//					eventSource.stage.addEventListener( MouseEvent.MOUSE_DOWN, onMultitouchEvent );
//					eventSource.stage.addEventListener( MouseEvent.MOUSE_UP, onMultitouchEvent );
//				}); 
//			}
//			else {
//				eventSource.stage.addEventListener( MouseEvent.MOUSE_DOWN, onMultitouchEvent );
//				eventSource.stage.addEventListener( MouseEvent.MOUSE_UP, onMultitouchEvent );
//			}
//			touch = Touch.instance;
			
			if(eventSource!= null && eventSource.stage) o.stage.removeEventListener(KeyboardEvent.KEY_UP, handleInput);
			eventSource = o;
			
			if(o.stage == null) { 
				o.addEventListener(Event.ADDED_TO_STAGE, function (e:Event = null):void {
					o.stage.addEventListener(KeyboardEvent.KEY_UP, handleInput)
				}); 
			}
			else {
				o.stage.addEventListener(KeyboardEvent.KEY_UP, handleInput)
			}
		}
		
		
		private var simIndex:int = 0;
		private var simLength:int = 255;
		private var firstZBE:Boolean = true;
		
		protected function handleInput(e:*):void {
			var newEvent:NInputEvent;
			
			if(e.type != KeyboardEvent.KEY_UP) return;
			if(firstZBE && (Keyboard.LEFT || Keyboard.RIGHT)) { //first ZBE response will be ignored > send two times
				newEvent = new NInputEvent(NInputEvent.ZBE, simIndex, simLength);
				firstZBE = false;
			}
			
			switch (e.keyCode)
			{
				case Keyboard.NUMBER_0:
					newEvent = new NInputEvent(NInputEvent.TRIGGER0_RELEASED);
					break;
				case Keyboard.NUMBER_1:
					newEvent = new NInputEvent(NInputEvent.TRIGGER1_RELEASED);
					break;
				case Keyboard.NUMBER_2:
					newEvent = new NInputEvent(NInputEvent.TRIGGER2_RELEASED);
					break;
				case Keyboard.NUMBER_3:
					newEvent = new NInputEvent(NInputEvent.TRIGGER3_RELEASED);
				case Keyboard.NUMBER_4:
					newEvent = new NInputEvent(NInputEvent.TRIGGER4_RELEASED);
					break;	
				case Keyboard.NUMBER_5:
					newEvent = new NInputEvent(NInputEvent.TRIGGER5_RELEASED);
					break;	
				case Keyboard.NUMBER_6:
					newEvent = new NInputEvent(NInputEvent.TRIGGER6_RELEASED);
					break;
				case Keyboard.NUMBER_7:
					newEvent = new NInputEvent(NInputEvent.TRIGGER7_RELEASED);
					break;	
				case  Keyboard.UP:  
					newEvent = new NInputEvent(NInputEvent.UP_RELEASED);
					break;
				case  Keyboard.DOWN:  
					newEvent = new NInputEvent(NInputEvent.DOWN_RELEASED);
					break;
				case  Keyboard.LEFT:  
					newEvent = new NInputEvent(NInputEvent.ZBE, --simIndex, simLength);
					break;
				case  Keyboard.RIGHT:	
					newEvent = new NInputEvent(NInputEvent.ZBE, ++simIndex, simLength);
					break;
				case Keyboard.SPACE:
					newEvent = new NInputEvent(NInputEvent.SELECT_RELEASED);
					break;
				case Keyboard.BACKSPACE:
					newEvent = new NInputEvent(NInputEvent.BACK_RELEASED);
					break;
				default:
					return;
			}
			
			
//			
//			ie = new NInputEvent("singleFingerTouch");
//			ie.posX = e.stageX;
//			ie.posY = e.stageY;
//			
//			
//			touch.curX = e.stageX;
//			touch.curY = e.stageY;
//			
//			switch(e.type) {
//				case MouseEvent.MOUSE_DOWN:
//					eventSource.addEventListener( MouseEvent.MOUSE_MOVE, onMultitouchEvent );
//					eventSource.addEventListener(MouseEvent.MOUSE_OUT, onMultitouchEvent);
//					
//					touch.oneFingerTouchState = "begin";
//					touch.touchStartX = e.stageX;
//					touch.touchLastX = e.stageX;
//					touch.touchStartTime = new Date().getTime();
//					break;
//				
//				case MouseEvent.MOUSE_MOVE:
//					touch.oneFingerTouchState = "update";
//					
//					touch.touchLastDeltaX  = e.stageX-touch.touchLastX;
//					tTouchCurTime =  new Date().getTime();
//					touch.touchLastDeltaTime = (tTouchCurTime - touch.touchLastTime);
//					touch.touchLastTime = tTouchCurTime;
//					touch.touchLastSpeed = (touch.touchLastDeltaTime == 0)?0:(touch.touchLastDeltaX/touch.touchLastDeltaTime);
//					touch.touchLastX = e.stageX;
//					touch.touchLastY = e.stageY;
//					break;
//				
//				case MouseEvent.MOUSE_UP:
//					eventSource.removeEventListener(MouseEvent.MOUSE_MOVE, onMultitouchEvent);
//					eventSource.removeEventListener(MouseEvent.MOUSE_OUT, onMultitouchEvent);
//					touch.oneFingerTouchState = "end";
//					
//					touch.touchLastDeltaX  = e.stageX-touch.touchLastX;
//					tTouchCurTime =  new Date().getTime();
//					touch.touchLastDeltaTime = (tTouchCurTime - touch.touchLastTime);
//					touch.touchLastTime = tTouchCurTime;
//					touch.touchLastX = e.stageX;
//					
//					touch.touchEndTime = tTouchCurTime;
//					touch.touchEndDeltaX = touch.touchEndX - touch.touchStartX;
//					touch.touchEndDeltaTime = (touch.touchEndTime - touch.touchStartTime);
//					
//					tTouchCurSpeed = (touch.touchLastDeltaTime == 0)?0:(touch.touchLastDeltaX/touch.touchLastDeltaTime);
//					touch.touchEndAccel =  (touch.touchEndDeltaTime == 0)?0:((touch.touchLastSpeed - tTouchCurSpeed)/touch.touchEndDeltaTime);  
//					touch.touchEndSpeed = (touch.touchEndDeltaTime == 0)?0:(touch.touchEndDeltaX/touch.touchEndDeltaTime);
//					touch.touchLastSpeed = tTouchCurSpeed;
//					
//					touch.touchEndX = e.stageX;
//					touch.touchEndY = e.stageY;
//					break;
			
			InputManager.instance.routeFromInputDevice(newEvent);
			
			
			
		}
	}
}