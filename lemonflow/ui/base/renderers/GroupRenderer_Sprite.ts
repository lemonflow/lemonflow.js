package lemonflow.ui.base.renderers {
	
	import lemonflow.ui.base.VisualItem;
	
	import flash.display.Bitmap;
	import flash.display.DisplayObjectContainer;
	import flash.events.*;
	
	public class GroupRenderer_Sprite implements IGroupRenderer {
		
		public var drawables:Array = new Array();
		
		private var bitmap:Bitmap;
		private var rendererCanvas:DisplayObjectContainer;
		private var rendererChilds:Array = new Array();

		private var surfaceContext:DisplayObjectContainer;
		
		public function GroupRenderer_Sprite(surface:DisplayObjectContainer, useParent:Boolean = false) {
			rendererCanvas = useParent?surface.parent:surface;
		}
		
		public function newChild(bitmapBuffer, properties:VisualItem):void {
			this.bitmap = bitmapBuffer;
			drawables.push(VisualItem(properties));
			rendererChilds.push(bitmap);
			rendererCanvas.addChild(bitmapBuffer);
		}
		
		public function updateDisplayList():void {
			var visualProperties:VisualItem;
			var i:int = 0;
			
			for(i=0; i< drawables.length; i++) {
				visualProperties = drawables[i];
				rendererChilds[i].x = visualProperties.x;
				rendererChilds[i].y = visualProperties.y;
				rendererChilds[i].z = visualProperties.z;
				rendererChilds[i].visible = visualProperties.visible;
			}
		}
	}
}
