require('../css/master.sass');

import React from 'react';
import ReactDOM from 'react-dom';

const target = document.getElementById('root');

let booted = false;

let cellStates = [];
let rowStates = [];

if (!booted) {
//if the page is just loading, generate a random state for all 2500 (50 rows, 50 columns) of cells
  let getRandomState = function(){
    if (Math.floor(Math.random() * (1 - 0 + 1)) + 0) {
      return true;
    }
    else {
      return false;
    }
  }
  for (let i = 0; i < 2500; i++) {
    cellStates.push({
      key: i,
      alive: (getRandomState())
    })
  }

booted = true;
};

let buildRows = () => {
 let rows = [];
 let rowIndex = 0
 for (let i = 0; i < 50; i++){

   let thisRow = []
   for (let j = 0; j < 50; j++){
     thisRow.push(cellStates[((rowIndex * 50) + j)]);
   }
   rows.push(<CellRow cells={thisRow} key={i}/>)
   rowIndex++;
 }
 rowStates = rows;
}

class Layout extends React.Component {
  render(){
    return(
      <div className="container">
        <Life />
      </div>
    )
  }
};

class Life extends React.Component {
  render(){
    return(
      <Grid />
    )
  }
};

class Grid extends React.Component {
  render(){
    return(
      <table>
        <CellMap />
      </table>
    )
  }
};

class CellMap extends React.Component {
  render(){
    buildRows();
    return(
      <tbody>
        {rowStates.map(row => row)}
      </tbody>
    )
  }
};
class CellRow extends React.Component {
  render(){
    return(
      <tr>{this.props.cells.map(cell => <Cell alive={cell.alive} key={cell.key} index={cell.key}/>)}</tr>
    )
  }
}
class Cell extends React.Component {
  render(){
    let handleClick = () => {
      cellStates[this.props.index].alive = (!cellStates[this.props.index].alive);
      update();
    }
    if (this.props.alive) {
      return (
        <th className="liveCell" onClick={() => handleClick()} onMouseUp={() => handleClick()}></th>
      )
    } else {
      return (
        <th className="deadCell" onClick={() => handleClick()} onMouseUp={() => handleClick()}></th>
      )
    };

  };
};

let lifeCycle = function(){

}

let update = function(){
  console.log("updated");
  ReactDOM.render(<Layout />, target);
};


update();
