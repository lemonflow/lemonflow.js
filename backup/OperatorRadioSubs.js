OperatorRadioSubs.prototype = Object.create(OperatorInteraction.prototype);

function OperatorRadioSubs(v) {
    OperatorInteraction.apply(this, arguments);

    this.floatingIdx = 0;

    this.update = function(slots, currentIdx, nextIndex) {
        var s;
        var i	= 0;
        var centerScale = 0;

        var tile_glow_outer = null;
        var tile_divider = null;
        var tile_glow_inner = null;
        var tile_text = null;

        for(i= 0;i<this.group.numberOfSlots;i++) {
            this.floatingIdx = i-currentIdx;
            s = slots[i];
            centerScale = (Math.max(0,Math.min(1,Math.abs(this.floatingIdx))))

            tile_glow_outer = s.children[0];
            tile_divider = s.children[3];
            tile_glow_inner = s.children[2];
            tile_text = s.children[4];

            tile_glow_outer.opacity = 1-Math.min(1,Math.max(0,centerScale));
            tile_divider.opacity = 1-Math.min(1,Math.max(0,centerScale))*0.6;
            tile_glow_inner.opacity = 1-Math.min(1,Math.max(0,centerScale))*0.7;
            tile_text.text = this.group.dataProvider[i].name;


        }
    }
}


