// This is a basic example strategy for Gekko.
// For more information on everything please refer
// to this document:
//
// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
//
// The example below is pretty bad investment advice: on every new candle there is
// a 10% chance it will recommend to change your position (to either
// long or short).
var _ = require('lodash');
var log = require('../core/log');

// configuration
var config = require('../core/util.js').getConfig();
var settings = config.Ichimoku;

// Let's create our own strat
var strat = {};

// Prepare everything our method needs
strat.init = function() {
  
  this.name = 'Ichimoku';
  this.currentTrend = 'long';
  this.requiredHistory = 0;

  this.pair = 'btc_usd'
  this.init = true
  this.open = 0.10
  this.close = 2.18
  this.pos = false
  this.SARacceleration = 0.025
  this.SARmaxacceleration = 0.15

  // define the indicators we need
  this.addIndicator('ichi', 'Ichimoku', settings);  
  
  this.ichi = this.indicators.ichi;

  var sarSettings = {
      optInAcceleration: this.SARacceleration,
      optInMaximum: this.SARmaxacceleration
  };

  this.addTalibIndicator('sar', 'sar', sarSettings);
  this.sar = this.talibIndicators.sar;

}

// What happens on every new candle?
strat.update = function(candle) {

  const instrument = candle;

  this.open = instrument.open;
  this.close = instrument.close;
  this.high = instrument.high;
  this.low = instrument.low;

  if (this.init) {

      const t = {
          open: instrument.open,
          close: instrument.close,
          high: instrument.high,
          low: instrument.low
      };
      
      this.ichi.update(t);

      this.init = false;
  }
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {
  console.log('Check Ichimoku Strat')
  
  c = this.ichi.check();

  this.diff = 100 * ((c.tenkan - c.kijun) / ((c.tenkan + c.kijun) / 2));

  console.log('Diff:', this.diff)

  this.diff = Math.abs(this.diff);

  console.log('Diff:', this.diff)

  const min_tenkan = Math.min([c.tenkan, c.kijun]);
  const max_tenkan = Math.max([c.tenkan, c.kijun]);
  const min_senkou = Math.min([c.senkou_a, c.senkou_b]);
  const max_senkou = Math.max([c.senkou_a, c.senkou_b]);

  console.log('SAR Results', this.sar.result)
  console.log('Diff: ' + this.diff + ' Close: ' + this.close + ' Open: ' + this.open)
  console.log('Ichi Check: ', c)


  if (this.diff >= this.close) {
      if ((this.pos === "long") && (this.c.tenkan < this.c.kijun) && (this.c.chikou < this.sar.result.outReal)) {
          this.advice('short');
      } else if ((this.pos === "short") && (this.c.tenkan > this.c.kijun) && (this.c.chikou > this.sar.result.outReal)) {
          this.advice('long');
      }
  }
  if (this.diff >= this.open) {
      if ((c.tenkan > c.kijun) && (min_tenkan > max_senkou) && (c.chikou > c.lag_chikou)) {
          this.currentTrend = 'long';
          this.advice('long');
      } else if ((c.tenkan < c.kijun) && (max_tenkan < min_senkou) && (c.chikou < c.lag_chikou)) { 
          // If it was long, set it to short
          this.currentTrend = 'short';
          this.advice('short');
      }
  }
}

module.exports = strat;