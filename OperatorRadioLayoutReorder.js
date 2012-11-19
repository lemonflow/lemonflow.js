OperatorRadioLayoutReorder.prototype = Object.create(OperatorInteraction.prototype);

function OperatorRadioLayoutReorder(v) {
    OperatorInteraction.apply(this, arguments);

    this.floatingIdx = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.offsetZ = 0;

    this.update = function(slots, currentIdx, nextIndex) {
        var s;
        var i	= 0;
        var direction = Math.floor(currentIdx) - nextIndex;

            var s1 = slots[0];
            s1.x = this.group.centerXYZ.x;
            s1.y = 0
            s1.scale = 0.7;

        for(i= 1;i<this.group.numberOfSlots;i++) {

            this.floatingIdx = i-currentIdx;
            s = slots[i];

            var centerScale = (Math.max(0,Math.min(1,Math.abs(this.floatingIdx))))
            var centerScaleS = centerScale * (this.floatingIdx>0?1:-1);

            this.offsetX = (this.floatingIdx) * this.group.radiusXYZ.x+ centerScaleS * 57; 		//symmetric left-right
            this.offsetY = 0;
            this.offsetZ = 1+centerScale * this.group.radiusXYZ.z; //depth

            var xedge = 2; //items outside of this number will run behind main construct

            s.opacity = (this.floatingIdx<-xedge || this.floatingIdx>=xedge)?1-Math.min(1,Math.max(Math.abs(this.floatingIdx)-xedge,0)):1;
            s.visible = s.opacity>0?true:false;

            s.x = this.group.centerXYZ.x + this.offsetX;
            s.y = this.group.centerXYZ.y + this.offsetY+20;

            //damn qt has no 2.5D implementation :(
            //brings you back to some time before the roughly 1420, when
            //Filippo Brunelleschi was inventing the concept of central perspective,

            s.scale = 0.7;
        }
    }
}


