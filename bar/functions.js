const transition500 = d3.transition().duration(1000);

const widthTween = (d) => {
  let i = d3.interpolate(0, xBar.bandwidth());

  return function (t) {
    return i(t);
  };
};
