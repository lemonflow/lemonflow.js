package lemonflow.ui.base {
	import flash.events.IEventDispatcher;
	
	import lemonflow.ui.base.renderers.GroupRenderer_UIComponent;
	
	import mx.collections.IList;
	import mx.core.IFactory;
	import mx.core.UIComponent;
	
	import spark.components.Group;
	
	public class UIGroupStateFlex extends Group implements IEventDispatcher, IUIGroup
	{
		public var component:UIGroupState = new UIGroupState();
		public var useObject:Boolean = true;
		
		public function UIGroupStateFlex() { 
			component.viewdata = this; 
		}
		
		override protected function createChildren():void {
			super.createChildren(); //instantiation based on mxml
			if(useObject && component.viewdata.hasOwnProperty("controller"))
				component.controller = component.viewdata["controller"] as OperatorStates;
			component.createChildComponents();
		}
		
		public function set controller(v:OperatorStates):void { component.controller = v; }
		public function get controller():OperatorStates { return component.controller; }
		public function set centerXYZ(f:Object):void { component.centerXYZ = f; }
		public function get centerXYZ():Object { return component.centerXYZ; }
		public function set radiusXYZ(f:Object):void { component.radiusXYZ = f;}
		public function get radiusXYZ():Object { return component.radiusXYZ; }
		
		public function scrollRelative(v:Number=0):Boolean { return component.scrollRelative(v); }
		public function scrollAbsolute(v:Number=0):Boolean { return component.scrollAbsolute(v); }
		
		public function set selectedState(s:Number):void { component.selectedState = s;   }
		public function get selectedState():Number { return component.selectedState; }
		public function set currentStateN(s:Number):void { component.currentState = s; }
		public function get currentStateN():Number { return component.currentState; }

		public function set selectedIndex(s:Number):void { component.selectedIndex = s;   }
		public function get selectedIndex():Number { return component.selectedIndex; }
		public function set currentIndex(s:Number):void { component.currentIndex = s; }
		public function get currentIndex():Number { return component.currentIndex; }
		public function set initSelectedIndex(s:Number):void { component.initSelectedIndex = s;  }
		public function get initSelectedIndex():Number { return component.initSelectedIndex; }
		
		public function get direction():Number { return component.direction; }
		public function get oldSelectedIndex():Number { return component.oldSelectedIndex; }
		
		/** data provider **/
		public function set dataProvider(value:IList):void { component.dataProvider = value; }
		public function get dataProvider():IList { return component.dataProvider; }	
		
		/** itemrenderers and slots **/
		public function set transitionDuration(v:int):void { component.transitionDuration = v};
		public function get transitionDuration():int { return component.transitionDuration };
		public function set easing(f:String):void { component.easing = f; }
		public function get easing():String { return component.easing; }
	}
}