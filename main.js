import * as d3 from 'd3';

import './style.css';

async function drawChart () {
  // 0) Preparation
  // ==============================================
  const dateParser = d3.timeParse('%Y-%m-%d');


  // 1) Access data
  // ==============================================
  let dataset = await d3.json('./data/my_weather_data.json');

  const yAccessor = (d) => d.humidity;
  const xAccessor = (d) => dateParser(d.date);

  // Sort the data based on days in the year from lower (earlier) to higher (later)
  dataset = dataset.sort((a, b) => xAccessor(a) - xAccessor(b));


  // 2. Create chart dimensions
  // ==============================================
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  
  // 3) Draw canvas
  // ==============================================

  const wrapper = d3
    .select('#viz')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );


  // 4) Create scales
  // ==============================================

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  // Grid marks for y axis
  const yAxisGeneratorGridMarks = d3
    .axisLeft(yScale)
    .ticks()
    .tickSize(-dimensions.boundedWidth)
    .tickFormat('');

  const yAxisGridMarks = bounds
    .append('g')
    .attr('class', 'y-axis-grid-marks')
    .call(yAxisGeneratorGridMarks);


  // 5) Draw data
  // ==============================================

  const lineGenerator = d3
    .area()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))
    .curve(d3.curveBasis);

  const line = bounds
    .append('path')
    .attr('class', 'line')
    .attr('d', lineGenerator(dataset));
  

  // 6) Draw peripherals
  // ==============================================

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks();
  const yAxis = bounds.append('g').attr('class', 'y-axis').call(yAxisGenerator);
  const yAxisLabel = yAxis
    .append('text')
    .attr('y', -dimensions.margin.left + 10)
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('class', 'y-axis-label')
    .text('Average Humidity');

  const xAxisGenerator = d3.axisBottom().scale(xScale).ticks();
  const xAxis = bounds
    .append('g')
    .attr('class', 'x-axis')
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)
    .call(xAxisGenerator);
}

drawChart();
