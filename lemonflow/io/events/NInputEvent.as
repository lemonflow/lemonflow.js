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

package lemonflow.io.events
{
	import flash.events.Event;

	public class NInputEvent extends Event
	{
		public static const PROCESSING_CURSOR:String = "cursor";
		public static const PROCESSING_CURSOR_CLICK:String = "activate";
		public static const PROCESSING_CURSOR_SWIPE_DOWN:String = "swipedown";
		public static const PROCESSING_CURSOR_SWIPE_RIGHT:String = "swiperight";
		
		public static const GPS:String="gps";
		public static const TRIGGER0_PRESSED:String="trigger0";
		public static const TRIGGER0_RELEASED:String="trigger0_released";
		public static const TRIGGER1_PRESSED:String="trigger1";
		public static const TRIGGER1_RELEASED:String="trigger1_released";
		public static const TRIGGER2_PRESSED:String="trigger2";
		public static const TRIGGER2_RELEASED:String="trigger2_released";
		public static const TRIGGER3_PRESSED:String="trigger3";
		public static const TRIGGER3_RELEASED:String="trigger3_released";
		public static const TRIGGER4_RELEASED:String="trigger4_released";
		public static const TRIGGER5_RELEASED:String="trigger5_released";
		public static const TRIGGER6_RELEASED:String="trigger6_released";
		public static const TRIGGER7_RELEASED:String="trigger7_released";
		public static const TRIGGERSPACE_RELEASED:String="triggerspace_released";

		
		public static const ZBE:String="zbe";
		public static const ZBE_LEFT:String="zbe_counterclockwise";
		public static const ZBE_RIGHT:String="zbe_clockwise";
		
		public static const IPHONE_CONNECTED:String = "remoteConnected";
		public static const IPHONE_ACK:String = "remoteAck";
		public static const IPHONE_TOUCHPAD:String="cursor";
		public static const IPHONE_SCROLL:String="scroll";
		public static const IPHONE_KEYBOARD:String="spellerText";
		public static const IPHONE_SUBMIT:String="spellerSubmit";
		public static const SPELLER:String="speller";
		public static const NOTIFICATION:String="notification_incoming";
		public static const SMS:String="sms_incoming";
		
		public static const LEFT_PRESSED:String="left";
		public static const RIGHT_PRESSED:String="right";
		public static const UP_PRESSED:String="up";
		public static const DOWN_PRESSED:String="down";
		public static const UP_LEFT_PRESSED:String="left-up";
		public static const UP_RIGHT_PRESSED:String="right-up";
		public static const DOWN_LEFT_PRESSED:String="left-down";
		public static const DOWN_RIGHT_PRESSED:String="right-down";
		public static const SELECT_PRESSED:String="select";
		public static const BACK_PRESSED:String="back";
		public static const OPTIONS_PRESSED:String="cancel";
		
		public static const LEFT_RELEASED:String= "left_released";
		public static const RIGHT_RELEASED:String="right_released";
		public static const UP_RELEASED:String="up_released";
		public static const DOWN_RELEASED:String="down_released";
		public static const UP_LEFT_RELEASED:String="left-up_released";
		public static const UP_RIGHT_RELEASED:String="right-up_released";
		public static const DOWN_LEFT_RELEASED:String="left-down_released";
		public static const DOWN_RIGHT_RELEASED:String="right-down_released";
		public static const SELECT_RELEASED:String="select_released";
		public static const BACK_RELEASED:String="back_released";
		public static const OPTIONS_RELEASED:String="cancel_released";
		
		public static const RADIO_PRESSED:String="radio";
		public static const MEDIA_PRESSED:String="media";
		public static const BROWSER_PRESSED:String="browser";
		public static const NAV_PRESSED:String="nav";
		public static const TEL_PRESSED:String="tel";
		public static const MUTE_PRESSED:String="mute";
		public static const SYS_PRESSED:String="sys";
		public static const HANGUP_PRESSED:String="send_end";
		public static const PICKUP_PRESSED:String="send";
		
		public static const RADIO_RELEASED:String="radio_released";
		public static const MEDIA_RELEASED:String="media_released";
		public static const BROWSER_RELEASED:String="browser_released";
		public static const NAV_RELEASED:String="nav_released";
		public static const TEL_RELEASED:String="tel_released";
		public static const MUTE_RELEASED:String="mute_released";
		public static const SYS_RELEASED:String="sys_released";
		public static const HANGUP_RELEASED:String="hangup_released";
		public static const PICKUP_RELEASED:String="pickup_released";
		
		public static const ON_PRESSED:String="on";
		public static const REW_PRESSED:String="previous";
		public static const FFW_PRESSED:String="next";
		public static const EJECT_PRESSED:String="eject";
		public static const CLEAR_PRESSED:String="clear";
			
		public static const ON_RELEASED:String="on_released";
		public static const REW_RELEASED:String="previous_released";
		public static const FFW_RELEASED:String="next_released";
		public static const EJECT_RELEASED:String="eject_released";
		public static const CLEAR_RELEASED:String="clear_released";
		
		public static const NUM1_PRESSED:String="1";
		public static const NUM2_PRESSED:String="2";
		public static const NUM3_PRESSED:String="3";
		public static const NUM4_PRESSED:String="4";
		public static const NUM5_PRESSED:String="5";
		public static const NUM6_PRESSED:String="6";
		public static const NUM7_PRESSED:String="7";
		public static const NUM8_PRESSED:String="8";
		public static const NUM9_PRESSED:String="9";
		public static const NUM0_PRESSED:String="0";
		public static const NUMSTAR_PRESSED:String="*";
		public static const NUMHASH_PRESSED:String="#";
		
		public static const NUM1_RELEASED:String="1_released";
		public static const NUM2_RELEASED:String="2_released";
		public static const NUM3_RELEASED:String="3_released";
		public static const NUM4_RELEASED:String="4_released";
		public static const NUM5_RELEASED:String="5_released";
		public static const NUM6_RELEASED:String="6_released";
		public static const NUM7_RELEASED:String="7_released";
		public static const NUM8_RELEASED:String="8_released";
		public static const NUM9_RELEASED:String="9_released";
		public static const NUM0_RELEASED:String="0_released";
		public static const NUMSTAR_RELEASED:String="*_released";
		public static const NUMHASH_RELEASED:String="#_released";
		
		public static var MODEL_SYNC_DONE:String = "modelsyncdone";
		public static var XMLREADY:String = "XMLready"
			
		public static var SONG_FINISHED:String = "SONG_FINISHED"		
		
		public static var TRIP_ASSIST_TOGGLED:String = "tripAssistToggled";		
		public static var TRIP_ASSIST_MOVED:String = "tripAssistMoved";		
		public static var OPTIONS_MENU_TOGGLED:String = "optionsMenuToggled";
		public static var OPTIONS_MENU_CLOSED:String = "optionsMenuToggled2";
		public static var FULLSCREEN_CONTENT_TOGGLED:String = "fullscreenContent";
		
		public static var TOGGLE_INCOMING_MESSAGE:String = "showMessage";	
		
		public static const DIRECTIONS_PRESSED:Array	= [	NInputEvent.UP_PRESSED,
															NInputEvent.DOWN_PRESSED,
															NInputEvent.LEFT_PRESSED,
															NInputEvent.RIGHT_PRESSED,
															NInputEvent.DOWN_LEFT_PRESSED,
															NInputEvent.DOWN_RIGHT_PRESSED,
															NInputEvent.UP_LEFT_PRESSED,
															NInputEvent.UP_RIGHT_PRESSED	];
												
		public static const DIRECTIONS_RELEASED:Array   = [ NInputEvent.UP_RELEASED,
															NInputEvent.DOWN_RELEASED,
															NInputEvent.LEFT_RELEASED,
															NInputEvent.RIGHT_RELEASED,
															NInputEvent.DOWN_LEFT_RELEASED,
															NInputEvent.DOWN_RIGHT_RELEASED,
															NInputEvent.UP_LEFT_RELEASED,
															NInputEvent.UP_RIGHT_RELEASED	];
		
		public static const ONE_FINGER_TOUCHES:String = "singleFingerTouch";
		public static const TRACKPAD:String = "trackpad";
		
		public var lastDistX:Number = 0;
		public var lastDistY:Number = 0;
		public var startX:Number = 0;
		public var posX:Number = 0;
		public var posY:Number = 0;
		//public var oneFingerTouchState:String = "begin";
		public var zbeIndex:int=0;
		public var zbeLength:int=0;
		public var atpZBEStepSize:int=0;
		public var atpSpellerValue:String;
		public var atpAckType:String;
		
		public var atpGPSLat:Number;
		public var atpGPSLng:Number;
		public var atpGPSSpeed:Number;
		public var atpGPSHeading:Number;
		
		public var atpCursorX:Number;
		public var atpCursorY:Number;
		
		public var trackoffsetY:Number = 0;
		
		public function NInputEvent(type:String, zbeIndex:uint=0, zbeLength:uint=0, zbeStepSize:uint=0, bubbles:Boolean=false, cancelable:Boolean=false) {	
			super(type, bubbles, cancelable);
			this.zbeIndex=zbeIndex;
			this.zbeLength=zbeLength;
			this.atpZBEStepSize=zbeStepSize;
		}
	}
}
