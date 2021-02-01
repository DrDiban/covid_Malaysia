var dateChart = dc.barChart('#date-chart');
var ndx;

d3.csv(window.CrossFilter.config.dataUrl, function (data) {
	
	data.forEach(function(d){
		d.dd=new Date(d.date);
	});
	
	ndx = crossfilter(data);
	var all = ndx.groupAll();
	
	
	var dateDimension = ndx.dimension(function (d) {
       return d3.time.day(d.dd);
	})
	
	var dateGroup = dateDimension.group().reduceCount(function (d) {
      return d.case;
	})
	
	dateChart
		.width(500)
		.height(200)
		.margins({top: 20, right: 10, bottom: 40, left: 40})
		.dimension(dateDimension)
		.group(dateGroup)
		.x(d3.time.scale().domain([new Date(2016, 1, 1), new Date(2016, 10, 11)]))
		.xUnits(d3.time.days)
		.barPadding(0.0)
		.outerPadding(0.00)
		.centerBar(true)
		.elasticY(true)
		.ordinalColors(['#525252'])
			.xAxis().ticks(d3.time.months, 1)
				.tickFormat(d3.time.format("%b"));
	
	dateChart.yAxis().ticks(5);
	})
