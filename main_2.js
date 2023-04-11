import * as d3 from "d3"
// tool tip library import
// found another way as well
// need to test
import d3Tip from "d3-tip"

import "./style.css"

// the main async function to draw the chart
async function drawChart() {
    // preparation
    const dateParser = d3.timeParse("%Y-%m-%d")

    // access data
    let dataset = await d3.json("./data/my_weather_data.json")

    // tooltip init
    // const tip = d3Tip.tip().attr("class", "d3-tip").html(d => `Humidity: ${d.humidity}`)

    // console.log(tip)
    // bounds.call(tip)


    const yAccessor = (d) => d.humidity
    const xAccessor = (d) => dateParser(d.date)

    // sort the data based on days in the year from lower (earlier) to higher (later)
    dataset = dataset.sort((a, b) => xAccessor(a) - xAccessor(b))

    // console.log(dataset)
    // console.log("hello")

    let dimensions = {
        width: window.innerWidth * 0.9,
        height: 450,
        margin: {
            top: 50,
            right: 15,
            bottom: 50,
            left: 60
        },
    }

    // calculate the bounded width and height for the chart
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    // create an svg container for the chart with the specified width and height?
    // see how i did this with the ridge_line_plot.html
    const wrapper = d3
    .select("#viz")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

    // console.log(wrapper)


    const bounds = wrapper
    .append("g")
    .style("transform", `translate(${dimensions.margin.left}px ${dimensions.margin.top}px)`
    )

    // console.log(bounds)

    
    // create the yScale for the chart
    const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()
    

    // create the sScale for the chart
    const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

    // create the y axis generator for the grid marks on the y axis
    const yAxisGeneratorGridMarks   = d3
    .axisLeft(yScale)
    .ticks()
    .tickSize(-dimensions.boundedWidth)
    .tickFormat('')

    // append the y axis grid marks to the bounds
    const yAxisGridMarks = bounds
        .append('g')
        .attr('class', 'y-axis-grid-marks')
        .call(yAxisGeneratorGridMarks)


    // 5) Draw data
    // ==============================================
    
    //   
    const lineGenerator = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)))
        .curve(d3.curveBasis)

    // 
    const line = bounds
        .append('path')
        .attr('class', 'line')
        .style('stroke', 'blue')
        .style('fill', 'none')
        .attr('d', lineGenerator(dataset))
  

    // 6) Draw peripherals
    // ==============================================

    const yAxisGenerator = d3.axisLeft().scale(yScale).ticks()
    const yAxis = bounds
        .append('g')
        .attr('class', 'y-axis')
        .style('background-color', 'lightgrey')
        .call(yAxisGenerator)

    // 
    const yAxisLabel = yAxis
        .append('text')
        .attr('y', -dimensions.margin.left + 10)
        .attr('x', -dimensions.boundedHeight / 2)
        .attr('class', 'y-axis-label')
        .text('Average Humidity')

    
    // 
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = bounds
        .append('g')
        .attr('class', 'x-axis')
        .style('transform', `translateY(${dimensions.boundedHeight}px)`)
        .call(xAxisGenerator)

    // 
    const xAxisLabel = xAxis
        .append('text')
        .attr('x', dimensions.boundedWidth / 2)
        .attr('y', dimensions.margin.bottom - 10)
        .text('Seasons')
        .style('text-anchor', 'middle')

    // 
    const title = wrapper
        .append('text')
        .attr('x', dimensions.width / 2)
        .attr('y', dimensions.margin.top / 2)
        .text('Average Humidity by Season')
        .style('text-anchor', 'middle')
        .style('font-size', '1.5em')

}

drawChart();