package lemonflow.ui.operators
{
	import lemonflow.ui.base.VisualNodeItem;
	import flare.util.Arrays;
	import flare.util.Orientation;
	
	import flash.geom.Rectangle;
	
	public class NodeLinkTreeLayout extends OperatorLayout
	{
		public static const PARAMS:String = "nodeLinkTreeLayoutParams";
	
		protected var _orient:String = Orientation.LEFT_TO_RIGHT; // orientation
		protected var _bspace:Number = 5;  // the spacing between sibling nodes
		protected var _tspace:Number = 25; // the spacing between subtrees
		protected var _dspace:Number = 50; // the spacing between depth levels
    	
		private var _depths:Array = new Array(20); // stores depth co-ords
    	private var _maxDepth:int = 0;
    	private var _ax:Number, _ay:Number; // for holding anchor co-ordinates (assigned in first run, then second run assignes relative to anchor
		
		public function get orientation():String { return _orient; }
		public function set orientation(o:String):void { _orient = o; }
		public function get depthSpacing():Number { return _dspace; }
		public function set depthSpacing(s:Number):void { _dspace = s; }
		public function get breadthSpacing():Number { return _bspace; }
		public function set breadthSpacing(s:Number):void { _bspace = s; }
		public function get subtreeSpacing():Number { return _tspace; }
		public function set subtreeSpacing(s:Number):void { _tspace = s; }
		
		
		public function NodeLinkTreeLayout(orientation:String=Orientation.LEFT_TO_RIGHT, depthSpace:Number=50, breadthSpace:Number=5, subtreeSpace:Number=25)
		{
			_orient = orientation;
			_dspace = depthSpace;
			_bspace = breadthSpace;
			_tspace = subtreeSpace;
		}
	
		protected override function layout():void
		{
        	Arrays.fill(_depths, 0);
        	_maxDepth = 0;
        	
        	if (group.dataStructure.tree.root == null) return; 
			
        	firstWalk(group.dataStructure.tree.root as VisualNodeItem, 0, 1);  // breadth/depth stats
			
        	_ax = layoutAnchor.x; 
			_ay = layoutAnchor.y;                       
			
        	//sum up the depth info
			for (var i:uint=1; i<_maxDepth; ++i)
				_depths[i] += _depths[i-1] + _dspace;
			
			//assign positions
        	secondWalk(group.dataStructure.tree.root as VisualNodeItem, null, -params(group.dataStructure.tree.root as VisualNodeItem).prelim, 0, true); 
//        	updateEdgePoints(_t);                        // update edges
    	}

		protected override function autoAnchor():void
		{
			// otherwise generate anchor based on the bounds
			var b:Rectangle = layoutBounds;
			var r:VisualNodeItem = group.dataStructure.tree.root as VisualNodeItem;
			switch (_orient) {
				case Orientation.LEFT_TO_RIGHT:
					_ax = b.x + _dspace + r.w;
					_ay = b.y + b.height / 2;
					break;
				case Orientation.RIGHT_TO_LEFT:
					_ax = b.width - (_dspace + r.w);
					_ay = b.y + b.height / 2;
					break;
				case Orientation.TOP_TO_BOTTOM:
					_ax = b.x + b.width / 2;
					_ay = b.y + _dspace + r.h;
					break;
				case Orientation.BOTTOM_TO_TOP:
					_ax = b.x + b.width / 2;
					_ay = b.height - (_dspace + r.h);
					break;
				default:
					throw new Error("Unrecognized orientation value");
			}
			_anchor.x = _ax;
			_anchor.y = _ay;
		}
		
    	private function firstWalk(n:VisualNodeItem, num:int, depth:uint):void
    	{
			//set sizes
			n.w = n.width; //TRANSITIONER TODO: actually uses transitioner's target value for height (not the current value) - see Transitioner.endSize
			n.h = n.height; //TRANSITIONER TODO: actually uses transitioner's target value for height (not the current value) - see Transitioner.endSize
			
			//update depths
			var v:Boolean = Orientation.isVertical(_orient);
			var d:Number = v ? n.h : n.w;
			if (depth >= _depths.length) {
				_depths = Arrays.copy(_depths, new Array(int(1.5*depth)));
				for (var i1:int=depth; i1<_depths.length; ++i1) _depths[i1] = 0;
			} 
			_depths[depth] = Math.max(_depths[depth], d);
			_maxDepth = Math.max(_maxDepth, depth);
			
    		var np:Params = params(n);
    		np.number = num;
    		
    		var expanded:Boolean = n.expanded;
    		if (n.childDegree == 0 || !expanded) // is leaf
    		{
    			var l:VisualNodeItem = n.prevNode;
    			np.prelim = l==null ? 0 : params(l).prelim + spacing(l,n,true);
    		}
    		else if (expanded) // has children, is expanded
    		{
    			var midpoint:Number, i:uint;
    			var lefty:VisualNodeItem = n.firstChildNode;
    			var right:VisualNodeItem = n.lastChildNode;
    			var ancestor:VisualNodeItem = lefty;
    			var c:VisualNodeItem = lefty;
    			
    			for (i=0; c != null; ++i, c = c.nextNode) {
    				firstWalk(c, i, depth+1);
    				ancestor = apportion(c, ancestor);
    			}
    			executeShifts(n);
    			midpoint = 0.5 * (params(lefty).prelim + params(right).prelim);
    			
    			l = n.prevNode;
    			if (l != null) {
    				np.prelim = params(l).prelim + spacing(l,n,true);
    				np.mod = np.prelim - midpoint;
    			} else {
    				np.prelim = midpoint;
    			}
    		}
    	}
		
		private function secondWalk(n:VisualNodeItem, p:VisualNodeItem, m:Number, depth:uint, visible:Boolean):void
		{
			// set position
			var np:Params = params(n);
			var o:Object = n;
			
			//positions
			var b:Number = (visible ? np.prelim : 0) + m;
			switch (_orient) {
				case Orientation.LEFT_TO_RIGHT:
					o.x = _ax + _depths[depth];
					o.y = _ay + b;
					break;
				case Orientation.RIGHT_TO_LEFT:
					o.x = _ax - _depths[depth];
					o.y = _ay + b;
					break;
				case Orientation.TOP_TO_BOTTOM:
					o.x = _ax + b;
					o.y = _ay + _depths[depth];
					break;
				case Orientation.BOTTOM_TO_TOP:
					o.x = _ax + b;
					o.y = _ay - _depths[depth];
					break;
				default:
					throw new Error("Unrecognized orientation value");
			}
			
			//visibility
			o.alpha = visible ? 1.0 : 0.0;
			if (o.parentEdge != null) {
				o = o.parentEdge;
				o.alpha = visible ? 1.0 : 0.0;
			}
			
			trace("depth: "+depth+" x:"+n.x+" y:"+n.y);
			
			// recurse into children
			var v:Boolean = n.expanded ? visible : false;
			var b:Number = m + (n.expanded ? np.mod : np.prelim)
			if (v) depth += 1;
			for (var c:VisualNodeItem = n.firstChildNode; c!=null; c=c.nextNode)
				secondWalk(c, n, b, depth, v);
			np.clear();
		}
		
		//---
    
    	private function apportion(v:VisualNodeItem, a:VisualNodeItem):VisualNodeItem
    	{
    		var w:VisualNodeItem = v.prevNode;
    		if (w != null) {
    			var vip:VisualNodeItem, vim:VisualNodeItem, vop:VisualNodeItem, vom:VisualNodeItem;
    			var sip:Number, sim:Number, sop:Number, som:Number;
    			
    			vip = vop = v;
    			vim = w;
    			vom = vip.parentNode.firstChildNode;
    			
    			sip = params(vip).mod;
    			sop = params(vop).mod;
    			sim = params(vim).mod;
    			som = params(vom).mod;
    			
    			var shift:Number;
    			var nr:VisualNodeItem = nextRight(vim);
    			var nl:VisualNodeItem = nextLeft(vip);
    			while (nr != null && nl != null) {
    				vim = nr;
    				vip = nl;
    				vom = nextLeft(vom);
    				vop = nextRight(vop);
    				params(vop).ancestor = v;
    				shift = (params(vim).prelim + sim) - 
    					(params(vip).prelim + sip) + spacing(vim,vip,false);
    				
    				if (shift > 0) {
    					moveSubtree(ancestor(vim,v,a), v, shift);
    					sip += shift;
    					sop += shift;
    				}
    				
    				sim += params(vim).mod;
                	sip += params(vip).mod;
                	som += params(vom).mod;
                	sop += params(vop).mod;
                
                	nr = nextRight(vim);
                	nl = nextLeft(vip);
            	}
            	if (nr != null && nextRight(vop) == null) {
                	var vopp:Params = params(vop);
                	vopp.thread = nr;
                	vopp.mod += sim - sop;
            	}
            	if (nl != null && nextLeft(vom) == null) {
                	var vomp:Params = params(vom);
                	vomp.thread = nl;
                	vomp.mod += sip - som;
                	a = v;
            	}
        	}
        	return a;
    	}
    
    	private function nextLeft(n:VisualNodeItem):VisualNodeItem
    	{
    		var c:VisualNodeItem = null;
        	if (n.expanded) c = n.firstChildNode;
        	return (c != null ? c : params(n).thread);
    	}

    	private function nextRight(n:VisualNodeItem):VisualNodeItem
    	{
    		var c:VisualNodeItem = null;
    		if (n.expanded) c = n.lastChildNode;
        	return (c != null ? c : params(n).thread);
    	}

		private function moveSubtree(wm:VisualNodeItem, wp:VisualNodeItem, shift:Number):void
		{
			var wmp:Params = params(wm);
			var wpp:Params = params(wp);
			var subtrees:Number = wpp.number - wmp.number;
			wpp.change -= shift/subtrees;
			wpp.shift += shift;
			wmp.change += shift/subtrees;
			wpp.prelim += shift;
			wpp.mod += shift;
		}   

		private function executeShifts(n:VisualNodeItem):void
		{
			var shift:Number = 0, change:Number = 0;
			for (var c:VisualNodeItem = n.lastChildNode; c != null; c = c.prevNode)
			{
				var cp:Params = params(c);
				cp.prelim += shift;
				cp.mod += shift;
				change += cp.change;
				shift += cp.shift + change;
			}
		}
		
		private function ancestor(vim:VisualNodeItem, v:VisualNodeItem, a:VisualNodeItem):VisualNodeItem
		{
			var vimp:Params = params(vim);
			var p:VisualNodeItem = v.parentNode;
			return (vimp.ancestor.parentNode == p ? vimp.ancestor : a);
		}
		
		private function spacing(l:VisualNodeItem, r:VisualNodeItem, siblings:Boolean):Number
		{
			var w:Boolean = Orientation.isVertical(_orient);
			return (siblings ? _bspace : _tspace) + 0.5 *
					(w ? l.w + r.w : l.h + r.h)
    	}
    
		
		private function params(n:VisualNodeItem):Params
		{
			var p:Params = n.props[PARAMS] as Params;
			if (p == null) {
				p = new Params();
				n.props[PARAMS] = p;
			}
			if (p.number == -2) { p.init(n); }
			return p;
    	}
		
	}

}


import lemonflow.ui.base.VisualNodeItem;

class Params {
	public var prelim:Number = 0;
	public var mod:Number = 0;
	public var shift:Number = 0;
	public var change:Number = 0;
	public var number:int = -2;
	public var ancestor:VisualNodeItem = null;
	public var thread:VisualNodeItem = null;
    
    public function init(item:VisualNodeItem):void
    {
    	ancestor = item;
    	number = -1;
    }

	public function clear():void
	{
		number = -2;
		prelim = mod = shift = change = 0;
		ancestor = thread = null;
	}
} // end of class Params