var ItemSelect;
var filteredData;
var lineChart1,
    lineChart2,
    lineChart3,
    lineChart4,
    lineChart5,
    lineChart6;

// Event listeners
$("#var-select").on("change", onSelectChange)

function onSelectChange() {
    getInput();
    updateData();
    updateCharts();
}

// Add jQuery UI slider
$("#date-slider").slider({
    range: true,
    max: 1,
    min: 0,
    step: 0.001,
    values: [0,1],
    slide: function(event, ui){
        $("#dateLabel1").text(ui.values[0]);
        $("#dateLabel2").text(ui.values[1]);
        updateCharts();
    }
});

d3.select("#download").on('click', function(){
    saveSvgAsPng(document.getElementsByTagName("svg")[0], "plot1.png", {scale: 2, backgroundColor: "#151d1e"})
    });

function getInput(){
    if (typeof ItemSelect == 'undefined'){
        ItemSelect = 'Into the Wild';
        console.log(ItemSelect);
        return ItemSelect;
    } else {
    console.log(ItemSelect);
    return ItemSelect;
    }
}

function updateData(){
    d3.json('https://storyplotsapp.herokuapp.com/api', {
        method:"POST",
        body: JSON.stringify({
        movie_title: ItemSelect
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(function(data){
            console.log(data);
        // // Prepare and clean data
        filteredData = {};
        for (var movie in data) {   
            if (!data.hasOwnProperty(movie)) {
                continue;
            }
            filteredData[movie] = data[movie];
            filteredData[movie].forEach(function(d){
                d["score"] = +d["score"];
                d["percent"] = +d["percent"];
                d["cluster3"] = +d["cluster3"];
            });
            console.log(filteredData);
        }
        d3.selectAll("svg").remove();

        indexSearch = d3.keys(data).indexOf(ItemSelect);
        var indexes = [0,1,2,3,4,5]
        new_array = indexes.filter(function checkIndex(index) {
            return index !== indexSearch;
        });
        console.log(new_array);

        lineChart1 = new LineChart("#chart-area1", d3.keys(data)[indexSearch]);
        lineChart2 = new LineChart("#chart-area2", d3.keys(data)[new_array[0]]);
        lineChart3 = new LineChart("#chart-area3", d3.keys(data)[new_array[1]]);
        lineChart4 = new LineChart("#chart-area4", d3.keys(data)[new_array[2]]);
        lineChart5 = new LineChart("#chart-area5", d3.keys(data)[new_array[3]]);
        lineChart6 = new LineChart("#chart-area6", d3.keys(data)[new_array[4]]);
    })
}

getInput();
updateData();

function updateCharts(){
    lineChart1.wrangleData()
    lineChart2.wrangleData()
    lineChart3.wrangleData()
    lineChart4.wrangleData()
    lineChart5.wrangleData()
    lineChart6.wrangleData()
}