const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600);

// margin for graph
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// enter and join data to create rectangles
d3.json('menu.json').then((data) => {
  const barY = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.orders)])
    .range([0, 500]);

  const barX = d3
    .scaleBand()
    .domain(data.map((item) => item.name))
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  const rects = graph.selectAll('rect').data(data);

  rects
    .attr('width', barX.bandwidth)
    .attr('height', (d) => barY(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d) => barX(d.name));

  rects
    .enter()
    .append('rect')
    .attr('width', barX.bandwidth)
    .attr('height', (d) => barY(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d) => barX(d.name));
});
