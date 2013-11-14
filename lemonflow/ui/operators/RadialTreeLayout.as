package lemonflow.ui.operators
{
	import lemonflow.ui.base.VisualNodeItem;
	import flare.util.Arrays;
	
	import flash.geom.Rectangle;
	
	/**
	 * Layout that places tree nodes in a radial layout, laying out depths of a tree
	 * along circles of increasing radius. 
	 * This layout can be used for both node-link diagrams, where nodes are
	 * connected by edges, and for radial space-filling ("sunburst") diagrams.
	 * To generate space-filling layouts, nodes should have their shape
	 * property set to <code>Shapes.WEDGE</code> and the layout instance should
	 * have the <code>useNodeSize<code> property set to false.
	 * 
	 * <p>The algorithm used is an adaptation of a technique by Ka-Ping Yee,
	 * Danyel Fisher, Rachna Dhamija, and Marti Hearst, published in the paper
	 * <a href="http://citeseer.ist.psu.edu/448292.html">Animated Exploration of
	 * Dynamic Graphs with Radial Layout</a>, InfoVis 2001. This algorithm computes
	 * a radial layout which factors in possible variation in sizes, and maintains
	 * both orientation and ordering constraints to facilitate smooth and
	 * understandable transitions between layout configurations.
	 * </p>
	 */
	public class RadialTreeLayout extends OperatorLayout
	{
		public static const PARAMS:String = "radialTreeLayoutParams"; // name for storing parameters for this layout. 
		public static const DEFAULT_RADIUS:int = 50; //default radius increment between depth levels. 
	
	    protected var _maxDepth:int = 0;
		protected var _radiusInc:Number = DEFAULT_RADIUS; 	//radius increment between depth levels. 
		protected var _theta1:Number = Math.PI/2; 			//initial angle for the radial layout (rad)
		protected var _theta2:Number = Math.PI/2 - 2*Math.PI; //angular width of the layout (in radians, default is 2 pi). 
		protected var _sortAngles:Boolean = true; 			//sort nodes by angles (important for transitions with different spanning-tree configurations)
		protected var _setTheta:Boolean = false;
		protected var _autoScale:Boolean = true; 				//scale layout to the layoutBounds
		protected var _useNodeSize:Boolean = true; 			//size should be used to determine layout spacing (set to false for space-filling radial layout)
	   
		private var _prevRoot:VisualNodeItem = null;

		public function get radiusIncrement():Number { return _radiusInc; }
		public function set radiusIncrement(r:Number):void { _radiusInc = r; }
		public function get sortAngles():Boolean { return _sortAngles; }
		public function set sortAngles(b:Boolean):void { _sortAngles = b; }
		public function get autoScale():Boolean { return _autoScale; }
		public function set autoScale(b:Boolean):void { _autoScale = b; }
		public function get startAngle():Number { return _theta1; }
		public function set startAngle(a:Number):void { _theta2 += (a - _theta1); _theta1 = a; _setTheta = true; }
		public function get angleWidth():Number { return _theta1 - _theta2; }
		public function set angleWidth(w:Number):void { _theta2 = _theta1 - w;	_setTheta = true; }
		public function get useNodeSize():Boolean { return _useNodeSize; }
		public function set useNodeSize(b:Boolean):void { _useNodeSize = b; }

		public function RadialTreeLayout(radius:Number=DEFAULT_RADIUS, sortAngles:Boolean=true, autoScale:Boolean=true)
		{
			layoutType = POLAR;
			_radiusInc = radius;
			_sortAngles = sortAngles;
			_autoScale = autoScale;
		}

		protected override function layout():void
		{
			var n:VisualNodeItem = group.dataStructure.tree.root as VisualNodeItem;
			if (n == null) { return; }
			var np:Params = params(n);
			
        	_maxDepth = 0;
        	calcAngularWidth(n, 0);
			
			if (_autoScale) setScale(layoutBounds);
			if (!_setTheta) calcAngularBounds(n);
			_anchor = layoutAnchor;
			
			// perform the layout
	        if (_maxDepth > 0) {
	        	doLayout(n, _radiusInc, _theta1, _theta2);
	        } else if (n.childDegree > 0) {
	        	n.visitTreeDepthFirst(function(n:VisualNodeItem):void {
	        		n.origin = _anchor;
	        		var o:Object = n;
	        		// collapse to inner radius
					o.radius = o.h = o.v = _radiusInc / 2;
					o.alpha = 0;
					if (n.parentEdge != null)
						n.parentEdge.alpha = 0;
            	});
	        }
	        
	        // update properties of the root node
	        np.angle = _theta2 - _theta1;
	        n.origin = _anchor;
	        u(n, 0, _theta1+np.angle/2, np.angle, true);
	        n.x = _anchor.x;
	        n.y = _anchor.y;
			
//			updateEdgePoints(_t);
		}
		
		private function setScale(bounds:Rectangle):void
		{
	        var r:Number = Math.min(bounds.width, bounds.height)/2.0;
	        if (_maxDepth > 0) _radiusInc = r / _maxDepth;
	    }
		
	    /**
	     * Calculates the angular bounds of the layout, attempting to
	     * preserve the angular orientation of the display across transitions.
	     */
	    private function calcAngularBounds(r:VisualNodeItem):void
	    {
	        if (_prevRoot == null || r == _prevRoot)
	        {
	            _prevRoot = r; 
				return;
	        }
	        
	        // try to find previous parent of root
	        var p:VisualNodeItem = _prevRoot, pp:VisualNodeItem;
	        while (true) {
	        	pp = p.parentNode;
	            if (pp == r) {
	                break;
	            } else if (pp == null) {
	                _prevRoot = r;
	                return;
	            }
	            p = pp;
	        }
	
	        // compute offset due to children's angular width
	        var dt:Number = 0;
	        
	        for each (var n:VisualNodeItem in sortedChildren(r)) {
	        	if (n == p) break;
	        	dt += params(n).width;
	        }
	        
	        var rw:Number = params(r).width;
	        var pw:Number = params(p).width;
	        dt = -2*Math.PI * (dt+pw/2)/rw;
	
	        // set angular bounds
	        _theta1 = dt + Math.atan2(p.y-r.y, p.x-r.x);
	        _theta2 = _theta1 + 2*Math.PI;
	        _prevRoot = r;     
	    }
		
		/**
	     * Computes relative measures of the angular widths of each
	     * expanded subtree. Node diameters are taken into account
	     * to improve space allocation for variable-sized nodes.
	     * 
	     * This method also updates the base angle value for nodes 
	     * to ensure proper ordering of nodes.
	     */
	    private function calcAngularWidth(n:VisualNodeItem, d:int):Number
	    {
	        if (d > _maxDepth) _maxDepth = d;       
	        var aw:Number = 0, diameter:Number = 0;
	        if (_useNodeSize && d > 0) {
	        	//diameter = 1;
	        	diameter = n.expanded && n.childDegree > 0 ? 0 : n.size;
	        } else if (d > 0) {
	        	var w:Number = n.width, h:Number = n.height;
	        	diameter = Math.sqrt(w*w+h*h)/d;
	        	if (isNaN(diameter)) diameter = 0;
	        }

	        if (n.expanded && n.childDegree > 0) {
	        	for (var c:VisualNodeItem=n.firstChildNode; c!=null; c=c.nextNode)
	        	{
	        		aw += calcAngularWidth(c, d+1);
	        	}
	        	aw = Math.max(diameter, aw);
	        } else {
	        	aw = diameter;
	        }
			params(n).width = aw;
	        return aw;
	    }
		
		private static function normalize(angle:Number):Number
		{
	        while (angle > 2*Math.PI)
	            angle -= 2*Math.PI;
	        while (angle < 0)
	            angle += 2*Math.PI;
	        return angle;
	    }

		private function sortedChildren(n:VisualNodeItem):Array
		{
			var cc:int = n.childDegree;
			if (cc == 0) return Arrays.EMPTY;
			var angles:Array = new Array(cc);
	        
	        if (_sortAngles) {
	        	// update base angle for node ordering			
				var base:Number = -_theta1;
				var p:VisualNodeItem = n.parentNode;
	        	if (p != null) base = normalize(Math.atan2(p.y-n.y, n.x-p.x));
	        	
	        	// collect the angles
	        	var c:VisualNodeItem = n.firstChildNode;
		        for (var i:uint=0; i<cc; ++i, c=c.nextNode) {
		        	angles[i] = normalize(-base + Math.atan2(c.y-n.y,n.x-c.x));
		        }
		        // get array of indices, sorted by angle
		        angles = angles.sort(Array.NUMERIC | Array.RETURNINDEXEDARRAY);
		        // switch in the actual nodes and return
		        for (i=0; i<cc; ++i) {
		        	angles[i] = n.getChildNode(angles[i]);
		        }
		    } else {
		    	for (i=0; i<cc; ++i) {
		        	angles[i] = n.getChildNode(i);
		        }
		    }
	        
	        return angles;
	    }
		
		/**
	     * Compute the layout.
	     * @param n the root of the current subtree under consideration
	     * @param r the radius, current distance from the center
	     * @param theta1 the start (in radians) of this subtree's angular region
	     * @param theta2 the end (in radians) of this subtree's angular region
	     */
	    private function doLayout(n:VisualNodeItem, r:Number,
	    	theta1:Number, theta2:Number):void
	    {
	    	var dtheta:Number = theta2 - theta1;
	    	var dtheta2:Number = dtheta / 2.0;
	    	var width:Number = params(n).width;
	    	var cfrac:Number, nfrac:Number = 0;
	        
	        for each (var c:VisualNodeItem in sortedChildren(n)) {
	        	var cp:Params = params(c);
	            cfrac = cp.width / width;
	            if (c.expanded && c.childDegree > 0)
	            {
	                doLayout(c, r+_radiusInc, theta1 + nfrac*dtheta, 
	                                          theta1 + (nfrac+cfrac)*dtheta);
	            }
	            else if (c.childDegree > 0)
	            {
	            	var cr:Number = r + _radiusInc;
	            	var ca:Number = theta1 + nfrac*dtheta + cfrac*dtheta2;
	            	
	            	c.visitTreeDepthFirst(function(n:VisualNodeItem):void {
	            		n.origin = _anchor;
	            		u(n, cr, minAngle(n.angle, ca), 0, false);
	            	});
	            }
	            
	            c.origin = _anchor;
	            var a:Number = minAngle(c.angle, theta1 + nfrac*dtheta + cfrac*dtheta2);
	            cp.angle = cfrac * dtheta;
	            u(c, r, a, cp.angle, true);
	            nfrac += cfrac;
	        }
	    }
		
		private function u(n:VisualNodeItem, r:Number, a:Number,
								aw:Number, v:Boolean) : void
		{
			var o:Object = n, alpha:Number = v ? 1 : 0;
			o.radius = r;
			o.angle = a;
			if (aw == 0) {
				o.h = o.v = r - _radiusInc/2;
			} else {
				o.h = r + _radiusInc/2;
				o.v = r - _radiusInc/2;
			}
			o.w = aw;
			o.u = a - aw/2;
			o.alpha = alpha;
			if (n.parentEdge != null)
				n.parentEdge.alpha = alpha;
		}
				
		private function params(n:VisualNodeItem):Params
		{
			var p:Params = n.props[PARAMS];
			if (p == null) {
				p = new Params();
				n.props[PARAMS] = p;
			}
			return p;
		}
		
	}
}

class Params {
	public var width:Number = 0;
	public var angle:Number = 0;
}