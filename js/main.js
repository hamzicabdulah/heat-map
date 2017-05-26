d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', draw);

function draw(data) {
  const docWidth = document.documentElement.clientWidth;
  const width = (docWidth <= 768) ? docWidth * 0.93 : docWidth * 0.87;
  const height = 580, margin = 40;

  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const baseTemp = data.baseTemperature, dataset = data.monthlyVariance;

  const yearExtent = d3.extent(dataset, (d) => d.year);
  const monthExtent = d3.extent(dataset, (d) => d.month);

  const yearScale = d3.scaleTime()
    .domain([new Date(yearExtent[0], 0), new Date(yearExtent[1], 0)])
    .range([margin * 1.8, width]);

  const monthScale = d3.scaleTime()
    .domain([new Date(2015, monthExtent[1] - 1), new Date(2015, monthExtent[0] - 1)])
    .range([height - margin * 2, margin - 20]);

  const yearAxis = d3.axisBottom(yearScale)
    .tickFormat(d3.timeFormat('%Y'))
    .ticks(d3.timeYear, (docWidth <= 1000) ? 30 : 10);

  const monthAxis = d3.axisLeft(monthScale)
    .tickFormat(d3.timeFormat('%B'));

  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, ' + (height - margin / 1.13) + ')')
    .call(yearAxis);

  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(' + margin * 1.8 + ', 0)')
    .call(monthAxis)
    .selectAll('.tick text')
    .attr('y', (height - margin * 2)/12/2);

  const colorKey = [
    ['12.7', '#660000'],
    ['11.6', '#cc0000'],
    ['10.5', '#cc5200'],
    ['9.4', '#ffb31a'],
    ['8.3', '#ffd480'],
    ['7.2', '#ffff99'],
    ['6.1', '#ffff4d'],
    ['5', '#66ff99'],
    ['3.9', '#00cc99'],
    ['2.7', '#006666'],
    ['0', '#003366']
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const tip = d3.tip()
    .attr('class', 'tip')
    .offset([5, 0])
    .html((d) => '<h3>' + d.year + ' - ' + months[new Date(2017, d.month).getMonth() - 1]
    + '</h3><h4>' + (baseTemp + d.variance).toFixed(2) + ' ℃'
    + '</h4><p>' + d.variance.toFixed(2) + ' ℃' + '</p>');

  svg.call(tip);

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('width', width / (dataset.length / 12))
    .attr('height', (height - (margin - 15) * 1.8)/12)
    .attr('x', (d) => yearScale(new Date(d.year, 0)))
    .attr('y', (d) => monthScale(new Date(2015, (d.month - 1))))
    .attr('fill', function(d) {
      for (var i = 0; i < colorKey.length; i++) {
        if ((baseTemp + d.variance) >= +colorKey[i][0]) {
          return colorKey[i][1];
        }
      }
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

  d3.select('.legend')
    .selectAll('div')
    .data(colorKey)
    .enter()
    .append('div')
    .attr('class', 'legend-div')
    .append('div')
    .style('background', (d) => d[1]);

  d3.select('.legend')
    .data(colorKey)
    .selectAll('.legend-div')
    .append('p')
    .text((d) => d[0]);

  d3.select('body')
    .append('div')
    .attr('class', 'footer')
    .html('Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average. Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07.');

  window.onresize = function(event) {
    clearScreen();
    draw(data);
  }
}

function clearScreen() {
  d3.select('svg').remove();
  d3.select('.legend').selectAll('div').remove();
  d3.select('.footer').remove();
}
