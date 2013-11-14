package lemonflow.ui.shapes
{
	import flare.util.Colors;
	
	import flash.display.BitmapData;
	import flash.display.Sprite;
	
	import starling.display.Image;
	import starling.textures.Texture;
	
	public class EllipseSprite extends Image
	{
		protected var _w:Number; //width of the rectangle
		protected var _h:Number; //height of the rectangle
		protected var _fillColor:uint = 0x00ffffff; //fill color of the rectangle
		protected var _lineColor:uint = 0xffaaaaaa; //line color of the rectangle outline
		protected var _lineWidth:Number = 1; //line width of the rectangle outline
		protected var _lineAlpha:Number = 1; //line width of the rectangle outline
		protected var _fillAlpha:Number = 1; //line width of the rectangle outline
		protected var _pixelHinting:Boolean = true; //indicating if pixel hinting should be used for the outline.

		public function EllipseSprite(x:Number=0, y:Number=0, w:Number=10, h:Number=10) {
			this.x = x;
			this.y = y;
			this._w = w;
			this._h = h;
		}
		
		public function dirty():void {
			var g:Sprite = new flash.display.Sprite();
			
			//vector graphics api
			g.graphics.clear();
			if (_lineAlpha>0) 
				g.graphics.lineStyle(_lineWidth, _lineColor, _lineAlpha, _pixelHinting);
			g.graphics.beginFill(_fillColor, _fillAlpha);
			g.graphics.drawEllipse(0, 0, _w, _h);
			g.graphics.endFill();
			
			//blit into bitmap data buffer
			var bd:BitmapData = new BitmapData(_w+1, _h+1, true, 0x00000000);
			bd.draw(g);
			
			this.texture = Texture.fromBitmapData(bd, false, false);
		}
		
		public function get w():Number { return _w; }
		public function set w(v:Number):void { _w = v; }
		public function get h():Number { return _h; }
		public function set h(v:Number):void { _h = v; }
		public function get fillColor():uint { return _fillColor; }
		public function set fillColor(c:uint):void { _fillColor = c; dirty(); }
		public function get lineColor():uint { return _lineColor; }
		public function set lineColor(c:uint):void { _lineColor = c; }
		public function get lineWidth():Number { return _lineWidth; }
		public function set lineWidth(v:Number):void { _lineWidth = v;}
		public function get lineAlpha():Number { return _lineAlpha; }
		public function set lineAlpha(v:Number):void { _lineAlpha = v; }
		public function get fillAlpha():Number { return _lineAlpha; }
		public function set fillAlpha(v:Number):void { _lineAlpha = v; }
		public function get linePixelHinting():Boolean { return _pixelHinting; }
		public function set linePixelHinting(b:Boolean):void { _pixelHinting = b; dirty(); }
	} 
}

