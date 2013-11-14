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
	import flash.events.GestureEvent;
	import flash.events.TransformGestureEvent;
	import flash.system.Capabilities;
	import flash.ui.Multitouch;
	import flash.ui.MultitouchInputMode;
	
	import lemonflow.io.IInputDeviceConnector;
	import lemonflow.io.InputManager;
	import lemonflow.io.device.TrackpadMac;
	import lemonflow.io.events.NInputEvent;

	public class IOConnectorTrackpadMac implements IInputDeviceConnector{
		protected var eventSource:InteractiveObject = null;
		
		private static var _instance:IOConnectorTrackpadMac = null;
		public static function get instance():IOConnectorTrackpadMac { return _instance?_instance:(_instance = new IOConnectorTrackpadMac()); }		

		public function IOConnectorTrackpadMac() {
			trace("Version:" + Capabilities.version +
				" | TouchScreen: "+Capabilities.touchscreenType+
				" | supportsTouchEvents: "+Multitouch.supportsTouchEvents+
				" | maxTouchPoints: "+Multitouch.maxTouchPoints+
				" | supportsGestureEvents: "+Multitouch.supportsGestureEvents+
				" | supportedGestures: "+Multitouch.supportedGestures
			);
		}
		
		public function updateInputDevice():void {}
		
		public function bindInputEventSource(interactiveSurface):void {
			if(eventSource!= null && eventSource.stage) {
				eventSource.stage.removeEventListener( GestureEvent.GESTURE_TWO_FINGER_TAP, onMultitouchEvent );
				eventSource.stage.removeEventListener( TransformGestureEvent.GESTURE_PAN, onMultitouchEvent );
				eventSource.stage.removeEventListener( TransformGestureEvent.GESTURE_ROTATE, onMultitouchEvent );
				eventSource.stage.removeEventListener( TransformGestureEvent.GESTURE_ZOOM, onMultitouchEvent );
				eventSource.stage.removeEventListener( TransformGestureEvent.GESTURE_SWIPE, onMultitouchEvent );
			}
			
			eventSource = interactiveSurface;
			
			var eventListeners:Function = function():void {
				Multitouch.inputMode = MultitouchInputMode.GESTURE;
				eventSource.stage.addEventListener( GestureEvent.GESTURE_TWO_FINGER_TAP, onMultitouchEvent );
				eventSource.stage.addEventListener( TransformGestureEvent.GESTURE_PAN, onMultitouchEvent );
				eventSource.stage.addEventListener( TransformGestureEvent.GESTURE_SWIPE, onMultitouchEvent );
				eventSource.stage.addEventListener( TransformGestureEvent.GESTURE_ROTATE, onMultitouchEvent );
				eventSource.stage.addEventListener( TransformGestureEvent.GESTURE_ZOOM, onMultitouchEvent );
			}
				
			if(eventSource.stage == null) { 
				eventSource.addEventListener(Event.ADDED_TO_STAGE, eventListeners); 
			}
			else {
				eventListeners();
			}
		}
		
		private var tge: TransformGestureEvent;
		private var ge: GestureEvent;
		private var e:NInputEvent = new NInputEvent(NInputEvent.TRACKPAD);
		
		protected function onMultitouchEvent(event:Event):void {
			if ( event is TransformGestureEvent ) {
//				trace(event.toString());
				tge = event as TransformGestureEvent;
				
				TrackpadMac.instance.localX = tge.localX;
				TrackpadMac.instance.localY = tge.localY;
				TrackpadMac.instance.offsetX = tge.offsetX;
				TrackpadMac.instance.offsetY = tge.offsetY;
				TrackpadMac.instance.phase = tge.phase;
				TrackpadMac.instance.totalOffsetX = (tge.phase =="begin")?0:TrackpadMac.instance.totalOffsetX + tge.offsetX;
				TrackpadMac.instance.totalOffsetY = (tge.phase =="begin")?0:TrackpadMac.instance.totalOffsetY + tge.offsetY;
				
				InputManager.instance.routeFromInputDevice(e);
			} else if ( event is GestureEvent ) {
				trace(event.type +" GestureEvent "+GestureEvent(event).phase + " " + GestureEvent(event).localY );
				ge = event as GestureEvent;
			} 
		}
	}
}