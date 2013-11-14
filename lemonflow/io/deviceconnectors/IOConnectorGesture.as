/*
Copyright (c) 2006-2011, Philipp Fischer & Anil Mohan
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

* The name Philipp Fischer or Anil Mohan may not be used to endorse or promote products
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
	import flash.errors.IllegalOperationError;
	import flash.events.DatagramSocketDataEvent;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.InvokeEvent;
	import flash.events.SecurityErrorEvent;
	import flash.events.TimerEvent;
	import flash.media.StageVideo;
	import flash.net.DatagramSocket;
	import flash.utils.ByteArray;
	import flash.utils.Timer;
	
	import lemonflow.io.IInputDeviceConnector;
	import lemonflow.io.InputManager;
	import lemonflow.io.device.Gesture;
	import lemonflow.io.events.NInputEvent;
	
	/**
	 * socket communication to and from the CES Hardware
	 */
	
	public class IOConnectorGesture implements IInputDeviceConnector
	{
		private var datagramSocketIn:DatagramSocket; 
		private var datagramSocketOut:DatagramSocket; 
		// The IP and port for this computer 
		private var localPort:int = 2011; 
		
		// The IP and port for the target computer 
		private var targetIP:String ;//= "192.168.1.181"; 
		private var targetPort:int = 2012; 
		
		private var byteIOStream:String;
		private var connectTimer:Timer;
		
		private static var _instance:IOConnectorGesture = null;
		public static function get instance():IOConnectorGesture { return _instance?_instance:(_instance = new IOConnectorGesture()); }		
		public function IOConnectorGesture() {}
		
		/**
		 * Public Methods
		 */
		
		public function bindInputEventSource(s):void { 
			NativeApplication.nativeApplication.addEventListener(InvokeEvent.INVOKE, function (e:InvokeEvent) {
				trace("InvokeEvent.arguments:" + e.arguments);
				// check for command line arguments, else use default values
				if(e.arguments.length > 0) {
					if(e.arguments.length > 1) {
						targetIP = e.arguments[1];
						if(e.arguments.length > 2) {
							localPort = Number(e.arguments[2]);
							if(e.arguments.length > 3) {
								targetPort = Number(e.arguments[3]);
							}
						}
					}
				}
				setupExternalConnector();
			});
		}
		
		public function setupExternalConnector():void {
			datagramSocketOut = new DatagramSocket();
			
			datagramSocketIn = new DatagramSocket();
			
			datagramSocketIn.addEventListener(Event.CLOSE, socketRetryHandler);
			datagramSocketIn.addEventListener(IOErrorEvent.IO_ERROR, socketRetryHandler);
			datagramSocketIn.addEventListener(DatagramSocketDataEvent.DATA, socketDataHandler);
			
			datagramSocketIn.bind(localPort);
			datagramSocketIn.receive();
			
			connectTimer = new Timer(500, 0);
			connectTimer.addEventListener(TimerEvent.TIMER, tryConnect);
			connectTimer.start();
		}
		
		public function disconnectSocket():void {
			if (datagramSocketIn && datagramSocketIn.connected) {
				datagramSocketIn.close();
			}
		}
		
		public function updateInputDevice():void {
			if(Gesture.instance.currentGestureEvent == "HANDTRACKING_ON_HUD_ACTION_CLICK") {
				var messageString:String = "{id:HUD_MARKER_ACTIVATED, markerID:" + 4 + "}";
				sendString(messageString);
			}
		}
		
		private function tryConnect(e:Event):void {
			if(targetIP!=null)
			{
				if (!datagramSocketOut.connected) {
					trace("attempting to connect to " + targetIP + ":" + targetPort + " via UDP socket...");
					datagramSocketOut.connect(targetIP, targetPort);
				}
				else {
					updateInputDevice();
				}
			}
		}
		
		private function socketRetryHandler(e:Event):void {
			connectTimer.reset();
			connectTimer.start();
		}
		
		private function socketDataHandler(event:DatagramSocketDataEvent):void {
			this.targetIP=event.srcAddress;
			var 	message:String = event.data.readUTFBytes(event.data.bytesAvailable);
			byteIOStream += message;
			trace("UDP byte stream:" + message);
			parseMessageToXML();
		}
		
		private function parseMessageToXML():void {
			var index:Number = byteIOStream.search("</ProcessingMessage>");
			//			trace("search(\"</ProcessingMessage>\")" + index);
			if(index > -1) {
				var stringForXML:String = byteIOStream.substr(0, index + 20);
				interpretData(stringForXML);
				byteIOStream = byteIOStream.substr(index + 21, byteIOStream.length);
				parseMessageToXML();
			}
		}
		
		private function interpretData(message:String):void {
			try {
				var messageXML:XML = new XML(message);
				Gesture.instance.xml = messageXML;
				
				
				if(messageXML.hasOwnProperty("currentCursor")) {
					Gesture.instance.currentGestureEvent = NInputEvent.PROCESSING_CURSOR;
					Gesture.instance.curX = messageXML.currentCursor.x;
					Gesture.instance.curY = messageXML.currentCursor.y;
				}
				else if(messageXML.hasOwnProperty("gesture")) {
					var gesture:String = messageXML.gesture.id;
					switch(gesture)
					{
						case "HANDTRACKING_ON_HUD_ACTION_CLICK":
						{	
							Gesture.instance.currentGestureEvent = NInputEvent.PROCESSING_CURSOR_CLICK;
							break;	
						}
						case "HANDTRACKING_ON_HUD_ACTION_SWIPE_RIGHT":
						{	
							Gesture.instance.currentGestureEvent = NInputEvent.PROCESSING_CURSOR_SWIPE_RIGHT;
							break;	
						}
					}
				}
			}
			catch(error:Error) {
				trace("Invalid XML error:" + error);
				return;
			}
			var processingEvent:NInputEvent = new NInputEvent(Gesture.instance.currentGestureEvent);
			trace(processingEvent.type);
			InputManager.instance.routeFromInputDevice(processingEvent);
		}
		
		private function sendString(message:String):void {
			var data:ByteArray = new ByteArray();
			data.writeUTFBytes(message);
			
			try {
				datagramSocketOut.send(data); 
			}
			catch (error:Error) {
				trace(error.message);
			}
		}
	}
}