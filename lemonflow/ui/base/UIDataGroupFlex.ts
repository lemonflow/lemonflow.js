package lemonflow.ui.base {
	import flash.events.IEventDispatcher;
	
	import lemonflow.ui.base.renderers.GroupRenderer_UIComponent;
	
	import mx.collections.IList;
	import mx.core.IFactory;
	import mx.core.UIComponent;
	
	public class UIDataGroupFlex extends UIComponent implements IEventDispatcher
	{
		public var impl:UIDataGroup = new UIDataGroup();
		
		public function UIDataGroupFlex() { 
			impl.viewdata = this; 
		}

		override protected function createChildren():void {
			super.createChildren()
				
			if(impl.viewdata.hasOwnProperty("controller")) //controller defined in MXML
				impl.controllers.push(impl.viewdata["controller"] as OperatorStates);
			
			impl.renderer.renderSurface = this;
			impl.createChildComponents();
		}
		
		override protected function updateDisplayList(unscaledWidth:Number, unscaledHeight:Number):void {
			impl.renderer.validateDisplayList(impl.slots);
			super.updateDisplayList(unscaledWidth,unscaledHeight);
		}
		
		override public function invalidateDisplayList():void {
			super.invalidateDisplayList();
			if(impl.renderer) impl.renderer.invalidated = true;
		}
		
		public function get controllers():Vector.<OperatorStates> { return impl.controllers; }
		
		public function scrollRelative(v:Number=0, duration=-1):Boolean { return impl.scrollRelative(v,duration); }
		public function scrollAbsolute(v:Number=0, duration=-1):Boolean { return impl.scrollAbsolute(v,duration); }
		
		public function get renderer():GroupRenderer_UIComponent { return impl.renderer; };
		public function set wrapAround(v:Boolean):void { impl.wrapAround = v};
		public function get wrapAround():Boolean { return impl.wrapAround; };
		public function set reuseDataRenders(v:Boolean):void { impl.reuseDataRenders = v};
		public function get reuseDataRenders():Boolean { return impl.reuseDataRenders; };
		public function set numberOfSlots(v:int):void { impl.numberOfSlots = v};
		public function get numberOfSlots():int { return impl.numberOfSlots };
		public function set selectedIndex(s:Number):void { impl.selectedIndex = s;   }
		public function get selectedIndex():Number { return impl.selectedIndex; }
		public function set currentIndex(s:Number):void { impl.currentIndex = s; }
		public function get currentIndex():Number { return impl.currentIndex; }
		public function set initSelectedIndex(s:Number):void { impl.initSelectedIndex = s;  }
		public function get initSelectedIndex():Number { return impl.initSelectedIndex; }
		public function get direction():Number { return impl.direction; }
		public function get oldSelectedIndex():Number { return impl.oldSelectedIndex; }
		public function getDataRenderer(v:uint):VisualItem { return impl.getDataRenderer(v); }
		public function getDataRendererId(idx:uint):int { return  impl.getDataRendererId(idx); }
		public function set centerXYZ(f:Object):void { impl.centerXYZ = f; }
		public function get centerXYZ():Object { return impl.centerXYZ; }
		public function set radiusXYZ(f:Object):void { impl.radiusXYZ = f;}
		public function get radiusXYZ():Object { return impl.radiusXYZ; }
		public function set perspectiveXYF(f:Object):void { impl.perspectiveXYF = f; }
		public function get perspectiveXYF():Object { return impl.perspectiveXYF; }
		
		/** data provider **/
		public function set dataProvider(value:IList):void { impl.dataProvider = value; }
		public function get dataProvider():IList { return impl.dataProvider; }	
		
		/** itemrenderers and slots **/
		public function set itemRenderer(value:IFactory):void { impl.itemRenderer = value; }	
		public function get itemRenderer():IFactory { return impl.itemRenderer; }
		public function set cursorRenderer(value:IFactory):void { impl.cursorRenderer = value;  }	  
		public function get highlight():* {return impl.highlight; }
		public function get slots():Vector.<VisualItem>{ return impl.slots; }
		public function get renderers():Array { return impl.renderers; }
		public function get highlightOnTop():Boolean { return impl.highlightOnTop;}
		public function set highlightOnTop(v:Boolean):void { impl.highlightOnTop = v;}
		public function get centerRenderers():Boolean { return impl.centerRenderers;}
		public function set centerRenderers(v:Boolean):void { impl.centerRenderers = v;}
		public function get centerRenderersVertical():Boolean { return impl.centerRenderersVertical;}
		public function set centerRenderersVertical(v:Boolean):void { impl.centerRenderersVertical = v;}
		public function set transitionDuration(v:int):void { impl.transitionDuration = v};
		public function get transitionDuration():int { return impl.transitionDuration };
		public function set easing(f:String):void { impl.easing = f; }
		public function get easing():String { return impl.easing; }
		public function get operators():Vector.<OperatorInteraction> { return impl.operators; }
	}
}