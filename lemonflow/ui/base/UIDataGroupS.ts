package lemonflow.ui.base {
	
	import flare.data.Data;
	
	import flash.display.Sprite;
	import flash.events.Event;
	
	import lemonflow.ui.base.renderers.GroupRenderer_Sprite;
	import lemonflow.ui.base.renderers.GroupRenderer_UIComponent;
	
	import mx.collections.IList;
	import mx.core.IFactory;
	
	public class UIDataGroupS extends Sprite implements IUIDataGroup
	{
		//actual rendering surface
		protected var _renderer:GroupRenderer_Sprite;//= new GroupRenderer_UIComponent(this);
		
		public var reuseDataRenders:Boolean					= false;
		
		//parameters of list
		protected var _transitionDuration:int 				= 500;
		protected var _easingMethod:String 					= "easeInOut";
		
		protected var _wrapAround:Boolean					= false;
		protected var _highlightOnTop:Boolean				= false;
		protected var _contentCenterXYZ:Object 				= {x:0, y:0, z:0};
		protected var _contentRadiusXYZ:Object 				= {x:190, y:77, z:190};
		protected var _visible:Boolean 						= false;
		protected var _centerRenderers:Boolean				= true;
		protected var _centerRenderersVertical:Boolean		= false;
		protected var _numberOfSlots:int 					= 6;
		protected var _continuousUpdates:Boolean			= false;
		
		//2d and 3d item renderers and views
		protected var dataRendererMap:Array = new Array();
		protected var dataRendererMapping:Array = new Array();
		
		//ui components renderer factories & instances
		protected var renderFactory:IFactory; //of UIComponents
		protected var rendererHighlightFactory:IFactory = null; //renderer class for highlights
		protected var highlightRenderer:VisualItem
		protected var childProperties:Vector.<VisualItem> = new Vector.<VisualItem>();
		
		//state handling of the item renderers
		protected var _itemStates:Object 			= new Object();
		
		//data cursors and model
		protected var _dataHandler:DataAdapter = null;
		protected var _interactionHandler:InteractionState = new InteractionState();
		
		//slot positions
		public var operators:Vector.<OperatorInteraction> = new Vector.<OperatorInteraction>();
		
		//abstract methods - subclass must overide 			
		public function boundaryCheck(idx:int, oldidx:int):Boolean { return true;}
		public static var INDEX_CHANGED:String = "indexChanged";
		
		public var stateMap:Object = new Object();
		
		public var dataNodes:Vector.<Object> = new Vector.<Object>();
		public var dataEdges:Vector.<Object> = new Vector.<Object>();
		
		public function UIDataGroupS() {
			super();
			_dataHandler = new DataAdapter(this);
		}
		//_______ handling of children, operators, data mapping and interactions ---- //
		
		public function createChildComponents():void {
			if(!renderFactory) return;
			
			if(rendererHighlightFactory!=null && !_highlightOnTop) {
				highlightRenderer = new VisualItem();
				highlightRenderer.factory = rendererHighlightFactory;
				renderer.addChild(highlightRenderer);
			}
			
			renderer.newChildList(_numberOfSlots);
			
			for(var i:Number=0; i<_numberOfSlots; i++) {
				if(reuseDataRenders) {
					dataRendererMap.push(childProperties[i]);
					dataRendererMapping.push(-1);
				}
			}
			
			if(rendererHighlightFactory!=null && _highlightOnTop) {
				highlightRenderer = new VisualItem();
				highlightRenderer.factory = rendererHighlightFactory;
				renderer.addChild(highlightRenderer);
			}
			_interactionHandler.component = this;
		}
		
		public function applyOperators():void {
			if(childProperties == null || childProperties.length == 0) 
				return;
			
			for each(var o:OperatorInteraction in operators) {
				if(o.active) o.update(childProperties, _interactionHandler.currentIndex, _interactionHandler.selectedIndex);
				if(o.active && o.sortByZ) renderer.sortLayeringByZ();
			}
		}
		
		public function getDataRenderer(idx:uint):VisualItem { 
			if(dataRendererMapping[idx%_numberOfSlots] != idx) {
				this.renderers[idx%_numberOfSlots].data = (dataRendererMap[idx%_numberOfSlots] as VisualItem).data = _dataHandler.getDataContent(wrapAround?idx%_numberOfSlots:idx);
				dataRendererMapping[idx%_numberOfSlots] = idx;
			}
			return dataRendererMap[idx%_numberOfSlots]; 
		}
		
		public function getDataRendererId(idx:uint):int { 
			return idx%_numberOfSlots; 
		}
		
		public function invalidate():void {
			
		}
		
		/** render surface **/
		public function set renderer(v:*):void { _renderer = v; }	
		public function get renderer():* { return _renderer; }
		
		/** states for mapped renderers **/
		public function registerState(identifier:String, stateName:String):void { stateMap[identifier] = stateName; renderer.invalidateDisplayList(); }
		
		/** interaction methods / selection handling **/
		public function scrollRelative(step:Number=0, duration:Number=-1):Boolean { return _interactionHandler.scrollRelative(step, duration); }
		public function scrollAbsolute(target:Number=0, duration:Number=-1):Boolean { return _interactionHandler.scrollAbsolute(target, duration); }
		public function set selectedIndex(s:Number):void { _interactionHandler.selectedIndex = s;   }
		public function get selectedIndex():Number { return _interactionHandler.selectedIndex; }
		public function set currentIndex(s:Number):void { _interactionHandler.currentIndex = s; }
		public function get currentIndex():Number { return _interactionHandler.currentIndex; }
		public function set initSelectedIndex(s:Number):void { _interactionHandler.initSelectedIndex = s;  }
		public function get initSelectedIndex():Number { return _interactionHandler.initSelectedIndex; }
		public function get direction():Number { return _interactionHandler.direction; }
		public function get oldSelectedIndex():Number { return _interactionHandler.oldSelectedIndex; }
		
		/** data provider **/
		public function set dataProvider(value:IList):void { _dataHandler.dataProvider = value; }
		public function get dataProvider():IList { return _dataHandler.dataProvider; }
		public function set dataStructure(value:Data):void { _dataHandler.dataStructure = value; }
		public function get dataStructure():Data { return _dataHandler.dataStructure; }	
		
		/** renderers factories **/
		public function set itemRenderer(value:IFactory):void { renderFactory = value; renderer.invalidateDisplayList(); }	
		public function get itemRenderer():IFactory { return renderFactory; }
		public function set cursorRenderer(value:IFactory):void { rendererHighlightFactory = value;  renderer.invalidateDisplayList(); }	  
		public function get highlight():* {return highlightRenderer.render; }
		
		/** instances and count **/
		public function get slots():Vector.<VisualItem>{ return childProperties; }
		public function get renderers():Array { return renderer.childRenderers; }
		public function set numberOfSlots(s:int):void { _numberOfSlots = s; }
		public function get numberOfSlots():int { return _numberOfSlots; }
		
		/** general positioning and parameters **/
		public function set continuousUpdates(v:Boolean):void { _continuousUpdates = v;};
		public function get continuousUpdates():Boolean { return _continuousUpdates; };
		public function set wrapAround(v:Boolean):void { _wrapAround = v};
		public function get wrapAround():Boolean { return _wrapAround; };
		public function get highlightOnTop():Boolean { return _highlightOnTop;}
		public function set highlightOnTop(v:Boolean):void { _highlightOnTop = v;}
		public function get centerRenderers():Boolean { return _centerRenderers;}
		public function set centerRenderers(v:Boolean):void { _centerRenderers = v;}
		public function get centerRenderersVertical():Boolean { return _centerRenderersVertical;}
		public function set centerRenderersVertical(v:Boolean):void { _centerRenderersVertical = v;}
		public function set perspectiveXYF(f:Object):void { renderer.perspectiveTransform = f;  renderer.invalidateDisplayList(); }
		public function get perspectiveXYF():Object { return renderer.perspectiveTransform; }
		public function set centerXYZ(f:Object):void { _contentCenterXYZ = f; renderer.invalidateDisplayList(); }
		public function get centerXYZ():Object { return _contentCenterXYZ; }
		public function set radiusXYZ(f:Object):void { _contentRadiusXYZ = f; renderer.invalidateDisplayList(); }
		public function get radiusXYZ():Object { return _contentRadiusXYZ; }
		
		/** transition **/
		public function set transitionDuration(v:int):void { _transitionDuration = v};
		public function get transitionDuration():int { return _transitionDuration };
		public function set easing(f:String):void { _easingMethod = f; }
		public function get easing():String { return _easingMethod; }
	}
}