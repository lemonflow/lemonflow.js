package lemonflow.ui.base.renderers {
	
	import lemonflow.ui.base.VisualItem;
	
	import mx.core.IFactory;
	
	import starling.display.DisplayObject;
	import starling.display.DisplayObjectContainer;
	
	public class ItemRenderer_Starling  {
		public var childRenderer:DisplayObject;
		public var rendererCanvas:DisplayObjectContainer;
		public var properties:VisualItem;
		
		public function ItemRenderer_Starling(surface:DisplayObjectContainer, factory:IFactory, useParent:Boolean = false) {
			childRenderer = factory.newInstance();
			
			rendererCanvas = useParent?surface.parent:surface;
			rendererCanvas.addChild(childRenderer);
			
			properties = new VisualItem();
			properties.render = childRenderer;
			properties.factory = factory;
		}
		
		public function invalidateDisplayList(values:VisualItem):void {
			childRenderer = childRenderer;
			
			childRenderer.x = values.x;
			childRenderer.y = values.y;
			childRenderer.z = values.z;
			childRenderer.alpha = values.alpha;
			childRenderer.visible = values.visible;
			childRenderer.rotationY = values.rotationY;
			childRenderer.rotationX = values.rotationX;
			childRenderer.rotationZ = values.rotationZ;
			childRenderer.scaleX = values.scaleX;
			childRenderer.scaleY = values.scaleY;
			trace("update child ["+this+"]: { x-" + values.x + " y-"+ values.y + " z-"+ values.z + " v-"+ values.visible + " a-"+ values.alpha +"}");
		}
	}
}
