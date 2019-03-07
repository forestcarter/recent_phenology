import React from "react";

function Alist(props) {
  return (
    <div>
      <div
        className="legendColorBox"
        style={{ backgroundColor: props.color }}
      />
      <p className="legendp">{props.range}</p>
    </div>
  );
}

function Legend(props) {
  const listItems = colorsarray.map(soil => (
    <Alist
      key={soil.range + "both"}
      color={soil.color}
      range={soil.range}
    />
  ));

  return (
    <ul id='legendul'>
      {listItems}
    </ul>
  );
}

export default Legend;
