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
  
  console.log('Init Ichimoku Strategy')

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

  console.log('Add Ichimoku indicators')
  // define the indicators we need
  this.addIndicator('ichi', 'Ichimoku', settings);  
  this.ichi = this.indicators.ichi;
  console.log('Add Ichimoku indicators done')

}

// What happens on every new candle?
strat.update = function(candle) {

  console.log('Update Ichimoku Strategy')

  const instrument = candle;

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

  const c = this.ichi.check();

  let diff = 100 * ((c.tenkan - c.kijun) / ((c.tenkan + c.kijun) / 2));

  diff = Math.abs(diff);

  const min_tenkan = Math.min([c.tenkan, c.kijun]);
  const max_tenkan = Math.max([c.tenkan, c.kijun]);
  const min_senkou = Math.min([c.senkou_a, c.senkou_b]);
  const max_senkou = Math.max([c.senkou_a, c.senkou_b]);

  console.log('TLIB SAR Start')
  const results = talib.SAR({
      high: instrument.high,
      low: instrument.low,
      startIdx: 0,
      endIdx: instrument.close.length-1,
      optInAcceleration: this.SARacceleration,
      optInMaximum: this.SARmaxacceleration
  });
  console.log('TLIB SAR End')

  const SAR = _.last(results);
}

// For debugging purposes.
strat.log = function() {
  log.debug('calculated random number:');
  log.debug('\t', this.randomNumber.toFixed(3));

}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {
  console.log('Check Ichimoku Strat')
  if (diff >= this.close) {
      if ((this.pos === "long") && (c.tenkan < c.kijun) && (c.chikou < SAR)) {
          this.advice('short');
      } else if ((this.pos === "short") && (c.tenkan > c.kijun) && (c.chikou > SAR)) {
          this.advice('long');
      }
  }
  if (diff >= this.open) {
      if ((c.tenkan > c.kijun) && (min_tenkan > max_senkou) && (c.chikou > c.lag_chikou)) {
          this.currentTrend = 'long';
          this.advice('long');
      } else if ((c.tenkan < c.kijun) && (max_tenkan < min_senkou) && (c.chikou < c.lag_chikou)) { 
          // If it was long, set it to short
          this.currentTrend = 'short';
          this.advice('short');
      }
  }

  // Only continue if we have a new update.
  if(!this.toUpdate)
    return;

  if(this.currentTrend === 'long') {

    // If it was long, set it to short
    this.currentTrend = 'short';
    this.advice('short');

  } else {

    // If it was short, set it to long
    this.currentTrend = 'long';
    this.advice('long');

  }
}

module.exports = strat;