package lemonflow.ui.shapes
{
	import flare.util.Colors;
	
	import flash.display.BitmapData;
	import flash.display.Sprite;
	
	import mx.states.OverrideBase;
	
	import starling.display.Image;
	import starling.textures.Texture;
	
	/**
	 * A Sprite representing a rectangle shape. Supports line and fill colors
	 * and rounded corners.
	 */
	public class RectSprite extends Image
	{
		protected var _w:Number; //width of the rectangle
		protected var _h:Number; //height of the rectangle
		protected var _cw:Number = 0; //width of rounded corners. Zero indicates no rounding.
		protected var _ch:Number = 0; //height of rounded corners. Zero indicates no rounding.
		protected var _fillColor:uint = 0x00ffffff; //fill color of the rectangle
		protected var _lineColor:uint = 0xffaaaaaa; //line color of the rectangle outline
		protected var _lineWidth:Number = 1; //line width of the rectangle outline
		protected var _pixelHinting:Boolean = true; //indicating if pixel hinting should be used for the outline.

		public function RectSprite(x:Number=0, y:Number=0, w:Number=200, h:Number=200, cw:Number=0, ch:Number=0) {
			this.x = x;
			this.y = y;
			this._w = w;
			this._h = h;
			this._cw = cw;
			this._ch = ch;
		}
		
		public override function validate():void {
			if(!_invalidated) return;
			_invalidated = false;
			
			if(this.texture) texture.dispose();
			
			var g:Sprite = new flash.display.Sprite();
			
			//vector graphics api
			g.graphics.clear();
			if (Colors.a(_lineColor) / 255>0) 
				g.graphics.lineStyle(_lineWidth, _lineColor & 0x00ffffff, Colors.a(_lineColor) / 255, _pixelHinting);
			g.graphics.beginFill(_fillColor & 0x00ffffff, Colors.a(_fillColor) / 255);
			if (_cw > 0 || _ch > 0) 
				g.graphics.drawRoundRect(0, 0, _w, _h, _cw, _ch);
			else 
				g.graphics.drawRect(0, 0, _w, _h);
			g.graphics.endFill();
			
			//blit into bitmap data buffer
			var bd:BitmapData = new BitmapData(_w+1, _h+1, true, 0x00000000);
			bd.draw(g);
			
			this.texture = Texture.fromBitmapData(bd, false, false);
			
			bd.dispose();
			g = null;
		}
		
		public function get w():Number { return _w; }
		public function set w(v:Number):void { _w = v; invalidate(); }
		public function get h():Number { return _h; }
		public function set h(v:Number):void { _h = v; invalidate(); }
		public function get cornerWidth():Number { return _cw; }
		public function set cornerWidth(v:Number):void { _cw = v; invalidate(); }
		public function get cornerHeight():Number { return _ch; }
		public function set cornerHeight(v:Number):void { _ch = v; invalidate(); }
		public function set cornerSize(v:Number):void { _cw = _ch = v; invalidate(); }
		public function get fillColor():uint { return _fillColor; }
		public function set fillColor(c:uint):void { _fillColor = c; invalidate(); }
		public function get lineColor():uint { return _lineColor; }
		public function set lineColor(c:uint):void { _lineColor = c; invalidate(); }
		public function get lineWidth():Number { return _lineWidth; }
		public function set lineWidth(v:Number):void { _lineWidth = v; invalidate(); }
		public function get linePixelHinting():Boolean { return _pixelHinting; }
		public function set linePixelHinting(b:Boolean):void { _pixelHinting = b; invalidate(); }
	} 
}

