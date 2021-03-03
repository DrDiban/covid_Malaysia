var dateChart = dc.barChart('#date-chart');
var caseDisplay = dc.numberDisplay('#case-chart');
var dischargeDisplay = dc.numberDisplay('#discharge-chart');
var deathDisplay = dc.numberDisplay('#death-chart');
var icuDisplay = dc.numberDisplay('#icu-chart');
var caseTable = dc.dataTable('#data-table');
var caseCount = dc.dataCount('.dc-data-count');
var dateChart2 = dc.barChart('#date-chart2');
var caseDisplay2 = dc.numberDisplay('#case-chart2');
var ndx;


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
		.width(500)
		.height(350)
		.margins({top: 20, right: 10, bottom: 40, left: 40})
		.dimension(dateDimension)
		.group(dateGroup)
		.x(d3.time.scale().domain([new Date(2021, 02, 1), new Date(2021, 03, 04)]))
		.xUnits(d3.time.days)
		.barPadding(0.0)
		.outerPadding(0.00)
		.centerBar(true)
		.elasticY(true)
		.ordinalColors(['#525252'])
			.xAxis().ticks(d3.time.months, 1)
				.tickFormat(d3.time.format("%b,%Y"));

	dateChart.yAxis().ticks(1)
	.tickFormat(d3.format('3s'));

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
		console.log(d.dd);
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
		.width(500)
		.height(350)
		.margins({top: 20, right: 10, bottom: 40, left: 40})
		.dimension(dateDimension)
		.group(dateGroup)
		.x(d3.time.scale().domain([new Date(2019, 12, 1), new Date(2021, 02, 28)]))
		.xUnits(d3.time.days)
		.barPadding(0.0)
		.outerPadding(0.00)
		.centerBar(true)
		.elasticY(true)
		.ordinalColors(['#525252'])
			.xAxis().ticks(d3.time.months, 1)
				.tickFormat(d3.time.format("%b,%Y"));

	dateChart.yAxis().ticks(5)
	.tickFormat(d3.format('3s'));

	

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
  console.log(pageYOffset);
  let current='';
  sections.forEach(section=>{
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if(pageYOffset>=(sectionTop-sectionHeight/7)){
	current=section.getAttribute('id');
	}
    
  })
	navLi.forEach(li=>{
	li.classList.remove('active');
	if(li.classList.contains(current)){
		li.classList.add('active')
	}
	})
	console.log(current);
})
var ofs = 1, pag = 20;
var currentSize = ndx.size();
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
          .text(ofs+pag-1);
      d3.select('#last')
          .attr('disabled', ofs-pag<0 ? 'true' : null);
      d3.select('#next')
          .attr('disabled', ofs+pag>=currentSize ? 'true' : null);
      d3.select('#reset_to_first')
          .attr('disabled', ofs-pag<0 ? 'true' : null);
      d3.select('#size').text(ndx.size());
  }
  function update() {
     caseTable.beginSlice(ofs);
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
      tweetTable.redraw();
	console.log('sectionTop');
  }



