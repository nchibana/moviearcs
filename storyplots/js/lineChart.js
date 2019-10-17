/*
*    main.js
*    Mastering Data Visualization with D3.js
*    10.4 - Converting our code to OOP
*/

var arr;

LineChart = function(_parentElement, _movie){
    this.parentElement = _parentElement;
    this.movie = _movie

    this.initVis();
};

function replace(new_str) {
    for (var key in arr) {
        if (!arr.hasOwnProperty(key)) {
            continue;
        }
        new_str = new_str.replace(arr[key], key);
    }
    return new_str
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0, //<-- 0!
        lineHeight = 1.2, // ems
        x = text.attr("x"), //<-- include the x!
        y = text.attr("y"),
        dy = text.attr("dy") ? text.attr("dy") : 0; //<-- null check
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

LineChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { left:50, right:20, top:50, bottom:50 };
    vis.height = 280 - vis.margin.top - vis.margin.bottom;
    vis.width = 300 - vis.margin.left - vis.margin.right;

    vis.svg = d3.select(vis.parentElement)
        .append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);
    vis.g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + 
            ", " + vis.margin.top + ")");

    vis.colorRange = ['#a3079c', '#b50c7f', '#aa1166', '#c11163', '#d81745', '#cd1357', '#aa125e', '#b30e71', '#af0a89', '#a5079b', '#9b05a7']

    vis.color = d3.scaleLinear().range(vis.colorRange).domain([1, 2, 3, 4, 5, 6 ,7, 8, 9, 10, 11]);
    
    vis.linearGradient = vis.svg.append("defs")
        .append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("gradientTransform", "rotate(0)");

    vis.linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", vis.color(1));
    
    vis.linearGradient.append("stop")
        .attr("offset", "10%")
        .attr("stop-color", vis.color(2));

    vis.linearGradient.append("stop")
        .attr("offset", "20%")
        .attr("stop-color", vis.color(3));

    vis.linearGradient.append("stop")
        .attr("offset", "30%")
        .attr("stop-color", vis.color(4));

    vis.linearGradient.append("stop")
        .attr("offset", "40%")
        .attr("stop-color", vis.color(5));

    vis.linearGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", vis.color(6));

        vis.linearGradient.append("stop")
        .attr("offset", "60%")
        .attr("stop-color", vis.color(7));
    
    vis.linearGradient.append("stop")
        .attr("offset", "70%")
        .attr("stop-color", vis.color(8));

    vis.linearGradient.append("stop")
        .attr("offset", "80%")
        .attr("stop-color", vis.color(9));

    vis.linearGradient.append("stop")
        .attr("offset", "90%")
        .attr("stop-color", vis.color(10));

    vis.linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", vis.color(11));

    vis.t = function() { return d3.transition().duration(1000); }

    vis.bisectscale = d3.bisector(function(d) { return d.percent; }).left;

    vis.linePath = vis.g.append("path")
        .attr("class", "line")
        .attr("stroke", "url(#linear-gradient)")
        .attr("stroke-width", "1")
        .attr("fill", "none");
        
    vis.g.append("text")
        .attr("class", "movie-label")
        .attr("x", vis.width/2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-family", "azo-sans-web, sans-serif")
        .style('fill', '#fff')
        .text(replace(vis.movie))
        .call(wrap, vis.width-5);
    
    vis.g.append("text")
        .attr("class", "x axis-label")
        .attr("x", vis.width/2)
        .attr("y", vis.height + 40)
        .attr("text-anchor", "middle")
        .attr("font-family", "azo-sans-web, sans-serif")
        .style('fill', '#666')
        .attr("font-size", "11px")
        .text("Percent of Script");
    
    // // Y Label
    vis.g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (vis.height / 2))
        .attr("y", -40)
        .attr("font-family", "azo-sans-web, sans-serif")
        .style('fill', '#666')
        .attr("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Arousal Score");

    vis.x = d3.scaleLinear().range([0, vis.width]);
    vis.y = d3.scaleLinear().range([vis.height, 0]);

    vis.yAxisCall = d3.axisLeft()
        .ticks(5);
    vis.xAxisCall = d3.axisBottom()
        .ticks(4);
    vis.xAxis = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + vis.height +")");
    vis.yAxis = vis.g.append("g")
        .attr("class", "y axis");

    vis.wrangleData();
};


LineChart.prototype.wrangleData = function(){
    var vis = this;

    vis.yVariable = "score";

    // Filter data based on selections
    vis.sliderValues = $("#date-slider").slider("values")
    vis.dataFiltered = filteredData[vis.movie].filter(function(d) {
        return ((d.percent >= vis.sliderValues[0]) && (d.percent <= vis.sliderValues[1]))
    })

    vis.updateVis();
};


LineChart.prototype.updateVis = function(){
    var vis = this;

    // Update scales
    vis.x.domain(d3.extent(vis.dataFiltered, function(d) { return d.percent; }));
    vis.y.domain([d3.min(vis.dataFiltered, function(d) { return d[vis.yVariable]; }) / 1.005, 
        d3.max(vis.dataFiltered, function(d) { return d[vis.yVariable]; }) * 1.005]);

    // Update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t()).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis.transition(vis.t()).call(vis.yAxisCall);

    // Discard old tooltip elements
    d3.select(".focus."+vis.movie).remove();
    d3.select(".overlay."+vis.movie).remove();

    var focus = vis.g.append("g")
        .attr("class", "focus " + vis.movie)
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", vis.height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", vis.width);

    focus.append("circle")
        .attr("r", 3);

    focus.append("text")
        .attr("x", 15)
        .style('fill', '#fff')
        .style('font-size', '0.9em')
        .attr("dy", ".31em");

    vis.svg.append("rect")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
        .attr("class", "overlay " + vis.movie)
        .attr("width", vis.width)
        .attr("height", vis.height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = vis.x.invert(d3.mouse(this)[0]),
            i = vis.bisectscale(vis.dataFiltered, x0, 1),
            d0 = vis.dataFiltered[i - 1],
            d1 = vis.dataFiltered[i],
            d = (d1 && d0) ? (x0 - d0.percent > d1.percent - x0 ? d1 : d0) : 0;
        focus.attr("transform", "translate(" + vis.x(d.percent) + "," + vis.y(d[vis.yVariable]) + ")");
        focus.select("text").text(function() { return d3.format(".2f")(d[vis.yVariable].toFixed(2)); });
        focus.select(".x-hover-line").attr("y2", vis.height - vis.y(d[vis.yVariable]));
        focus.select(".y-hover-line").attr("x2", -vis.x(d.percent));
    }


    if (vis.linePath.node().getTotalLength() == 0) {
        var line = d3.line()
            .x(function(d) { return vis.x(d.percent); })
            .y(function(d) { return vis.y(d[vis.yVariable]); });

        vis.g.select(".line").merge(vis.linePath)
            .attr("d", line(vis.dataFiltered))
            .attr("stroke", "url(#linear-gradient)")
            .attr("stroke-width", "1")
            .attr("fill", "none");

        var totalLength = vis.linePath.node().getTotalLength();

        vis.linePath
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
                .duration(2000)
                .ease(d3.easeCubic)
                .attr("stroke-dashoffset", 0);
    } else {
        var line = d3.line()
            .x(function(d) { return vis.x(d.percent); })
            .y(function(d) { return vis.y(d[vis.yVariable]); });

        vis.g.select(".line").merge(vis.linePath)
            .attr("d", line(vis.dataFiltered))
            .attr("stroke", "url(#linear-gradient)")
            .attr("stroke-width", "1")
            .attr("fill", "none");
    }
};
