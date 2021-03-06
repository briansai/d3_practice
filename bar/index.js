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

// group x-axis and y-axis
const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// scales
const yBar = d3.scaleLinear().range([graphHeight, 0]);
const xBar = d3.scaleBand().range([0, 500]).paddingInner(0.2).paddingOuter(0.2);

// create the axes
const xAxis = d3.axisBottom(xBar);
const yAxis = d3
  .axisLeft(yBar)
  .ticks(3)
  .tickFormat((d) => `${d} orders`);

xAxisGroup
  .selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'orange');

// update function
const update = (data) => {
  yBar.domain([0, d3.max(data, (d) => d.orders)]);
  xBar.domain(data.map((item) => item.name));

  // join data to rects
  const rects = graph.selectAll('rect').data(data);

  // remove exit selection
  rects.exit().remove();

  // update current shapes
  rects
    .attr('width', xBar.bandwidth)
    .attr('fill', 'orange')
    .attr('x', (d) => xBar(d.name));

  rects
    .enter()
    .append('rect')
    .attr('width', xBar.bandwidth)
    .attr('height', 0)
    .attr('fill', 'orange')
    .attr('x', (d) => xBar(d.name))
    .attr('y', graphHeight)
    .merge(rects)
    .transition(transition500)
    .attrTween('width', widthTween)
    .attr('y', (d) => yBar(d.orders))
    .attr('height', (d) => graphHeight - yBar(d.orders));

  // call axes
  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
};

const data = [];

db.collection('dishes').onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex((item) => item.id === doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});
