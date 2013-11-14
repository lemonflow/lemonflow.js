package lemonflow.ui.operators
{
	import lemonflow.ui.base.VisualEdgeItem;
	import lemonflow.ui.base.VisualNodeItem;
	import flare.util.Arrays;
	
	import flash.geom.Point;
	
	/**
	 * Layout that places tree nodes in an indented outline layout.
	 */
	public class IndentedTreeLayout extends OperatorLayout
	{		
		protected var _bspace:Number = 5;  // the spacing between sibling nodes
    	protected var _dspace:Number = 50; // the spacing between depth levels
    	protected var _depths:Array = new Array(20); // TODO make sure array regrows as needed
    	protected var _maxDepth:int = 0;
    	protected var _ax:Number, _ay:Number; // for holding anchor co-ordinates
		
		/** The spacing to use between depth levels (the amount of indent). */
		public function get depthSpacing():Number { return _dspace; }
		public function set depthSpacing(s:Number):void { _dspace = s; }
		
		/** The spacing to use between rows in the layout. */
		public function get breadthSpacing():Number { return _bspace; }
		public function set breadthSpacing(s:Number):void { _bspace = s; }
		
		// --------------------------------------------------------------------
		
		/**
		 * Creates a new IndentedTreeLayout.
		 * @param depthSpace the amount of indent between depth levels
		 * @param breadthSpace the amount of spacing between rows
		 */		
		public function IndentedTreeLayout(depthSpace:Number=50,
										   breadthSpace:Number=5)
		{
			_bspace = breadthSpace;
			_dspace = depthSpace;
		}
		
		/** @inheritDoc */
		protected override function layout():void
		{
        	Arrays.fill(_depths, 0);
        	_maxDepth = 0;
        
        	var a:Point = layoutAnchor;
        	_ax = a.x + layoutBounds.x;
        	_ay = a.y + layoutBounds.y;
        
        	var root:VisualNodeItem = group.dataStructure.tree.root as VisualNodeItem;
        	if (root == null) return; // TODO: throw exception?
        	
        	layoutNode(root,0,0,true);
    	}
    	
    	
    	protected function layoutNode(node:VisualNodeItem, height:Number, indent:uint, visible:Boolean):Number
    	{
    		var x:Number = _ax + indent * _dspace;
    		var y:Number = _ay + height;
    		var o:Object = node;
    		node.h = node.height;  //TRANSITIONER TODO: actually uses transitioner's target value for height (not the current value) - see Transitioner.endSize
    		
    		// update node
    		o.x = x;
    		o.y = y;
    		o.alpha = visible ? 1.0 : 0.0;
    		
    		// update edge
    		if (node.parentEdge != null) 
    		{
    			var e:VisualEdgeItem = node.parentEdge;
    			var p:VisualNodeItem = node.parentNode;
    			o = e;
    			o.alpha = visible ? 1.0 : 0.0;
    			if (e.points == null) {
					e.points = [(p.x+node.x)/2, (p.y+node.y)/2];
    			}
    			o.points = [p.x, y]; //TRANSITIONER TODO: actually uses transitioner's target value for x (not the current value)
    		}
    		
    		if (visible) { height += node.h + _bspace; }
    		if (!node.expanded) { visible = false; }
    		
    		if (node.childDegree > 0) // is not a leaf node
    		{    			
    			var c:VisualNodeItem = node.firstChildNode;   			
    			for (; c != null; c = c.nextNode) {
    				height = layoutNode(c, height, indent+1, visible);
    			}
    		}
    		return height;
    	}
    	
	} // end of class IndentedTreeLayout
}