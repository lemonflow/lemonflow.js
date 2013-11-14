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

package lemonflow.io.device
{
	import lemonflow.ui.base.VisualItem;
	
	import flash.display.DisplayObject;

	public class Touch
	{
		public var oneFingerTouchState:String = "begin";
		
		public var touchTimeStamp:Number = 0;
		public var lastX:Number = 0;
		public var lastY:Number = 0;	
		
		public var touchLastDeltaX:Number = 0;
		public var touchLastDeltaY:Number = 0;
		public var touchLastDeltaTime:Number = 0;
		public var touchLastTime:Number = 0;
		public var touchLastSpeed:Number = 0;
		
		public var touchStartX:Number = 0;
		public var touchStartY:Number = 0;
		public var touchStartTime:Number = 0;
		
		public var touchEndTime:Number = 0;
		public var touchEndDeltaTime:Number = 0;
		public var touchEndDeltaX:Number = 0;
		public var touchEndAccel:Number = 0;
		public var touchEndSpeed:Number = 0;
		public var touchEndX:Number = 0;
		public var touchEndY:Number = 0;
		public var touchLastY:Number = 0;
		public var touchLastX:Number = 0;
		public var touchPreviousY:Number = 0;
		public var dragState:Boolean = false;
		
		public var itemDragIdx:int = -1;
		public var itemUserDrag:VisualItem = null;
		public var pageIdx:int = 0;
		
		public var curX:Number = 0;			//stage coordinates
		public var curY:Number = 0;			
		public var curLocalX:Number = 0;
		public var curLocalY:Number = 0;	
		
		public var dragPointX:Number = 0;
		public var dragPointY:Number = 0;
		
//		private var _lastTimeStamp:Number = 0;
//		private var _lastIndex:int = 0;
//		private var _curTimeStamp:Number = 0;
//		private var _nextIndex:int = 0;
//		
//		private var _timeDelta:Number = 0;
//		private var _indexDelta:Number = 0;
//		
//		public var _index:int = 0;
		
		
		private static var _instance:Touch = null;
		public function Touch() { _instance = this; } //PF: constructor should be private to enforce Singleton pattern, unfortunetly not possible in ActionScript 3.0
		public static function get instance():Touch { return _instance?_instance:(_instance = new Touch()); }		

		
		
//		public function calculateAcceleration(nextIndex:int):void {
//			if(nextIndex >= length || nextIndex <0) return;
//			
//			_lastIndex = _index;
//			_index = nextIndex;
//			
////			_lastTimeStamp = _curTimeStamp;
////			_curTimeStamp = new Date().getTime();
//			
////			_timeDelta = _curTimeStamp - _lastTimeStamp;
////			_indexDelta = _index - _lastIndex;
//			
////			acceleration = _indexDelta/_timeDelta;
//			
//			InputManager.instance.routeToInputDevice(nextIndex, length);
//			
//		}
//		
//		public function set index(v:int):void {  calculateAcceleration(v); }
//		public function get index():int { return _index; }
	}
}