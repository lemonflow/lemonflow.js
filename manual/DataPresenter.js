function DataPresenter() {

    this.view = null;
    this.defaultItemData = { name:"", artist:"", image:"", tracklist:"" };

    this.init = function() {
        if(this.view==null || this.view.slots == null || this.view.dataProvider == null)
            return;

//        for(var i=0; i<this.view.numberOfSlots; i++) {
//            this.fillData(i,this.view.slots[i])
//        }

        //this.view.dataProvider.addEventListener(CollectionEvent.COLLECTION_CHANGE, collectionChangeHandler);
    }


    this.fillData = function(idx, item) {
        if(item == null)  return;
        console.log(item);
        if(idx<this.view.dataProvider.length) {
            item.data = this.view.dataProvider[idx];
        } else {
//            item.data = this.defaultItemData;
            item.visible = false;
        }
    }

    //    this.collectionChangeHandler = function(event):void {
    //			if(event is CollectionEvent && (event as CollectionEvent).kind == CollectionEventKind.ADD ) {
    //
    //				//create a new Visual Item/Renderer
    //				var renderer:UIComponent = this.view.itemRenderer.newInstance() as UIComponent;
    //				if(this.view.centerRenderers) {
    //					renderer.x = -renderer.width/2; renderer.y = -renderer.height/2;
    //				}
    //				renderer.z = 0; renderer.visible = true;
    //				var s:UIComponent = new UIComponent();
    //				s.width = renderer.width, s.height = renderer.height; s.visible = true;
    //				s.transform.perspectiveProjection = this.view.projection;
    //				s.addChild(renderer);
    //				this.view.addChild(s);
    //				this.view.slots.push(s);
    //				this.view.renderers.push(renderer);
    //			}
    //    }
}
