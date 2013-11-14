package lemonflow.ui.base.renderers {
	
	import flash.display.Bitmap;
	import flash.display.DisplayObjectContainer;
	import flash.display.Shape;
	import flash.events.*;
	import flash.geom.Matrix;
	
	import lemonflow.ui.base.VisualItem;
	
	public class GroupRenderer_DrawRect implements IGroupRenderer {
		
		public var drawables:Array = new Array();
		
		private var bitmapData:Bitmap;
		private var rendererCanvas:Shape;

		private var surfaceContext:DisplayObjectContainer;
		
		public function GroupRenderer_DrawRect(surface:DisplayObjectContainer) {
			rendererCanvas = new Shape();
			surface.addChild(rendererCanvas);
		}
		
		public function newChild(bitmapBuffer, properties:VisualItem):void {
			this.bitmapData = bitmapBuffer;
			drawables.push(VisualItem(properties));
		}
		
		public function updateDisplayList():void {
			var visualProperties:VisualItem;
			var i:int = 0;
			
			rendererCanvas.graphics.clear();
			for(i=0; i< drawables.length; i++) {
				visualProperties = drawables[i];
				if(visualProperties.visible = false) 
					continue;
				rendererCanvas.graphics.beginBitmapFill(bitmapData.bitmapData, new Matrix(1, 0, 0, 1, visualProperties.x, visualProperties.y), false, false);
				rendererCanvas.graphics.drawRect(visualProperties.x, visualProperties.y, bitmapData.bitmapData.width, bitmapData.bitmapData.height);
			}
		}
	}
}
