package lemonflow.ui.base.renderers {
	
	import lemonflow.ui.base.VisualItem;
	
	import flash.display.Bitmap;
	import flash.display.DisplayObjectContainer;
	import flash.events.*;
	
	public class ItemRenderer_Sprite implements IGroupRenderer {
		
		public var drawable:VisualItem = new VisualItem();
		
		private var bitmap:Bitmap;
		private var renderNativeSurface:DisplayObjectContainer;
		private var rendererChilds:Array = new Array();

		private var surfaceContext:DisplayObjectContainer;
		
		public function ItemRenderer_Sprite(surface:DisplayObjectContainer, useParent:Boolean = false) {
			renderNativeSurface = useParent?surface.parent:surface;
		}
		
		public function newChild(bitmapBuffer, properties:VisualItem):void {
			bitmap = bitmapBuffer;
			drawable = properties;
		}
		
		public function updateDisplayList():void {
			bitmap.x 			= drawable.x;
			bitmap.y 			= drawable.y;
			bitmap.z 			= drawable.z;
			bitmap.visible 		= drawable.visible;
		}
	}
}
