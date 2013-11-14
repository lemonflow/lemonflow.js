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
	import lemonflow.io.events.NInputEvent;
	import lemonflow.io.device.CCEDevice;
	import lemonflow.io.InputManager;
	
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.events.TimerEvent;
	import flash.net.Socket;
	import flash.utils.ByteArray;
	import flash.utils.Timer;
	
	import flashx.textLayout.utils.CharacterUtil;

	/**________________________________________________________________________________________
	* socket communication to and from the ZBE, faceplate buttons, headunit buttons, GPS
	*/
		 
	public class IOConnectorCCEHardware 
	{
		protected var socket:Socket=null;
		private var _directionPressed:String;
		private var connectTimer:Timer = new Timer(1000, 1);
		
		
		private static var _instance:IOConnectorCCEHardware = null;
		public static function get instance():IOConnectorCCEHardware { return _instance?_instance:(_instance = new IOConnectorCCEHardware()); }		

		
		public function IOConnectorCCEHardware() {
			_instance = this;
			
			this.socket = new Socket();
			this.socket.addEventListener(Event.CONNECT, 					socketConnectHandler);
			this.socket.addEventListener(Event.CLOSE, 						socketCloseHandler);
			this.socket.addEventListener(ProgressEvent.SOCKET_DATA, 		socketDataHandler);
			this.socket.addEventListener(IOErrorEvent.IO_ERROR, 			socketIOErrorHandler);
			this.socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, socketSecurityErrorHandler);
			
			connectTimer.addEventListener(TimerEvent.TIMER, tryConnectSocket);
			connectTimer.start();
		}
		
		public function tryConnectSocket(e:Event):void {
			if (!this.socket.connected) {
				trace("try to connect to CCE Hardware...");
				this.socket.connect("localhost",2010);
			}
		}
		
		public function disconnectSocket():void {
			if (this.socket && this.socket.connected) {
				this.socket.close();
			}
		}
		public function sendString(index:int, length:int):void {
			if (this.socket && this.socket.connected) {
				this.socket.writeByte(0x15);
				this.socket.writeByte(index);
				this.socket.writeByte(length);
				this.socket.flush();
			}
		}		
		
		private function socketDataHandler(e:ProgressEvent):void {
			var newEvent:NInputEvent;
			var message:ByteArray = new ByteArray();
			socket.readBytes(message,0, this.socket.bytesAvailable);
			
			if(message[0] == 0x15) //zbe {
				newEvent = new NInputEvent(NInputEvent.ZBE, uint(message[1]), uint(message[2]));
			else if(message[0] == 0x01 && message[1] == 0x05 && message[2] == 0x01) //zbe SELECT pressed
				newEvent = new NInputEvent(NInputEvent.SELECT_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x05 && message[2] == 0x00) //zbe SELECT release
				newEvent = new NInputEvent(NInputEvent.SELECT_RELEASED);
			else if(message[0] == 0x01 && message[1] == 0x01 && message[2] == 0x01) //zbe LEFT pressed
				newEvent = new NInputEvent(NInputEvent.LEFT_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x01 && message[2] == 0x00) //zbe LEFT released
				newEvent = new NInputEvent(NInputEvent.LEFT_RELEASED);
			else if(message[0] == 0x01 && message[1] == 0x02 && message[2] == 0x01) //zbe RIGHT pressed
				newEvent = new NInputEvent(NInputEvent.RIGHT_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x02 && message[2] == 0x00) //zbe RIGHT released
				newEvent = new NInputEvent(NInputEvent.RIGHT_RELEASED);			
			else if(message[0] == 0x01 && message[1] == 0x03 && message[2] == 0x01) //zbe UP pressed
				newEvent = new NInputEvent(NInputEvent.UP_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x03 && message[2] == 0x00) //zbe UP released
				newEvent = new NInputEvent(NInputEvent.UP_RELEASED);				
			else if(message[0] == 0x01 && message[1] == 0x04 && message[2] == 0x01) //zbe DOWN pressed
				newEvent = new NInputEvent(NInputEvent.DOWN_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x04 && message[2] == 0x00) //zbe DOWN released
				newEvent = new NInputEvent(NInputEvent.DOWN_RELEASED);	
			else if(message[0] == 0x01 && message[1] == 0x10 && message[2] == 0x01) //zbe BACK pressed (original labeled DISC|RADIO)
				newEvent = new NInputEvent(NInputEvent.BACK_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x10 && message[2] == 0x00) //zbe BACK released (original labeled DISC|RADIO)
				newEvent = new NInputEvent(NInputEvent.BACK_RELEASED);	
			else if(message[0] == 0x01 && message[1] == 0x0E && message[2] == 0x01) //zbe OPTIONS pressed (original labeled TEL|NAV)
				newEvent = new NInputEvent(NInputEvent.OPTIONS_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x0E && message[2] == 0x00) //zbe OPTIONS released (original labeled TEL|NAV)
				newEvent = new NInputEvent(NInputEvent.OPTIONS_RELEASED);	
			else if(message[0] == 0x01 && message[1] == 0x0B && message[2] == 0x01) //zbe LEFTTAB pressed (original labeled BACK)
				newEvent = new NInputEvent(NInputEvent.REW_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x0B && message[2] == 0x00) //zbe LEFTTAB released (original labeled BACK)
				newEvent = new NInputEvent(NInputEvent.REW_RELEASED);	
			else if(message[0] == 0x01 && message[1] == 0x0B && message[2] == 0x01) //zbe RIGHTTAB pressed (original labeled SEATSETTINGS)
				newEvent = new NInputEvent(NInputEvent.FFW_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x0B && message[2] == 0x00) //zbe RIGHTTAB released (original labeled SEATSETTINGS)
				newEvent = new NInputEvent(NInputEvent.FFW_RELEASED);
			else {
				trace("unknown: 0:"+ message[0] + " 1:" + message[1] +" 2:" + message[2]);
				return;
			}
			
			//trace("event: " + newEvent.type);
			InputManager.instance.routeFromInputDevice(newEvent);
		}
		
		
		private function socketConnectHandler(e:Event):void {
			trace("connection established");
		}
		
		private function socketCloseHandler(e:Event):void {
			connectTimer.reset();
			connectTimer.start();
		}
		
		private function socketIOErrorHandler(e:Event):void {
			connectTimer.reset();
			connectTimer.start();
		}
		private function socketSecurityErrorHandler(e:Event):void {
			connectTimer.reset();
			connectTimer.start();
		}
	}
}