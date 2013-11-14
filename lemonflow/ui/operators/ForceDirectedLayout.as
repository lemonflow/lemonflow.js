package lemonflow.ui.operators
{
	import flare.data.Data;
	import lemonflow.ui.base.VisualDataItem;
	import lemonflow.ui.base.VisualEdgeItem;
	import lemonflow.ui.base.VisualNodeItem;
	import flare.physics.Particle;
	import flare.physics.Simulation;
	import flare.physics.Spring;
	
	public class ForceDirectedLayout extends OperatorLayout
	{
		private var _sim:Simulation;
		private var _step:Number = 1; //number of time ticks to advance the simulation on each
		private var _iter:int = 1; //number of iterations to run the simulation per invocation
		private var _gen:uint = 0;
		private var _enforceBounds:Boolean = false; //if the layout bounds should be enforced (based on layoutBounds)
		
		// simulation defaults
		private var _mass:Number = 1; //default mass value for node/particles.
		private var _restLength:Number = 30; //default spring rest length for edge/springs. 
		private var _tension:Number = 0.3; //default spring tension for edge/springs. */
		private var _damping:Number = 0.1;
		
		public function get defaultParticleMass():Number { return _mass; }
		public function set defaultParticleMass(v:Number):void { _mass = v; }
		public function get defaultSpringLength():Number { return _restLength; }
		public function set defaultSpringLength(v:Number):void { _restLength = v; }
		public function get defaultSpringTension():Number { return _tension; }
		public function set defaultSpringTension(v:Number):void { _tension = v; }
		public function get iterations():int { return _iter; }
		public function set iterations(iter:int):void { _iter = iter; }
		public function get ticksPerIteration():int { return _step; }
		public function set ticksPerIteration(ticks:int):void { _step = ticks; }
		public function get enforceBounds():Boolean { return _enforceBounds; }
		public function set enforceBounds(b:Boolean):void { _enforceBounds = b; }
		public function get simulation():Simulation { return _sim; }
		
		public var mass:Function = function(d:VisualDataItem):Number { return _mass; } //Function for mass values to particles based on data of item
		public var restLength:Function = function(e:VisualEdgeItem):Number { return _restLength; } //Function for rest length values to particles based on data of entry.
		public var tension:Function = function(e:VisualEdgeItem):Number { return _tension / Math.sqrt(Math.max(Spring(e.props.spring).p1.degree, Spring(e.props.spring).p2.degree)); } //Function for tension (default is based on max degree of edges)
		public var damping:Function = function(e:VisualEdgeItem):Number { return Spring(e.props.spring).tension / 10; }

			
		public function ForceDirectedLayout(enforceBounds:Boolean=false, iterations:int=1, sim:Simulation=null) {
			_enforceBounds = enforceBounds;
			_iter = iterations;
			_sim = (sim==null ? new Simulation(0, 0, 0.1, -10) : sim);
		}
		
		protected function init():void
		{
			var data:Data = group.dataStructure, o:Object;
			var p:Particle, s:Spring, n:VisualNodeItem, e:VisualEdgeItem;
			
			// initialize all simulation entries
			for each (n in data.nodes) {
				p = n.props.particle;
				o = n;
				if (p == null) {
					n.props.particle = (p = _sim.addParticle(_mass, o.x, o.y));
					p.fixed = o.fixed;
				} else {
					p.x = o.x;
					p.y = o.y;
					p.fixed = o.fixed;
				}
				p.tag = _gen;
			}
			for each (e in data.edges) {
				s = e.props.spring;
				if (s == null) {
					e.props.spring = (s = _sim.addSpring(
						e.source.props.particle, e.target.props.particle,
						_restLength, _tension, _damping));
				}
				s.tag = _gen;
			}
			
			// set up simulation parameters
			// this needs to be kept separate from the above initialization
			// to ensure all simulation items are created first
			if (mass != null) {
				for each (n in data.nodes) {
					p = n.props.particle;
					p.mass = mass(n);
				}
			}
			for each (e in data.edges) {
				s = e.props.spring;
				if (restLength != null)
					s.restLength = restLength(e);
				if (tension != null)
					s.tension = tension(e);
				if (damping != null)
					s.damping = damping(e);
			}
			
			// clean-up unused items
			for each (p in _sim.particles)
			if (p.tag != _gen) p.kill();
			for each (s in _sim.springs)
			if (s.tag != _gen) s.kill();
		}
		
		protected override function layout():void
		{
			++_gen; // update generation counter
			init(); // populate simulation
			
			// run simulation
			_sim.bounds = _enforceBounds ? layoutBounds : null;
			for (var i:uint=0; i<_iter; ++i) 
				_sim.tick(_step);
			group.dataStructure.nodes.visit(u); // update positions
			//updateEdgePoints(_t);
		}

		protected function u(d:VisualDataItem):void
		{
			if (!d.props.particle.fixed) {
				d.x = d.props.particle.x;
				d.y = d.props.particle.y;
			}
		}
	} 
}