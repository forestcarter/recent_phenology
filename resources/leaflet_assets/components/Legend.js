import React from "react";

function Alist(props) {
  return (
    <div>
      <div
        className="legendColorBox"
        style={{ backgroundColor: props.color }}
      />
      <p className="legendp">{props.descripcio}</p>
    </div>
  );
}

function Blist(props) {
  return (
    <div>
      <img
        src={"/img/"+props.descripcio+'.png'}
        id = {props.descripcio}
      />
      <p className="legendp">{props.descripcio}</p>
    </div>
  );
}

function Legend(props) {

  const listItems = props.soils.map(soil => (
    <Alist
      key={soil.descripcio + "both"}
      color={soil.color}
      descripcio={soil.descripcio}
    />
  ));

  const finalItems = ["MANANTIAL","CORRIENTE_DE_AGUA"].map(name => (
    <Blist
      key={name}
      descripcio={name}
    />
  ));

  return ( <ul>
    {listItems}
    {finalItems}
  </ul>
  )
}

export default Legend;
