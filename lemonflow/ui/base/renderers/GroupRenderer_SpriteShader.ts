package lemonflow.ui.base.renderers {
	
	import lemonflow.ui.base.VisualItem;
	
	import flash.display.Bitmap;
	import flash.display.DisplayObjectContainer;
	import flash.display.Shader;
	import flash.display.Sprite;
	import flash.events.*;
	import flash.filters.ShaderFilter;
	
	public class GroupRenderer_SpriteShader implements IGroupRenderer {
		public var drawables:Vector.<VisualItem> = new Vector.<VisualItem>();
		public var shaderClass:Class;
		
		private var bitmap:Bitmap;
		private var rendererCanvas:Sprite;
		private var rendererChilds:Array = new Array();

		private var surfaceContext:DisplayObjectContainer;

		
		private var shader:Shader;
		private var filter:ShaderFilter;
		
		public function GroupRenderer_SpriteShader(surface:DisplayObjectContainer, useParent:Boolean = false) {
//			rendererCanvas = new Bitmap();
//			DisplayObjectContainer(useParent?surface.parent:surface).addChild(rendererCanvas);
			rendererCanvas = Sprite(useParent?surface.parent:surface);
			
			shader = new Shader(new shaderClass());
			filter = new ShaderFilter(shader);
			shader.data.brightness.value = [60];
			shader.data.radius.value = [10];
		}
		
		public function newChild(bitmapBuffer, properties:VisualItem):void {
			this.bitmap = bitmapBuffer;
			drawables.push(VisualItem(properties));
			rendererChilds.push(bitmap);
			rendererCanvas.addChild(bitmap);
			
			bitmapBuffer.filters = [filter];
			shader.data.src.input = bitmapBuffer.bitmapData;
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
				
//				shader.data.center.value = [-visualProperties.x+visualProperties.shaderCenterX, visualProperties.y+visualProperties.shaderCenterY];
				rendererChilds[i].filters = [filter];
			}
		}
	}
}
