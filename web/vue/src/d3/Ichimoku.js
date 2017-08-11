import _ from 'lodash';

// global moment

export default function(_data, _trades, _height) {

  console.log('Ichimoku Function');

  function draw(data) {
      console.log('Ichimoku Draw Data')
      var ichimokuData = ichimokuIndicator(data);
      x.domain(data.map(ichimokuIndicator.accessor().d));
      // Calculate the y domain for visible data points (ensure to include Kijun Sen additional data offset)
      y.domain(techan.scale.plot.ichimoku(ichimokuData.slice(indicatorPreRoll-ichimokuIndicator.kijunSen())).domain());

      // Logic to ensure that at least +KijunSen displacement is applied to display cloud plotted ahead of ohlc
      x.zoomable().clamp(false).domain([indicatorPreRoll, data.length+ichimokuIndicator.kijunSen()]);

      svg.selectAll("g.candlestick").datum(data).call(candlestick);
      svg.selectAll("g.ichimoku").datum(ichimokuData).call(ichimoku);
      svg.selectAll("g.x.axis").call(xAxis);
      svg.selectAll("g.y.axis").call(yAxis);
  }


  var margin = {top: 20, right: 20, bottom: 30, left: 50},
         width = 960 - margin.left - margin.right,
         height = 500 - margin.top - margin.bottom;

  //svg.attr("width", window.innerWidth - 20);

  var parseDate = d3.timeParse("%d-%b-%y");

  console.log('x');
  var x = techan.scale.financetime()
          .range([0, width]);

  console.log('y');
  var y = d3.scaleLinear()
          .range([height, 0]);

  var candlestick = techan.plot.candlestick()
          .xScale(x)
          .yScale(y);

  var ichimoku = techan.plot.ichimoku()
          .xScale(x)
          .yScale(y);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y)
          .tickFormat(d3.format(",.3s"));

  var svg = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  svg.append("clipPath")
          .attr("id", "clip")
      .append("rect")
          .attr("x", 0)
          .attr("y", y(1))
          .attr("width", width)
          .attr("height", y(0) - y(1));

  var ichimokuIndicator = techan.indicator.ichimoku();
  // Don't show where indicators don't have data
  var indicatorPreRoll = ichimokuIndicator.kijunSen()+ichimokuIndicator.senkouSpanB();

  //d3.csv("data.csv", function(error, data) {
  
  var accessor = candlestick.accessor();

  var data = _data.map(function(d) {
      // Open, high, low, close generally not required, is being used here to demonstrate colored volume
      // bars
      return {
          date: parseDate(d.Date),
          volume: +d.Volume,
          open: +d.Open,
          high: +d.High,
          low: +d.Low,
          close: +d.Close
      };
  }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

  svg.append("g")
          .attr("class", "ichimoku")
          .attr("clip-path", "url(#clip)");

  svg.append("g")
          .attr("class", "candlestick")
          .attr("clip-path", "url(#clip)");

  svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")");

  svg.append("g")
          .attr("class", "y axis")
      .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Ichimoku");

  // Data to display initially
  draw(data.slice(0, data.length-20));

  // Only want this button to be active if the data has loaded
  d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
  // });


}
