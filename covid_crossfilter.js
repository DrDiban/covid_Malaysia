var dateChart = dc.barChart('#date-chart');
var caseDisplay = dc.numberDisplay('#case-chart');
var dischargeDisplay = dc.numberDisplay('#discharge-chart');
var deathDisplay = dc.numberDisplay('#death-chart');
var icuDisplay = dc.numberDisplay('#icu-chart');
var caseTable = dc.dataTable('#data-table');
var caseCount = dc.dataCount('.dc-data-count');
var dateChart2 = dc.barChart('#date-chart2');
var caseDisplay2 = dc.numberDisplay('#case-chart2');
var dateChart3 = dc.barChart('#date-chart3');
var piechart3 = dc.pieChart("#pie-chart3");
var AgeGroupChart = dc.barChart('#group-chart');
var locationChart = dc.barChart('#location-chart');
var comobchart = dc.rowChart('#comob-chart');
var deathDisplay3 = dc.numberDisplay('#death2-chart');
var deathTable = dc.dataTable('#death-table');
var deathCount = dc.dataCount('.dc-data-count2');
var medianDisplay = dc.numberDisplay('#median-chart');
var ndx;



d3.csv(window.CrossFilter3.config.dataUrl,  function (data) {

	var numberFormat = d3.format('.0f');
	
	var formatDate = d3.time.format("%Y-%m-%d");

	
	
	data.forEach(function(d){
		d.dd=formatDate.parse(d.Date);

	});

	data.forEach(function(d){
		d.val=1;
		
	});

	var reducerDeath = reductio()
    		.sum(function(d) { return +d.val; });

	var reducerMedianAge = reductio()
    		.median(function(d) { return +d.Age;})
		.count(true)
		.sum(function(d) { return d.Age; })
		.avg(true);;

	


	ndx = crossfilter(data);
	ndx2 = crossfilter(data);

	var all = ndx.groupAll();

	var dateDimension = ndx.dimension(function (d) {
       		return d3.time.day(d.dd);
	})

	var genderDimension = ndx.dimension(function (d) {
      		return d.Gender;
	});

	var AgeGroupDimension = ndx.dimension(function (d) {
      		return d.Age_Group;
	});

	var locationDimension = ndx.dimension(function (d) {
      		return d.Location;
	});

	var comobDimension = ndx.dimension(function (d) {
      		return d.No_Comorbidity;
	});

	var deathDimension = ndx.dimension(function (d) {
        	return d;
    	})

	var medianDimension = ndx.dimension(function (d) {
		
        	return d.val;
    	})

	var dateGroup = dateDimension.group().reduceSum(function (d) {
      		return d.val;
	})

	var genderGroup =genderDimension.group().reduceCount(function (d) {
      		return d.Gender;
  	});


	var AgeGroupGroup =AgeGroupDimension.group().reduceCount(function (d) {
      		return d.Age_Group;
  	});

	var locationGroup =locationDimension.group().reduceCount(function (d) {
      		return d.Location;
  	});

	var comobGroup =comobDimension.group().reduceCount(function (d) {
      		return d.No_Comorbidity;
  	});	

	
	
	
	var medianGroup = medianDimension.group();
	
	reducerMedianAge(medianGroup);
	
	
	medianDisplay
    	        .group(medianGroup)
    		.formatNumber(numberFormat)
    		.valueAccessor( 
        		function(d) { 
            		return d.value.median; });

	

	var deathGroup = deathDimension.group();
	


	reducerDeath(deathGroup);


	
	
	
	

	
	

	

	dateChart3
		.width(1000)
		.height(350)
		.margins({top: 20, right: 10, bottom: 40, left: 40})
		.dimension(dateDimension)
		.group(dateGroup)
		.x(d3.time.scale().domain([new Date(2020, 02, 1), new Date(2021, 05, 15)]))
		.xUnits(d3.time.days)
		.barPadding(0.0)
		.outerPadding(0.00)
		.centerBar(true)
		.elasticY(true)
		.xAxisLabel('Dates')
		.yAxisLabel('Covid-19 deaths')
		.ordinalColors(['#fc2e1c'])
		.xAxis().ticks(d3.time.months, 1)
		.tickFormat(d3.time.format("%b,%Y"))

	dateChart3.yAxis().tickFormat(d3.format("d"));


	

	 deathCount
    		.dimension(ndx)
    		.group(all)
	
	
	deathTable
    		.dimension(dateDimension)
		.group(function (d) {var monthFormat = d3.time.format("%m %Y");
                            return monthFormat(d.dd);})
    		.size(Infinity)
    		.columns([
        	function (d) {
            		var dateFormat = d3.time.format("%b %d %Y");
            		return dateFormat(d.dd);},
        	
       	 	function(d) {return d.Gender;},
        	function(d) {return d.Age;},
        	function(d) {return d.Hospital;},
		function(d) {return d.Location;},
		function(d) {return d.Comorbidity;},
		function(d) {return d.Detect_to_Death;}

		])

    		.sortBy(function (d) {
			var dateFormat1 = d3.time.format("%Y-%m-%d");
            		return dateFormat1(d.dd);           
        		})
    		.order(d3.ascending);
		
  		update2();	


  	piechart3
    		.width(400)
    		.height(263)
    		.slicesCap(3)
		
		.ordinalColors(['#3cef2c','#ab2cef','#ef3b2c'])
    		.innerRadius(40)
    		.dimension(genderDimension)
    		.group(genderGroup)
		.on('pretransition', function(chart) {
        		chart.selectAll('text.pie-slice').text(function(d) {
            		return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        		})

   		 });
		
    		
	AgeGroupChart
	    	.width(550)
    	    	.height(300)
    	    	.x(d3.scale.ordinal())
    		.xUnits(dc.units.ordinal)
    		.margins({top: 20, left: 35, right: 10, bottom: 30})
    		.group(AgeGroupGroup)
    		.dimension(AgeGroupDimension)
		.xAxisLabel('Age group')
		.yAxisLabel('Covid-19 deaths')
    		.barPadding(0.1)
    		.outerPadding(0.05)
    		.brushOn(false)
		.ordinalColors(["#94406a"])
		.y(d3.scale.sqrt())
    		.elasticY(true)
    		.yAxis().ticks(6);


	
	locationChart
	    	.width(550)
    	    	.height(300)
    	    	.x(d3.scale.ordinal())
    		.xUnits(dc.units.ordinal)
    		.margins({top: 20, left: 30, right: 10, bottom: 50})
    		.group(locationGroup)
    		.dimension(locationDimension)
		.xAxisLabel('Location')
		.yAxisLabel('Covid-19 deaths')
    		.barPadding(0.1)
    		.outerPadding(0.05)
    		.brushOn(false)
		.ordinalColors(["#1190c2"])
    		.y(d3.scale.sqrt())
    		.elasticY(true)
    		.yAxis().ticks(5);
	
	comobchart
    		.width(400)
    		.height(300)
    		.margins({top: 20, left: 25, right: 30, bottom: 40})
    		.elasticX(true)
    		.dimension(comobDimension)
    		.group(comobGroup)
		.x(d3.scale.sqrt()
		.domain([0, 300])
          	.range([0,comobchart.effectiveWidth()])
          	.clamp(true));


    		


	deathDisplay3
    	        .group(deathGroup)
    		.formatNumber(numberFormat)
    		.valueAccessor( 
        		function(d) { 
            		return d.value.sum; });


	




  	var addXLabel = function(chartToUpdate, displayText) {
    	var textSelection = chartToUpdate.svg()
              	.append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", chartToUpdate.width() / 2)
                .attr("y", chartToUpdate.height() - 2)
                .text(displayText);

    	var textDims = textSelection.node().getBBox();
    	var chartMargins = chartToUpdate.margins();

    // Dynamically adjust positioning after reading text dimension from DOM
    textSelection
        .attr("x", chartMargins.left + (chartToUpdate.width()
          - chartMargins.left - chartMargins.right) / 2)
        .attr("y", chartToUpdate.height() - Math.ceil(textDims.height) / 2);
  	};
  	var addYLabel = function(chartToUpdate, displayText) {
    	var textSelection = chartToUpdate.svg()
              	.append("text")
                .attr("class", "y-axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -chartToUpdate.height() / 2)
                .attr("y", 10)
                .text(displayText);
    	var textDims = textSelection.node().getBBox();
    	var chartMargins = chartToUpdate.margins();

    	// Dynamically adjust positioning after reading text dimension from DOM
    	textSelection
        	.attr("x", -chartMargins.top - (chartToUpdate.height()
          	- chartMargins.top - chartMargins.bottom) / 2)
        	.attr("y", Math.max(Math.ceil(textDims.height), chartMargins.left
          	- Math.ceil(textDims.height) - 5));
  	};

  	// Bind addXLabel & addYlabel as callbacks to postRender
  	comobchart.on("postRender", function(chart) {
    		addXLabel(chart, "Covid-19 Deaths");
    		addYLabel(chart, "No of comorbidity");
  	});

	dc.renderAll(); 

	});

var ofs2 = 1, pag2 = 20;
var currentSize2 = 0;
var disp2;

  function reset_to_first2() {

	ofs2=1, pag2=20;
	update2();
	deathTable.redraw();
	}

  function update2() {
      deathTable.beginSlice(ofs2-1);
      deathTable.endSlice(ofs2+pag2);
      display2();
  }

  function display2() {
      disp2 = document.getElementsByClassName('filter-count')[1].innerHTML
	  currentSize2 = parseFloat(disp2.replace(',',''));
      d3.select('#begin2')
          .text(ofs2);
      d3.select('#end2')
          .text(ofs2+pag2-1>=currentSize2 ? currentSize2 :ofs2+pag2-1 );
      d3.select('#last2')
          .attr('disabled', ofs2-pag2<0 ? 'true' : null);
      d3.select('#next2')
          .attr('disabled', ofs2+pag2>=currentSize2 ? 'true' : null);
      d3.select('#reset_to_first2')
          .attr('disabled', ofs2-pag2<0 ? 'true' : null);
      d3.select('#size2').text(ndx.size());
  }

  function next2() {
      ofs2 += pag2;
      update2();
      deathTable.redraw();
  }
  function last2() {
      ofs2 -= pag2;
      update2();
      deathTable.redraw();
	
  }

d3.csv(window.CrossFilter2.config.dataUrl,  function (data) {
	var numberFormat = d3.format('.0f');
	
	
	var formatDate = d3.time.format("%d/%m/%Y");

	
	var reducerCaseday = reductio()
    		.sum(function(d) { return +d.case; });


	data.forEach(function(d){
		d.dd=formatDate.parse(d.date);
		
	});
	
	ndx = crossfilter(data);
	var all = ndx.groupAll();
	
	
	var dateDimension = ndx.dimension(function (d) {
       		return d3.time.day(d.dd);
	})

	var caseDimension = ndx.dimension(function (d) {
        	return d;
    	})

	
	var dateGroup = dateDimension.group().reduceSum(function (d) {
      		return d.case;
	})

	

	var caseGroup = caseDimension.group();
	reducerCaseday(caseGroup);

	caseDisplay2
    	        .group(caseGroup)
    		.formatNumber(numberFormat)
    		.valueAccessor( 
        		function(d) { 
            		return d.value.sum; });

	dateChart2
		.width(600)
		.height(350)
		.margins({top: 20, right: 10, bottom: 40, left: 40})
		.dimension(dateDimension)
		.group(dateGroup)
		.x(d3.time.scale().domain([new Date(2021, 04, 12), new Date(2021, 05, 14)]))
		.xUnits(d3.time.days)
		.barPadding(0.0)
		.outerPadding(0.00)
		.centerBar(true)
		.elasticY(true)
		.xAxisLabel('Dates')
		.yAxisLabel('Covid-19 cases')
		
		.ordinalColors(['#404d44'])
			.xAxis().ticks(d3.time.days, 4)
				.tickFormat(d3.time.format("%b,%d"));




	dateChart2.yAxis().ticks(5);
	

	dc.renderAll(); 


})	


d3.csv(window.CrossFilter1.config.dataUrl,  function (data) {
	
	var numberFormat = d3.format('.0f');
	
	var formatDate = d3.time.format("%d/%m/%Y");
	var cur_Case=0;
	var cur_discharged=0;
	var cur_death=0;
	var cur_ICU=0;
	
	var reducerCaseday = reductio()
    		.sum(function(d) { return +d.caseday; });

	var reducerDischargeday = reductio()
    		.sum(function(d) { return +d.disc_day; });

	var reducerDeathday = reductio()
    		.sum(function(d) { return +d.death_day; });

	var reducerICUday = reductio()
    		.sum(function(d) { return +d.icu_day; });



	data.forEach(function(d,i){
		if(i==0){
		d.caseday=d.case;
		d.disc_day=d.discharged;
		d.death_day=d.death;
		d.icu_day=d.icu;


		cur_Case=d.case;
		cur_discharged=d.discharged;
		cur_death=d.death;
		cur_ICU=d.icu;

	
		}
		else{
		d.caseday=d.case-cur_Case;
		d.disc_day=d.discharged-cur_discharged;
		d.death_day=d.death-cur_death;
		d.icu_day=d.icu-cur_ICU;



		cur_Case=d.case;
		cur_discharged=d.discharged;
		cur_death=d.death;
		cur_ICU=d.icu;
		}

	});

	data.forEach(function(d){
		d.dd=formatDate.parse(d.date);
		
	});
	
	ndx = crossfilter(data);
	var all = ndx.groupAll();

	
	
	var dateDimension = ndx.dimension(function (d) {
       		return d3.time.day(d.dd);
	})

	var caseDimension = ndx.dimension(function (d) {
        	return d;
    	})

	
	var dateGroup = dateDimension.group().reduceSum(function (d) {
      		return d.caseday;
	})

	

	var caseGroup = caseDimension.group();
	reducerCaseday(caseGroup);


	var discGroup = caseDimension.group();
	reducerDischargeday (discGroup);

	var deathGroup = caseDimension.group();
	reducerDeathday (deathGroup);

	var icuGroup = caseDimension.group();
	reducerICUday (icuGroup);


	caseDisplay
    		.group(caseGroup)
    		.formatNumber(numberFormat)
    		.valueAccessor( 
        		function(d) { 
            		return d.value.sum; });

	dischargeDisplay
    		.group(discGroup)
    		.formatNumber(numberFormat)
    		.valueAccessor( 
        		function(d) { 
            		return d.value.sum; });

	deathDisplay
    		.group(deathGroup)
    		.formatNumber(numberFormat)
    		.valueAccessor( 
        		function(d) { 
            		return d.value.sum; });


	icuDisplay
    		.group(icuGroup)
    		.formatNumber(numberFormat)
    		.valueAccessor( 
        		function(d) { 
            		return d.value.sum; });

  	caseCount
    		.dimension(ndx)
    		.group(all)



	
	dateChart
		.width(1000)
		.height(350)
		.margins({top: 20, right: 10, bottom: 40, left: 40})
		.dimension(dateDimension)
		.group(dateGroup)
		.x(d3.time.scale().domain([new Date(2019, 12, 1), new Date(2021, 05, 15)]))
		.xUnits(d3.time.days)
		.barPadding(0.0)
		.outerPadding(0.00)
		.centerBar(true)
		.elasticY(true)
		.xAxisLabel('Dates')
		.yAxisLabel('Covid-19 cases')
		.ordinalColors(['#7256f0'])
		
		.xAxis().ticks(d3.time.months, 1)
		.tickFormat(d3.time.format("%b,%Y"));

	


	

  	caseTable
    		.dimension(dateDimension)
		.group(function (d) {var monthFormat = d3.time.format("%m %Y");
                            return monthFormat(d.dd);})
    		.size(Infinity)
    		.columns([
        	function (d) {
            		var dateFormat = d3.time.format("%b %d %Y");
            		return dateFormat(d.dd);},
        	function(d) {return d.caseday;},
       	 	function(d) {return d.disc_day;},
        	function(d) {return d.death_day;},
        	function(d) {return d.icu;}])

    		.sortBy(function (d) {
			var dateFormat1 = d3.time.format("%Y-%m-%d");
            		return dateFormat1(d.dd);           
        		})
    		.order(d3.ascending);
		
  		update();
	dc.renderAll(); 
	})


const sections=document.querySelectorAll('section');
const navLi=document.querySelectorAll('nav #navbar1 ul li');

window.addEventListener('scroll', ()=> {
  /*console.log(pageYOffset)*/;
  let current='';
  var div=7;
	
  sections.forEach(section=>{
    
	if (section==analysis){
	
	div=100;

	}
	else {
	div=7;
	}	
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if(pageYOffset>=(sectionTop-sectionHeight/div)){
	current=section.getAttribute('id');
	}
    
  })
	navLi.forEach(li=>{
	li.classList.remove('active');
	if(li.classList.contains(current)){
		li.classList.add('active')
	}
	})
	
})
var ofs = 1, pag = 20;
var currentSize = 0;
var disp;

  function reset_to_first() {
	ofs=1, pag=20;
	update();
	caseTable.redraw();
	}



  function display() {
	disp = document.getElementsByClassName('filter-count')[0].innerHTML
	currentSize = parseFloat(disp.replace(',',''));
      d3.select('#begin')
          .text(ofs);
      d3.select('#end')
          .text(ofs+pag-1>=currentSize ? currentSize :ofs+pag-1);
      d3.select('#last')
          .attr('disabled', ofs-pag<0 ? 'true' : null);
      d3.select('#next')
          .attr('disabled', ofs+pag>=currentSize ? 'true' : null);
      d3.select('#reset_to_first')
          .attr('disabled', ofs-pag<0 ? 'true' : null);
      d3.select('#size').text(ndx.size());
  }
  function update() {
     caseTable.beginSlice(ofs-1);
      caseTable.endSlice(ofs+pag);
      display();
  }
  function next() {
      ofs += pag;
      update();
      caseTable.redraw();
  }
  function last() {
      ofs -= pag;
      update();
      caseTable.redraw();
	
  }

/*Filter table for chart1*/
var death_location= d3.select("#date-chart").on("click", function() {

filter_reset1()
    	
	
})

function filter_reset1(){

	disp = document.getElementsByClassName('filter-count')[0].innerHTML
	df= parseFloat(disp.replace(',',''));

	d3.select('#end').text(df<20 ? df :ofs+pag-1);
      	d3.select('#next')
          .attr('disabled', df<20 ? 'true' : null);
	
	
	ofs=1, pag=20;

	update();
	caseTable.redraw();
	d3.select('#begin').text(df>=1 ? 1:0);


}


/*Filter table for chart3*/

var death_date=dateChart3.on("filtered.monitor",function(dateChart3) { d3.select("#date-chart3").on("mouseup", function() {
	filter_reset2()
    })	
	
})

var death_location= d3.select("#location-chart").on("click", function() {

	filter_reset2()
    	
	
})

var death_location= d3.select("#location-chart").on("click", function() {

	filter_reset2()
    	
	
})

var death_comorbid= d3.select("#comob-chart").on("click", function() {

	filter_reset2()
    		
})

var death_ageGroup= d3.select("#group-chart").on("click", function() {

	filter_reset2()
    		
})

var death_gender= d3.select("#pie-chart3").on("click", function() {
	filter_reset2()
    		
})

function filter_reset2(){
	disp = document.getElementsByClassName('filter-count')[1].innerHTML
	df= parseFloat(disp.replace(',',''));

	d3.select('#end2').text(df<20 ? df :ofs2+pag2-1);
      	d3.select('#next2')
          .attr('disabled', df<20 ? 'true' : null);
	
	
	ofs2=1, pag2=20;

	update2();
	deathTable.redraw();
	d3.select('#begin2').text(df>=1 ? 1:0);
}



dateChart3.on("postRender",function(){
	disp = document.getElementsByClassName('filter-count')[1].innerHTML
	df= parseFloat(disp.replace(',',''));
	})
