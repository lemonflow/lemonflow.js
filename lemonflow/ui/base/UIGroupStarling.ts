package lemonflow.ui.base {
	
	import avmplus.getQualifiedClassName;
	
	import flare.data.Data;
	
	import lemonflow.ui.animation.TweenMax;
	import lemonflow.ui.animation.transition.AnimProxy;
	import lemonflow.ui.animation.tweenlite.easing.Quad;
	import lemonflow.ui.base.renderers.GroupRenderer_Starling;
	
	import mx.collections.IList;
	import mx.core.IFactory;
	
	import starling.display.DisplayObjectContainer;
	import starling.display.Sprite;
	import starling.events.Event;
	
	public class UIGroupStarling extends Sprite implements IUIDataGroup
	{
		//actual rendering surface
		protected var _renderer:GroupRenderer_Starling;
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
		protected var _transitioner:Boolean					= false;
		
		//2d and 3d item renderers and views
		protected var dataRendererMap:Array = new Array();
		protected var dataRendererMapping:Array = new Array();
		public var dataRendererUpdateSpread = -1;
		
		//ui components renderer factories & instances
		protected var renderFactory:IFactory; //of Starling DisplayObjects
		protected var rendererHighlightFactory:IFactory = null; //renderer class for highlights
		protected var highlightRenderer:VisualItem
		
		protected var childProperties:Vector.<VisualItem> = new Vector.<VisualItem>();
		protected var animChildProperties:Vector.<VisualItem> = new Vector.<VisualItem>();
		
		//state handling of the item renderers
		protected var _itemStates:Object 			= new Object();
			
		//data cursors and model
		protected var _dataHandler:DataAdapter = null;
		public var dataNodes:Vector.<Object> = new Vector.<Object>();
		public var dataEdges:Vector.<Object> = new Vector.<Object>();
		
		//interaction and positioning
		protected var _interactionHandler:InteractionState = new InteractionState();
		public var controllers:Vector.<OperatorStates> = new Vector.<OperatorStates>();
		public var operators:Vector.<OperatorInteraction> = new Vector.<OperatorInteraction>();
		
		//abstract methods - subclass must overide 			
		public function boundaryCheck(idx:int, oldidx:int):Boolean { return true;}
		public static var INDEX_CHANGED:String = "indexChanged";
		
		//lifecycle
		public var lifecycleState:uint = 0;
		public var stateMap:Object = new Object();
		
		//children declarative data
		public var viewdata:*;
		
		public function UIGroupStarling() {
			super();
			_dataHandler = new DataAdapter(this);
			renderer = new GroupRenderer_Starling(this);
			_interactionHandler.component = this;
		}
		
		//called when element is added to the displaylist
		override public function setParent(value:DisplayObjectContainer):void
		{
			super.setParent(value);
			createChildComponents();	
		}
		
		//_______ handling of children, operators, data mapping and interactions ---- //
		public function createChildComponents():void {
			if(!renderFactory) return;
			if(dataStructure != null)  
				numberOfSlots = dataStructure.nodes.length;
			
			//highlight on bottom
			if(rendererHighlightFactory!=null && !_highlightOnTop && highlightRenderer ==null) {
				highlightRenderer = new VisualItem();
				highlightRenderer.factory = rendererHighlightFactory;
				renderer.addChild(highlightRenderer);
			}
			
			//remove old components and add new components to the list
			var oldNumberOfSlots:int = slots.length;
			for(var i:int =oldNumberOfSlots; i<_numberOfSlots; i++) {
				slots.push(renderer.newChild(renderFactory)); //adds it to the slots array
				if(reuseDataRenders) {
					dataRendererMap.push(slots[i]);
					dataRendererMapping.push(-1);
				}
			}
			for(var i:int = oldNumberOfSlots-1; i>=_numberOfSlots; i--) {
				renderer.removeChild(slots[i]);
				slots.pop();
				if(reuseDataRenders) {
					dataRendererMap.pop();
					dataRendererMapping.pop();
				}
			}
			
			trace("adding "+(_numberOfSlots-oldNumberOfSlots)+" to view, definition:"+ getQualifiedClassName(itemRenderer.newInstance()).toString());
			
			//highlight on top
			if(rendererHighlightFactory!=null && _highlightOnTop && highlightRenderer ==null) {
				highlightRenderer = new VisualItem();
				highlightRenderer.factory = rendererHighlightFactory;
				renderer.addChild(highlightRenderer);
			}
			
			lifecycleState = 1;
			if(_dataHandler.dataProvider && _dataHandler.dataProvider["modelReady"]) 
				_dataHandler.dataAdapterInit();
			
			var animProxy:AnimProxy = new AnimProxy();
			for each (var o:VisualItem in slots) 
				animChildProperties.push(animProxy.init(o));
				
			invalidate();
		}
		
		//operators will access and change the properties of children (visualitems)
		public function applyOperators():void {
			if(slots == null || slots.length == 0 || (dataProvider == null && dataStructure == null)) 
				return;
			
			for each(var o:OperatorInteraction in operators) {
				if(o.group==null || o.group!=this) o.group = this;
				if(!o.active) continue;
				
				o.update(slots, _interactionHandler.currentIndex, _interactionHandler.selectedIndex);
				
				if(dataStructure) {
					for (var i:int = 1; i < (dataStructure?dataStructure.nodes:slots).length; i++) {
						slots[i-1].x = (dataStructure?dataStructure.nodes[i]:slots[i]).x;
						slots[i-1].y = (dataStructure?dataStructure.nodes[i]:slots[i]).y;
					}
				} 
				
//				if(transitioner==true && ) {
//					//crossfade shapes
////					var items:Object = (dataStructure?dataStructure.nodes:slots);
////					for (var i:int = 1; i < items.length; i++) {
////					}
//				}
				
				if(o.sortByZ) renderer.sortLayeringByZ();
			}
			
			for each(var o2:OperatorStates in controllers) {
				if(o2.view==null) o2.view = this;
				if(o2.active) o2.update();
			}
		}
		
		public function invalidate():void {
			applyOperators();
			renderer.validateDisplayList(slots);
		}
		
		public function updateAllDataRenderer():void {
			if(dataRendererUpdateSpread == -1) return;
			
			for(var i:int = -dataRendererUpdateSpread + selectedIndex;i<=dataRendererUpdateSpread + selectedIndex+1;i++) {
				updateDataRenderer(i);
			}
		}
		public function updateDataRenderer(idx:uint):void { 
			if(dataRendererMapping[idx%_numberOfSlots] != idx) {
				dataRendererMapping[idx%_numberOfSlots] = idx;
			}
			renderers[idx%_numberOfSlots].data = 
				(dataRendererMap[idx%_numberOfSlots] as VisualItem).data = 
				_dataHandler.getDataContent(wrapAround?idx%_numberOfSlots:idx);
		}
		
		public function getDataRenderer(idx:uint):VisualItem { 
			if(dataRendererMapping[idx%_numberOfSlots] != idx) 
				dataRendererMapping[idx%_numberOfSlots] = idx;
			return dataRendererMap[idx%_numberOfSlots]; 
		}
		public function getDataRendererId(idx:uint):int { return idx%_numberOfSlots; }

		
		/** render surface **/
		public function set renderer(v:*):void { _renderer = v; }	
		public function get renderer():* { return _renderer; }
		
		/** states for mapped renderers **/
		public function registerState(identifier:String, stateName:String):void { stateMap[identifier] = stateName; renderer.validateDisplayList(slots); }
		
		/** interaction methods / selection handling **/
		public function scrollRelative(step:Number=0, duration:Number = -1):Boolean { return _interactionHandler.scrollRelative(step, duration); }
		public function scrollAbsolute(target:Number=0, duration:Number = -1):Boolean { updateAllDataRenderer(); return _interactionHandler.scrollAbsolute(target, duration); }
		public function set selectedIndex(s:Number):void { _interactionHandler.selectedIndex = s;   }
		public function get selectedIndex():Number { return _interactionHandler.selectedIndex; }
		public function set currentIndex(s:Number):void { _interactionHandler.currentIndex = s;  renderer.validateDisplayList(slots);}
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
		public function set itemRenderer(value:IFactory):void { renderFactory = value; renderer.validateDisplayList(slots); }	
		public function get itemRenderer():IFactory { return renderFactory; }
		public function set cursorRenderer(value:IFactory):void { rendererHighlightFactory = value;  renderer.validateDisplayList(slots); }	  
		public function get highlight():* {return highlightRenderer.render; }

		/** instances and count **/
		public function get slots():Vector.<VisualItem>{ return childProperties; }
		public function get renderers():Array { return renderer.childRenderers; }
		public function set numberOfSlots(s:int):void { _numberOfSlots = s; if(lifecycleState>=1) createChildComponents();}
		public function get numberOfSlots():int { return _numberOfSlots; }
		
		/** general positioning and parameters **/
		public function set continuousUpdates(v:Boolean):void {
			if(v==_continuousUpdates) return; 
			if(v) addEventListener(Event.ENTER_FRAME, function(e:Event):void { invalidate() } ); 
			else removeEventListeners(Event.ENTER_FRAME); 
			_continuousUpdates = v;
		};
		
		public function get continuousUpdates():Boolean { return _continuousUpdates; };
		public function set transitioner(v:Boolean):void { _transitioner = v; renderer.transitioner = v?1.0:-1};
		public function get transitioner():Boolean { return _transitioner; };
		public function set wrapAround(v:Boolean):void { _wrapAround = v};
		public function get wrapAround():Boolean { return _wrapAround; };
		public function get highlightOnTop():Boolean { return _highlightOnTop;}
		public function set highlightOnTop(v:Boolean):void { _highlightOnTop = v;}
		public function get centerRenderers():Boolean { return _centerRenderers;}
		public function set centerRenderers(v:Boolean):void { _centerRenderers = v;}
		public function get centerRenderersVertical():Boolean { return _centerRenderersVertical;}
		public function set centerRenderersVertical(v:Boolean):void { _centerRenderersVertical = v;}
		public function set perspectiveXYF(f:Object):void { renderer.perspectiveTransform = f;  renderer.validateDisplayList(slots); }
		public function get perspectiveXYF():Object { return renderer.perspectiveTransform; }
		public function set centerXYZ(f:Object):void { _contentCenterXYZ = f; renderer.validateDisplayList(slots); }
		public function get centerXYZ():Object { return _contentCenterXYZ; }
		public function set radiusXYZ(f:Object):void { _contentRadiusXYZ = f; renderer.validateDisplayList(slots); }
		public function get radiusXYZ():Object { return _contentRadiusXYZ; }
		
		/** transition **/
		public function set transitionDuration(v:int):void { _transitionDuration = v};
		public function get transitionDuration():int { return _transitionDuration };
		public function set easing(f:String):void { _easingMethod = f; }
		public function get easing():String { return _easingMethod; }
	}
}