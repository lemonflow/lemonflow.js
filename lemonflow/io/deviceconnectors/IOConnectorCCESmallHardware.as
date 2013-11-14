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
	import flash.desktop.NativeApplication;
	import flash.desktop.NativeProcess;
	import flash.desktop.NativeProcessStartupInfo;
	import flash.display.Stage;
	import flash.errors.IllegalOperationError;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.NativeProcessExitEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.events.TimerEvent;
	import flash.filesystem.File;
	import flash.net.Socket;
	import flash.utils.ByteArray;
	import flash.utils.Timer;
	
	import lemonflow.io.IInputDeviceConnector;
	import lemonflow.io.InputManager;
	import lemonflow.io.device.CCEDevice;
	import lemonflow.io.events.NInputEvent;

	/**________________________________________________________________________________________
	* socket communication to and from the ZBE, faceplate buttons, headunit buttons, GPS
	*/
		 
	public class IOConnectorCCESmallHardware implements IInputDeviceConnector
	{
		protected var socket:Socket=null;
		protected var process:NativeProcess = null;
		
		protected var transportType:String = "process";
		
		protected var nativeProcessStartupInfo:NativeProcessStartupInfo
		
		private var _directionPressed:String;
		private var connectTimer:Timer = new Timer(1000, 1);
		protected var eventSource:Stage = null;
		
		private var deltaIndex:int = 0;
		private var realIndex:uint = 0;
		private var realLength:uint = 0;
		private var firstUpdate:Boolean = true;
		
		private static var _instance:IOConnectorCCESmallHardware = null;
		public static function get instance():IOConnectorCCESmallHardware { return _instance?_instance:(_instance = new IOConnectorCCESmallHardware()); }		
		public function IOConnectorCCESmallHardware() {}
		
		public function updateInputDevice():void {
			sendString(int(CCEDevice.instance._index), int(CCEDevice.instance._length));
		}
		
		public function bindInputEventSource(s):void { 
			setupExternalConnector();
		}
		
		public function setupExternalConnector():void {
			if(transportType == "socket") {
				this.socket = new Socket();
				this.socket.addEventListener(Event.CONNECT, 					socketConnectHandler);
				this.socket.addEventListener(ProgressEvent.SOCKET_DATA, 		socketDataHandler);
				this.socket.addEventListener(Event.CLOSE, 						socketRetryHandler);
				this.socket.addEventListener(IOErrorEvent.IO_ERROR, 			socketRetryHandler);
				this.socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, socketRetryHandler);
			}
			
			if(transportType == "process") {
				var file:File = File.applicationDirectory;
				file = file.resolvePath("external_bin/macos/cce_input_userspace_driver");
				nativeProcessStartupInfo = new NativeProcessStartupInfo();
				nativeProcessStartupInfo.executable = file;
				var arg:Vector.<String> = new Vector.<String>();
				nativeProcessStartupInfo.arguments = arg;
				process = new NativeProcess();
				process.addEventListener(ProgressEvent.STANDARD_OUTPUT_DATA, stdoutDataHandler);
				process.addEventListener(NativeProcessExitEvent.EXIT, socketRetryHandler)
				NativeApplication.nativeApplication.addEventListener(Event.EXITING, processClose);
			}
			
			connectTimer.addEventListener(TimerEvent.TIMER, tryConnect);
			connectTimer.start();
		}
		
		public function tryConnect(e:Event):void {
			if (transportType =="socket" && !this.socket.connected) {
				trace("try to connect to CCE Hardware (by socket) ...");
				this.socket.connect("localhost", 2010);
			}
			
			if (transportType =="process" && !this.process.running) {
				if(!NativeProcess.isSupported) {
					trace("Native Process not supported");
					return;
				}
				trace("try to connect to CCE Hardware (by inter process) ...");
				try {
					process.start(nativeProcessStartupInfo);
				} catch (error:IllegalOperationError) {
					trace("NativeProcess Illegal Operation: "+error.toString());
				} catch (error:ArgumentError) {
					trace("NativeProcess Argument Error: "+error.toString());
				} catch (error:Error) {
					trace ("NativeProcess Error: "+error.toString());
				}
			}
		}
		
		public function disconnectSocket():void {
			if (this.socket && this.socket.connected) {
				this.socket.close();
			}
		}
		
		private function socketConnectHandler(e:Event):void {
			trace("connection established");
		}
		
		private function socketRetryHandler(e:Event):void {
			connectTimer.reset();
			connectTimer.start();
		}
		
		private function processClose(e:Event):void {
			process.exit(true);
		}
		
		private function socketDataHandler(e:ProgressEvent):void {
			var message:ByteArray = new ByteArray();
			socket.readBytes(message,0, this.socket.bytesAvailable);
			interpretData(message);
		}
		
		private function stdoutDataHandler(e:ProgressEvent):void {
			var bytes:ByteArray = new ByteArray();
			process.standardOutput.readBytes(bytes,0,e.bytesLoaded);
			interpretData(bytes);
		}
		
		public function sendString(index:int, length:int):void {
			if (this.socket && this.socket.connected) {
				this.socket.writeByte(0x15);
				this.socket.writeByte(index);
				this.socket.writeByte(length);
				this.socket.flush();
			}
		}	
		
		private function interpretData(message:ByteArray):void {
			var newEvent:NInputEvent;
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
			else if(message[0] == 0x01 && message[1] == 0x0B && message[2] == 0x01) //zbe BACK pressed (original labeled BACK)
				newEvent = new NInputEvent(NInputEvent.BACK_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x0B && message[2] == 0x00) //zbe BACK released (original labeled BACK)
				newEvent = new NInputEvent(NInputEvent.BACK_RELEASED);	
			else if(message[0] == 0x01 && message[1] == 0x16 && message[2] == 0x01) //zbe OPTIONS pressed (original labeled C)
				newEvent = new NInputEvent(NInputEvent.OPTIONS_PRESSED);
			else if(message[0] == 0x01 && message[1] == 0x16 && message[2] == 0x00) //zbe OPTIONS released (original labeled C)
				newEvent = new NInputEvent(NInputEvent.OPTIONS_RELEASED);
			else {
				trace("unknown zbe event: 0:"+ message[0] + " 1:" + message[1] +" 2:" + message[2]);
				return;
			}
			
//			trace("event: " + newEvent.type+ " 1:" + message[1] +" 2:" + message[2]);
			
//			//contrained ZBE
//			if(newEvent.type == NInputEvent.ZBE) {
//				if(newEvent.zbeIndex>=CCEDevice.instance.length || newEvent.zbeIndex<0) return;
//					 CCEDevice.instance._index = newEvent.zbeIndex;
//					 CCEDevice.instance._length = newEvent.zbeLength;
//			}
			
			//relative ZBE, does not rely on updating the length
			if(newEvent.type == NInputEvent.ZBE) {
				deltaIndex = firstUpdate?0:newEvent.zbeIndex- realIndex;
				realIndex = newEvent.zbeIndex;
				realLength = newEvent.zbeLength;
				firstUpdate = false;
				
				if(CCEDevice.instance._index+deltaIndex>=CCEDevice.instance.length || CCEDevice.instance._index+deltaIndex<0) return;
				CCEDevice.instance._index = CCEDevice.instance._index+deltaIndex;
			}
			CCEDevice.instance.lastEvent = newEvent.type;
			
			
			InputManager.instance.routeFromInputDevice(newEvent);
		}
	}
}