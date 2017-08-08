// required indicators

var Indicator = function(settings) {
    
    // settings = tenkan_n, kijun_n
    tenkan_n = 8; ///settings.tenkan_n
    kijun_n = 11; //settings.kijun_n
    
    console.log('Init Ichimoku Indicators, settings:', settings)


    if (tenkan_n == null) { tenkan_n = 8; }
    
    this.tenkan_n = tenkan_n;
    if (kijun_n == null) { kijun_n = 11; }
    
    this.kijun_n = kijun_n;

    this.tenkan = Array(this.tenkan_n);
    this.kijun = Array(this.kijun_n);
    this.senkou_a = Array(this.kijun_n);
    this.senkou_b = Array(this.kijun_n * 2);
    this.chikou = [];
}

Indicator.prototype.update = function(candle) {
    console.log('Update Ichimoku Indicators')
    this.tenkan.push(this.calc(candle, this.tenkan_n));
    this.kijun.push(this.calc(candle, this.kijun_n));
    this.senkou_a.push((this.tenkan[this.tenkan.length - 1] + this.kijun[this.kijun.length - 1]) / 2);
    this.senkou_b.push(this.calc(candle, this.kijun_n * 2));
    return this.chikou.push(candle.close[candle.close.length - 1]);
}

Indicator.prototype.check = function() {
    console.log('Check Ichimoku Indicators')
    const c = { 
        tenkan: this.tenkan[this.tenkan.length-1],
        kijun: this.kijun[this.kijun.length-1],
        chikou: this.chikou[this.chikou.length-1],
        lag_chikou: this.chikou[this.chikou.length-this.kijun_n],
        senkou_a: this.senkou_a[this.senkou_a.length-this.kijun_n],
        senkou_b: this.senkou_b[this.senkou_b.length-this.kijun_n]
    };
        
    return c;
}

Indicator.prototype.calc = function(candle, n) {
    console.log('Calc Ichimoku Indicators')
    const hh = Math.max(candle.high);
    const ll = Math.min(candle.low);
    return (hh + ll) / 2;
}

module.exports = Indicator;
