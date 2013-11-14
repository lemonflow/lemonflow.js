package lemonflow.ui.base {
	
	import lemonflow.ui.animation.Tweener;
	
	import mx.collections.IList;
	
	import spark.components.Group;
	
	public class UIGroupState implements IUIGroup
	{
		//parameters of list
		protected var _transitionDuration:int 				= 500;
		protected var _easingMethod:String 					= "easeInOut";
		
		protected var _wrapAround:Boolean					= false;
		protected var _highlightOnTop:Boolean				= false;
		protected var _contentCenterXYZ:Object 				= {x:0, y:0, z:0};
		protected var _contentRadiusXYZ:Object 				= {x:190, y:77, z:190};
		protected var _visible:Boolean 						= false;
		protected var _numberOfSlots:int 					= 6;
		
		//state handling 
		protected var _itemStates:Object 			= new Object();
			
		//data cursors and model
		protected var _interactionHandler:InteractionState = new InteractionState();
		protected var _dataProvider:IList = null; //actual collection data to render
		
		//slot positions
		public var controller:OperatorStates;
		
		//lifecycle
		public var lifecycleState:uint = 0;
		
		//children
		public var viewdata:*;
		
		public function UIGroupState() {
			super();
		}
		
		public function createChildComponents():void {
			controller.setup();
		}

		public function applyOperators():void {
			controller.update();
		}
		
		
		public function set centerXYZ(f:Object):void { _contentCenterXYZ = f; }
		public function get centerXYZ():Object { return _contentCenterXYZ; }
		public function set radiusXYZ(f:Object):void { _contentRadiusXYZ = f; }
		public function get radiusXYZ():Object { return _contentRadiusXYZ; }
		
		/** interaction methods / selection handling **/
		public function scrollRelative(step:Number=0):Boolean { return _interactionHandler.scrollRelative(step); }
		public function scrollAbsolute(target:Number=0):Boolean { return _interactionHandler.scrollAbsolute(target); }
		
		protected var _selectedState:Number=0;
		public function set selectedState(s:Number):void { _selectedState = s; Tweener.addTween(this, { currentState: _selectedState, time:transitionDuration/1000, transition: easing});}
		public function get selectedState():Number { return _selectedState; }
		protected var _currentState:Number=0;
		public function set currentState(s:Number):void { _currentState = s; applyOperators(); }
		public function get currentState():Number { return _currentState; }
		
		public function set selectedIndex(s:Number):void { _interactionHandler.selectedIndex = s;   }
		public function get selectedIndex():Number { return _interactionHandler.selectedIndex; }
		public function set currentIndex(s:Number):void { _interactionHandler.currentIndex = s; }
		public function get currentIndex():Number { return _interactionHandler.currentIndex; }
		public function set initSelectedIndex(s:Number):void { _interactionHandler.initSelectedIndex = s;  }
		public function get initSelectedIndex():Number { return _interactionHandler.initSelectedIndex; }
		public function get direction():Number { return _interactionHandler.direction; }
		public function get oldSelectedIndex():Number { return _interactionHandler.oldSelectedIndex; }
		
		/** data provider **/
		public function get dataProvider():IList {return _dataProvider; };
		public function set dataProvider(d:IList):void { _dataProvider = d;}	
		
		/** transition **/
		public function set transitionDuration(v:int):void { _transitionDuration = v};
		public function get transitionDuration():int { return _transitionDuration };
		public function set easing(f:String):void { _easingMethod = f; }
		public function get easing():String { return _easingMethod; }
	}
}