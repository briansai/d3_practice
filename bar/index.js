const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600);

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

  const rects = svg.selectAll('rect').data(data);

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
