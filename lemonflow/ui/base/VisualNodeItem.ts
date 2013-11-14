package lemonflow.ui.base
{
	import flare.util.Arrays;
	import flare.util.Filter;
	import flare.util.IEvaluable;
	import flare.util.Sort;
	
	import flash.geom.Point;
	
	/**
	 * Visually represents a data element, such as a data tuple or graph node.
	 * By default, NodeSprites are drawn using a <codeShapeRenderer<code>.
	 * NodeSprites are typically managed by a <code>Data</code> object.
	 * 
	 * <p>NodeSprites can separately maintain adjacency lists for both a
	 * general graph structure (managing lists for inlinks and outlinks) and a
	 * tree structure (managing a list for child links and a parent pointer).
	 * The graph and tree lists are maintained completely separately to
	 * maximize flexibility. While the the tree lists are often used to record
	 * a spanning tree of the general network structure, they can also be used
	 * to represent a hierarchy completely distinct from a co-existing graph
	 * structure. Take this into account when iterating over the edges incident
	 * on this node.</p>
	 */
	public class VisualNodeItem extends VisualDataItem
	{
		public static const IN_LINKS:uint    = 1; 	//inlinks, edges that point to this node. 
		public static const OUT_LINKS:uint   = 2; 	//outlinks, edges that point away from node. 
		public static const GRAPH_LINKS:uint = 3; 	// both IN_LINKS | OUT_LINKS
		public static const CHILD_LINKS:uint = 4;   //child links
		public static const PARENT_LINK:uint = 8;  //parent in a tree structure.
		public static const TREE_LINKS:uint  = 12; //both child and parent links. CHILD_LINKS | PARENT_LINK
		public static const ALL_LINKS:uint   = 15; //all links, including graph and tree links. GRAPH_LINKS | TREE_LINKS
		public static const REVERSE:uint     = 16; //traversal should be performed in reverse. 
		
		private var _parentEdge:VisualEdgeItem; // edge connecting this node to its parent in a tree structure.
		private var _idx:int = -1; //node index in parent's node array
		private var _childEdges:Array;
		private var _inEdges:Array;
		private var _outEdges:Array;
		private var _expanded:Boolean = true; //node is currently expanded.
		
		public function get expanded():Boolean { return _expanded; }
		public function set expanded(b:Boolean):void { if (_expanded != b) { _expanded = b; dirty(); } }
		public function get parentEdge():VisualEdgeItem { return _parentEdge; }
		public function set parentEdge(e:VisualEdgeItem):void { _parentEdge = e; }
		public function get parentIndex():int { return _idx; }
		public function set parentIndex(i:int):void { _idx = i; }

		public function get childDegree():uint { return _childEdges==null ? 0 : _childEdges.length; } //number of child links.
		public function get degree():uint { return inDegree + outDegree; } //number of inlinks and outlinks.
		public function get inDegree():uint { return _inEdges==null ? 0 : _inEdges.length; } //inlinks
		public function get outDegree():uint { return _outEdges==null ? 0 : _outEdges.length; } //outlinks
		public function get depth():uint { for (var d:uint=0, p:VisualNodeItem=parentNode; p!=null; p=p.parentNode, d++){} return d; } //depth in tree (0 == root)
		
		public function isConnected(n:VisualNodeItem, opt:uint=ALL_LINKS):Boolean { return visitNodes( function(d:VisualNodeItem):Boolean { return n==d; }, opt); }
		public function getChildEdge(i:uint):VisualEdgeItem { return _childEdges[i]; }
		public function getChildNode(i:uint):VisualNodeItem	{ return _childEdges[i].other(this); }
		public function getInEdge(i:uint):VisualEdgeItem { return _inEdges[i]; 	} // inlink edge at the specified position
		public function getInNode(i:uint):VisualNodeItem { return _inEdges[i].source; }
		public function getOutEdge(i:uint):VisualEdgeItem 	{ 	return _outEdges[i]; } // outlink edge at the specified position
		public function getOutNode(i:uint):VisualNodeItem { 	return _outEdges[i].target;} //outlink node at the specified position

		
		public function get parentNode():VisualNodeItem { return _parentEdge == null ? null : _parentEdge.other(this); }
		public function get firstChildNode():VisualNodeItem { return childDegree > 0 ? _childEdges[0].other(this) : null; }
		public function get lastChildNode():VisualNodeItem { return childDegree > 0 ? _childEdges[childDegree-1].other(this) : null; }
		public function get nextNode():VisualNodeItem { return (parentNode == null || _idx+1 >= parentNode.childDegree) ? null : parentNode.getChildNode(_idx+1); }
		public function get prevNode():VisualNodeItem { return (parentNode == null || _idx-1 < 0) ? null: parentNode.getChildNode(_idx-1); }
		
		public override function set x(v:Number):void { if (x != v) dirtyEdges(); super.x = v; }
		public override function set y(v:Number):void {	if (y != v) dirtyEdges(); super.y = v; }
		public override function set radius(r:Number):void { if (_radius != r) dirtyEdges(); super.radius = r; }
		public override function set angle(a:Number):void { if (_angle != a) dirtyEdges(); super.angle = a; }
		public override function set origin(p:Point):void { if (_origin.x != p.x || _origin.y != p.y) dirtyEdges(); super.origin = p; }
		
		private function dirtyEdges():void
		{
			var e:VisualEdgeItem;
			if (_parentEdge) _parentEdge.dirty();
			if (_childEdges) for each (e in _childEdges) { e.dirty(); }
			if (_outEdges)   for each (e in _outEdges)   { e.dirty(); }
			if (_inEdges)    for each (e in _inEdges)    { e.dirty(); }
		}
		
		public function addChildEdge(e:VisualEdgeItem):uint
		{
			if (_childEdges == null) _childEdges = new Array();
			_childEdges.push(e);
			return _childEdges.length - 1;
		}

		public function addInEdge(e:VisualEdgeItem):uint
		{
			if (_inEdges == null) _inEdges = new Array();
			if (_inEdges.indexOf(e) < 0) {
				_inEdges.push(e);
				
				e.dirty();
				this.dirty();
			}
			
			return _inEdges.length - 1;
		}

		public function addOutEdge(e:VisualEdgeItem):uint
		{
			if (_outEdges == null) _outEdges = new Array();
			if (_outEdges.indexOf(e) < 0) {
				_outEdges.push(e);
				
				e.dirty();
				this.dirty();
			}
			
			return _outEdges.length - 1;
		}

		public function removeAllEdges():void { removeEdges(ALL_LINKS); }
		
		public function removeEdges(type:int):void
		{
			var e:VisualEdgeItem;
			if (type & PARENT_LINK && _parentEdge) {
				_parentEdge = null;
			}
			if (type & CHILD_LINKS && _childEdges) {
				while (_childEdges.length > 0) { e=_childEdges.pop(); }
			}
			if (type & OUT_LINKS && _outEdges) {
				while (_outEdges.length > 0) { e=_outEdges.pop(); }
			}
			if (type & IN_LINKS && _inEdges) {
				while (_inEdges.length > 0) { e=_inEdges.pop(); }	
			}
		}
		
		public function removeChildEdge(e:VisualEdgeItem):void { Arrays.remove(_childEdges, e); }
		public function removeInEdge(e:VisualEdgeItem):void { Arrays.remove(_inEdges, e); }
		public function removeOutEdge(e:VisualEdgeItem):void { Arrays.remove(_outEdges, e); }
		
		// -- Visitor Methods --------------------------------------------------
		
		/**
		 * Sorts the order of connected edges according to their properties.
		 * Each type of edge (in, out, or child) is sorted separately.
		 * @param opt flag indicating which set(s) of edges should be sorted
		 * @param sort the sort arguments.
		 * 	If a String is provided, the data will be sorted in ascending order
		 *   according to the data field named by the string.
		 *  If an Array is provided, the data will be sorted according to the
		 *   fields in the array. In addition, field names can optionally
		 *   be followed by a boolean value. If true, the data is sorted in
		 *   ascending order (the default). If false, the data is sorted in
		 *   descending order.
		 */
		public function sortEdgesBy(opt:uint=ALL_LINKS, ...sort):void
		{
			if (sort.length == 0) return;
			if (sort[0] is Array) sort = sort[0];
			
			var s:Function = Sort.$(sort);
			if (opt & IN_LINKS    && _inEdges    != null) _inEdges.sort(s);
			if (opt & OUT_LINKS   && _outEdges   != null) _outEdges.sort(s);
			if (opt & CHILD_LINKS && _childEdges != null) {
				_childEdges.sort(s);
				for (var i:uint=0; i<_childEdges.length; ++i)
					_childEdges[i].other(this).parentIndex = i;
			}
		}
		
		public function visitEdges(f:Function, opt:uint=ALL_LINKS, filter:*=null):Boolean
		{
			var ff:Function = Filter.$(filter);
			var rev:Boolean = (opt & REVERSE) > 0;
			if (opt & IN_LINKS && _inEdges != null) { 
				if (visitEdgeHelper(f, _inEdges, rev, ff)) return true;
			}
			if (opt & OUT_LINKS && _outEdges != null) {
				if (visitEdgeHelper(f, _outEdges, rev, ff)) return true;
			}
			if (opt & CHILD_LINKS && _childEdges != null) {
				if (visitEdgeHelper(f, _childEdges, rev, ff)) return true;
			}
			if (opt & PARENT_LINK && _parentEdge != null) {
				if ((ff==null || ff(_parentEdge)) && f(_parentEdge))
					return true;
			}
			return false;
		}
		
		private function visitEdgeHelper(f:Function, a:Array, r:Boolean, ff:Function):Boolean
		{
			var i:uint, n:uint=a.length, v:*;
			if (r) {
				for (i=n; --i>=0;) {
					if ((ff==null || ff(a[i])) && f(a[i]) as Boolean)
						return true;
				}
			} else {
				for (i=0; i<n; ++i) {
					if ((ff==null || ff(a[i])) && f(a[i]) as Boolean)
						return true;
				}
			}
			return false;
		}
		
		/**
		 * Visits the nodes connected to this node by edges, invoking a
		 * function on each visited node.
		 * @param f the function to invoke on the nodes. If the function
		 *  returns true, the visitation is ended with an early exit.
		 * @param opt flag indicating which sets of edges should be traversed
		 * @return true if the visitation was interrupted with an early exit
		 */
		public function visitNodes(f:Function, opt:uint=ALL_LINKS, filter:*=null):Boolean
		{
			var ff:Function = Filter.$(filter);
			var rev:Boolean = (opt & REVERSE) > 0;
			if (opt & IN_LINKS && _inEdges != null) {
				if (visitNodeHelper(f, _inEdges, rev, ff)) return true;
			}
			if (opt & OUT_LINKS && _outEdges != null) {
				if (visitNodeHelper(f, _outEdges, rev, ff)) return true;
			}
			if (opt & CHILD_LINKS && _childEdges != null) {
				if (visitNodeHelper(f, _childEdges, rev, ff)) return true;
			}
			if (opt & PARENT_LINK && _parentEdge != null) {
				if ((ff==null||ff(_parentEdge)) && f(_parentEdge.other(this)))
					return true;
			}
			return false;
		}
		
		private function visitNodeHelper(f:Function, a:Array, r:Boolean, ff:Function):Boolean
		{
			var i:uint, n:uint=a.length, u:VisualNodeItem;
			if (r) {
				for (i=n; --i>=0;) {
					u = a[i].other(this);
					if ((ff==null || ff(u)) && f(u) as Boolean)
						return true;
				}
			} else {
				for (i=0; i<n; ++i) {
					u = a[i].other(this);
					if ((ff==null || ff(u)) && f(u) as Boolean)
						return true;
				}
			}
			return false;
		}
		
		/**
		 * Visits the subtree rooted at this node using a depth first search,
		 * invoking the input function on each visited node.
		 * @param f the function to invoke on the nodes. If the function
		 *  returns true, the visitation is ended with an early exit.
		 * @param preorder if true, nodes are visited in a pre-order traversal;
		 *  if false, they are visited in a post-order traversal
		 * @return true if the visitation was interrupted with an early exit
		 */
		public function visitTreeDepthFirst(f:Function, preorder:Boolean=false):Boolean
		{
			if (preorder && (f(this) as Boolean)) return true;
			for (var i:uint = 0; i<childDegree; ++i) {
				if (getChildNode(i).visitTreeDepthFirst(f, preorder))
					return true;
			}
			if (!preorder && (f(this) as Boolean)) return true;
			return false;
		}
		
		/**
		 * Visits the subtree rooted at this node using a breadth first search,
		 * invoking the input function on each visited node.
		 * @param f the function to invoke on the nodes. If the function
		 *  returns true, the visitation is ended with an early exit.
		 * @return true if the visitation was interrupted with an early exit
		 */
		public function visitTreeBreadthFirst(f:Function):Boolean
		{
			var q:Array = new Array(), x:VisualNodeItem;
			
			q.push(this);
			while (q.length > 0) {
				if (f(x=q.shift()) as Boolean) return true;
				for (var i:uint = 0; i<x.childDegree; ++i)
					q.push(x.getChildNode(i));
			}
			return false;
		}
		
		/**
		 * Sets property values on edge sprites connected to this node.
		 * @param vals an object containing the properties and values to set.
		 * @param opt flag indicating which sets of edges should be traversed
		 * @param trans a transitioner or time span for updating object values.
		 *  If the input is a transitioner, it will be used to store the
		 *  updated  values. If the input is a number, a new Transitioner with
		 *  duration set to the input value will be used. The input is null by
		 *  default, in which case object values are updated immediately.
		 * @param filter an optional Boolean-valued filter function for
		 * 	limiting which items are visited
		 * @return the transitioner used to update the values
		 */
		public function setEdgeProperties(vals:Object, opt:uint=ALL_LINKS, trans:*=null, filter:*=null):void {
			for (var name:String in vals) {
				var val:* = vals[name];
				var v:Function = val is Function ? val as Function : val is IEvaluable ? IEvaluable(val).eval : null;
				
				visitEdges(function(s:VisualEdgeItem):void {
					s[name] = (v!=null ? v(s) : val);
				}, opt, filter);
			}
			return;
		}
		
		/**
		 * Sets property values on node sprites connected to this node.
		 * @param vals an object containing the properties and values to set.
		 * @param opt flag indicating which sets of nodes should be traversed
		 * @param trans a transitioner or time span for updating object values.
		 *  If the input is a transitioner, it will be used to store the
		 *  updated  values. If the input is a number, a new Transitioner with
		 *  duration set to the input value will be used. The input is null by
		 *  default, in which case object values are updated immediately.
		 * @param filter an optional Boolean-valued filter function for
		 * 	limiting which items are visited
		 * @return the transitioner used to update the values
		 */
		public function setNodeProperties(vals:Object, opt:uint=ALL_LINKS, trans:*=null, filter:*=null):void {
			for (var name:String in vals) {
				var val:* = vals[name];
				var v:Function = val is Function ? val as Function : val is IEvaluable ? IEvaluable(val).eval : null;

				visitNodes(function(n:VisualNodeItem):void {
					n[name] = (v!=null ? v(n) : val);
				}, opt, filter);
			}
			return;
		}
	} 
}