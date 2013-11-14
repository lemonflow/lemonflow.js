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
	import flash.events.MouseEvent;
	import flash.events.TouchEvent;
	import flash.ui.Multitouch;
	import flash.ui.MultitouchInputMode;
	
	import lemonflow.io.InputManager;
	import lemonflow.io.device.Touch;
	import lemonflow.io.events.NInputEvent;

	public class IOConnectorTouchiOS
	{
		protected var eventSource:InteractiveObject = null;
		private var touch:Touch = null;
		private var tTouchCurTime:Number = 0;
		private var tTouchCurSpeed:Number = 0;

		private static var _instance:IOConnectorTouchiOS = null;
		public function IOConnectorTouchiOS() { _instance = this; }
		public static function get instance():IOConnectorTouchiOS { return _instance?_instance:(_instance = new IOConnectorTouchiOS()); }		

		public function bindInputEventSource(s):void { 
			Multitouch.inputMode = MultitouchInputMode.TOUCH_POINT;
			
			if(eventSource!= null && eventSource.stage) {
				eventSource.stage.removeEventListener(TouchEvent.TOUCH_MOVE, onMultitouchEvent);
				eventSource.stage.removeEventListener(TouchEvent.TOUCH_BEGIN, onMultitouchEvent);
				eventSource.stage.removeEventListener(TouchEvent.TOUCH_END,  onMultitouchEvent);
			}
			eventSource = s;
			
			if(eventSource.stage == null) { 
				eventSource.addEventListener(Event.ADDED_TO_STAGE, function (e:Event = null):void {
					eventSource.stage.addEventListener(TouchEvent.TOUCH_BEGIN, onMultitouchEvent );
					eventSource.stage.addEventListener(TouchEvent.TOUCH_END, onMultitouchEvent );
				}); 
			}
			else {
				eventSource.stage.addEventListener(TouchEvent.TOUCH_BEGIN, onMultitouchEvent );
				eventSource.stage.addEventListener(TouchEvent.TOUCH_END, onMultitouchEvent );
			}
			touch = Touch.instance;
		}
		
		private var ie:NInputEvent;
		protected function onMultitouchEvent(e:MouseEvent):void {
			ie = new NInputEvent("singleFingerTouch");
			ie.posX = e.stageX;
			ie.posY = e.stageY;
			
			
			touch.curX = e.stageX;
			touch.curY = e.stageY;
			
			switch(e.type) {
				case TouchEvent.TOUCH_BEGIN:
					eventSource.addEventListener(TouchEvent.TOUCH_MOVE, onMultitouchEvent );
					eventSource.addEventListener(TouchEvent.TOUCH_OUT, onMultitouchEvent);
					
					touch.oneFingerTouchState = "begin";
					touch.touchStartX = e.stageX;
					touch.touchLastX = e.stageX;
					touch.touchStartTime = new Date().getTime();
					break;
				
				case TouchEvent.TOUCH_MOVE:
					touch.oneFingerTouchState = "update";
					
					touch.touchLastDeltaX  = e.stageX-touch.touchLastX;
				 	tTouchCurTime =  new Date().getTime();
					touch.touchLastDeltaTime = (tTouchCurTime - touch.touchLastTime);
					touch.touchLastTime = tTouchCurTime;
					touch.touchLastSpeed = (touch.touchLastDeltaTime == 0)?0:(touch.touchLastDeltaX/touch.touchLastDeltaTime);
					touch.touchLastX = e.stageX;
					touch.touchLastY = e.stageY;
					break;
				
				case TouchEvent.TOUCH_END:
					eventSource.removeEventListener(TouchEvent.TOUCH_MOVE, onMultitouchEvent );
					eventSource.removeEventListener(TouchEvent.TOUCH_OUT, onMultitouchEvent);
					touch.oneFingerTouchState = "end";
					
					touch.touchLastDeltaX  = e.stageX-touch.touchLastX;
					tTouchCurTime =  new Date().getTime();
					touch.touchLastDeltaTime = (tTouchCurTime - touch.touchLastTime);
					touch.touchLastTime = tTouchCurTime;
					touch.touchLastX = e.stageX;
					
					touch.touchEndTime = tTouchCurTime;
					touch.touchEndDeltaX = touch.touchEndX - touch.touchStartX;
					touch.touchEndDeltaTime = (touch.touchEndTime - touch.touchStartTime);

					tTouchCurSpeed = (touch.touchLastDeltaTime == 0)?0:(touch.touchLastDeltaX/touch.touchLastDeltaTime);
					touch.touchEndAccel =  (touch.touchEndDeltaTime == 0)?0:((touch.touchLastSpeed - tTouchCurSpeed)/touch.touchEndDeltaTime);  
					touch.touchEndSpeed = (touch.touchEndDeltaTime == 0)?0:(touch.touchEndDeltaX/touch.touchEndDeltaTime);
					touch.touchLastSpeed = tTouchCurSpeed;
					
					touch.touchEndX = e.stageX;
					touch.touchEndY = e.stageY;
					break;
			}

			ie.lastDistX = touch.touchLastDeltaX;
			ie.lastDistY = touch.touchLastDeltaY;
			InputManager.instance.routeFromInputDevice(ie);
		}
	}
}