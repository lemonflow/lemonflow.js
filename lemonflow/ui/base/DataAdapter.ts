package lemonflow.ui.base
{
	import flare.data.Data;
	
	import flash.events.Event;
	
	import lemonflow.io.events.NInputEvent;
	
	import mx.collections.IList;
	import mx.core.IDataRenderer;
	import mx.events.CollectionEvent;

	public class DataAdapter {
		protected var _dataProvider:IList = null; //list collection of data to render
		protected var _dataStructure:Data = null; //unstructured or graph-like collection of data to render
		
		protected var _component:IUIDataGroup = null; //visual group that is bound to the collection
		protected var _defaultItemData:XML = <item name="" artist="" image="" tracklist=""/>;
		
		public function DataAdapter(c:IUIDataGroup) {
			_component = c;
		}
		
		protected function registerSource(event:Event=null):void {
			if(_dataProvider["modelReady"])
				dataAdapterInit(); //bind it now
			else if(_dataProvider!=null)  
				_dataProvider.addEventListener(NInputEvent.XMLREADY, dataAdapterInit); //bind it later
				
		}
		
		public function dataAdapterInit(event:Event=null):void {
			if(_component==null || _component.slots == null || _dataProvider ==null)
				return; 

			for(var i:Number=0; i<_component.numberOfSlots; i++) {
				var item:IDataRenderer = _component.renderers[i] as mx.core.IDataRenderer;
				if(item==null)  continue;
				if(i<_dataProvider.length) {
					item.data = _dataProvider.getItemAt(i);
				} else {
					item.data = _defaultItemData;
					_component.slots[i].visible = false;
				}
			}
			
			_dataProvider.addEventListener(CollectionEvent.COLLECTION_CHANGE, collectionChangeHandler);
		}
		
		
		public function getDataContent(idx:uint):XML { 
			 return XML(dataProvider && idx<dataProvider.length?dataProvider.getItemAt(idx,4):_defaultItemData);
		}
		
		public function collectionChangeHandler(event:Event=null):void {
//			if(event is CollectionEvent && (event as CollectionEvent).kind == CollectionEventKind.ADD ) {
//				
//				//create a new Visual Item/Renderer
//				var renderer:UIComponent = _component.itemRenderer.newInstance() as UIComponent;
//				if(_component.centerRenderers) {
//					renderer.x = -renderer.width/2; renderer.y = -renderer.height/2; 
//				}
//				renderer.z = 0; renderer.visible = true;
//				var s:UIComponent = new UIComponent();
//				s.width = renderer.width, s.height = renderer.height; s.visible = true;
//				s.transform.perspectiveProjection = _component.projection;
//				s.addChild(renderer);
//				_component.addChild(s);
//				_component.slots.push(s);
//				_component.renderers.push(renderer);
//			}
		}
		
		public function set dataStructure(value:Data):void { _dataStructure = value; }
		public function get dataStructure():Data { return _dataStructure; }	
		public function get dataProvider():IList {return _dataProvider; };
		public function set dataProvider(d:IList):void { if(!(_dataProvider === d)) { _dataProvider = d; registerSource(); }}	
	}
}