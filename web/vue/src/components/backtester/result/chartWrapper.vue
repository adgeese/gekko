<template lang='jade'>
#chartWrapper(v-bind:class='{ clickable: !isClicked }')
  .shield(v-on:click.prevent='click')
  svg#chart(width='960', :height='height')
</template>

<script>

import chart from '../../../d3/chart4'
import { draw as drawMessage, clear as clearMessage } from '../../../d3/message'

const MIN_CANDLES = 4;

export default {
  props: ['data', 'height'],

  data: function() {
    return {
      isClicked: false
    }
  },

  watch: {
    data: function() { this.render() },
  },

  created: function() { setTimeout( this.render, 100) },
  beforeDestroy: function() {
    this.remove();
  },

  methods: {
    click: function() {
      this.isClicked = true;
    },
    render: function() {
      this.remove();


      if(_.size(this.data.candles) < MIN_CANDLES) {
        drawMessage('Not enough data to spawn chart');
      } else {
        chart(this.data.candles, this.data.trades, this.height);
      }
    },
    remove: function() {
      d3.select('#chart').html('');
    }
  }
}
</script>

<style>

#chartWrapper.clickable {
  position: relative;
}

#chartWrapper.clickable .shield {
  cursor: zoom-in;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: grey;
  opacity: 0.1;
}

#chart {
  background-color: #eee;
  width: 100%;
}

#chart circle {
  clip-path: url(#clip);
}

#chart .zoom {
  cursor: move;
  fill: none;
  pointer-events: all;
}

#chart .line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
  clip-path: url(#clip);
}

/*#chart .price.line {
  stroke-width: 2.5px;
}*/

#chart circle.buy {
  fill: #7FFF00;
}

#chart circle.sell {
  fill: red;
}


/*
    body {
        font: 10px sans-serif;
    }

    text {
        fill: #000;
    }

    button {
        position: absolute;
        right: 20px;
        top: 440px;
        display: none;
    }*/

    path.candle.body {
        stroke-width: 0;
    }

    path.candle.up {
        fill: #00AA00;
        stroke: #00AA00;
    }

    path.candle.down {
        fill: #FF0000;
        stroke: #FF0000;
    }

    .ichimoku path {
        fill: none;
        stroke-width: 0.8;
    }

    .ichimoku path {
        stroke: #000000;
    }

    .ichimoku path.chikouspan {
        stroke: #BF5FFF;
    }

    .ichimoku path.tenkansen {
        stroke: #0033FF;
    }

    .ichimoku path.kijunsen {
        stroke: #FBB117;
    }

    .ichimoku path.kumo {
        opacity: 0.1;
    }

    .ichimoku path.kumo.up {
        fill: #00AA00;
    }

    .ichimoku path.kumo.down {
        fill: #FF0000;
    }

    .ichimoku path.senkouspana {
        stroke: #006600;
    }

    .ichimoku path.senkouspanb {
        stroke: #FF0000;
    }


</style>
