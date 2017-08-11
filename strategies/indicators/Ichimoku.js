// required indicators

var Indicator = function(settings) {

    console.log('Init Ichimoku Indicators, settings:', settings)

    // settings
    this.tenkan_n = 8;
    this.kijun_n = 11;

    this.tenkan = Array(this.tenkan_n);
    this.kijun = Array(this.kijun_n);
    this.senkou_a = Array(this.kijun_n);
    this.senkou_b = Array(this.kijun_n * 2);
    this.chikou = [];
}

Indicator.prototype.update = function(candle) {
    this.tenkan.push(this.calc(candle, this.tenkan_n));
    this.kijun.push(this.calc(candle, this.kijun_n));
    this.senkou_a.push((this.tenkan[this.tenkan.length - 1] + this.kijun[this.kijun.length - 1]) / 2);
    this.senkou_b.push(this.calc(candle, this.kijun_n * 2));
    this.chikou.push(candle.close);
}

Indicator.prototype.check = function() {
    
    const c = { 
        tenkan: this.tenkan[this.tenkan.length - 1],
        kijun: this.kijun[this.kijun.length - 1],
        chikou: this.chikou[this.chikou.length - 1],
        lag_chikou: this.chikou[this.chikou.length - this.kijun_n],
        senkou_a: this.senkou_a[this.senkou_a.length - this.kijun_n],
        senkou_b: this.senkou_b[this.senkou_b.length - this.kijun_n]
    };
        
    return c;
}

Indicator.prototype.calc = function(candle, n) {
    const hh = Math.max(candle.high);
    const ll = Math.min(candle.low);
    return (hh + ll) / 2;
}

module.exports = Indicator;
