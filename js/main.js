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
  for (let i = 0; i < 625; i++) {
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
 for (let i = 0; i < 25; i++){

   let thisRow = []
   for (let j = 0; j < 25; j++){
     thisRow.push(cellStates[((rowIndex * 25) + j)]);
   }
   rows.push(<CellRow cells={thisRow} key={i}/>)
   rowIndex++;
 }
 rowStates = rows;
}

class Layout extends React.Component {
  render(){
    let handleMouseDown = () => {
      mouseIsDown = true;
    }

    let handleMouseUp = () => {
      mouseIsDown = false;
    }
    return(
      <div className="container"  onMouseDown={() => handleMouseDown()} onMouseUp={() => handleMouseUp()}>
        <Life />
      </div>
    )
  }
};

class Life extends React.Component {
  render(){
    return(
      <div>
        <Grid />
        <Buttons />
      </div>
    )
  }
};

let intervalId;

class Buttons extends React.Component {
  render(){


    let handlePause = () => {
      console.log(intervalId)
      clearInterval(intervalId);
    }
    let handlePlay= () => {
      intervalId = setInterval(lifeCycle, 500);
      //determines play speed
    }

    return(
      <div>
        <PauseButton pause={() => handlePause(intervalId)}/>
        <PlayButton play={() => handlePlay(intervalId)}/>
        <ClearButton />
      </div>
    )
  }
};

class PauseButton extends React.Component {
  render(){

    return(
      <button onClick={this.props.pause}>Pause</button>
    )
  }
};

class PlayButton extends React.Component {
  render(){

    return(
      <button onClick={this.props.play}>Play</button>
    )
  }
};

class ClearButton extends React.Component {
  render(){
    let handleClick = () => {
      for (let i = 0; i < cellStates.length; i++) {
        cellStates[i].alive = false;
      }
      update();
    }
    return(
      <button onClick={() => handleClick()}>Clear</button>
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


let mouseIsDown = false;

class Cell extends React.Component {
  render(){


    let handleMouseDown = () => {
      console.log(this.props.index);
      mouseIsDown = true;
      cellStates[this.props.index].alive = (!cellStates[this.props.index].alive);
      update();
    }

    let handleMouseOver = () => {
      if (mouseIsDown) {
        cellStates[this.props.index].alive = (!cellStates[this.props.index].alive);
      }
      update();
    }

    let handleMouseUp = () => {
      mouseIsDown = false;
    }

    if (this.props.alive) {
      return (
        <th className="liveCell" onMouseDown={() => handleMouseDown()} onMouseOver={() => handleMouseOver()} onMouseUp={() => handleMouseUp()}></th>
      )
    } else {
      return (
        <th className="deadCell" onMouseDown={() => handleMouseDown()} onMouseOver={() => handleMouseOver()} onMouseUp={() => handleMouseUp()}></th>
      )
    };

  };
};


//here is where the rules of the game are defined. this function is called according to handlePlay on Buttons
let lifeCycle = () => {
  let cellCache = cellStates;
  for(let i = 0; i < cellCache.length; i++){
    let count = 0;
    console.log("running")
      //NW
      if ((cellStates[i - 26]) && (cellStates[i - 26].alive === true)) { count++; console.log("Tally one score for " + i + " because " + (i - 26))}
      //N
      if ((cellStates[i - 25]) && (cellStates[i - 25].alive === true)) { count++; console.log("Tally one score for " + i + " because " + (i - 25))}
      //NE
      if ((cellStates[i - 24]) && (cellStates[i - 24].alive === true)) { count++; console.log("Tally one score for " + i + " because " + (i - 24))}

      //SW
      if ((cellStates[i + 24]) && (cellStates[i + 24].alive === true)) { count++; console.log("Tally one score for " + i + " because " + (i + 24))}
      //S
      if ((cellStates[i + 25]) && (cellStates[i + 25].alive === true)) { count++; console.log("Tally one score for " + i + " because " + (i + 25))}
      //SE
      if ((cellStates[i + 26]) && (cellStates[i + 26].alive === true)) { count++; console.log("Tally one score for " + i + " because " + (i + 26))};

      if ((i % 25) !== 0){
        //W
        if ((cellStates[i - 1]) && (cellStates[i - 1].alive === true)) { count++; console.log("Tally one score for " + i + " because " + (i - 1))}
      }
      if (((i + 1) % 25) !== 0){
        //E
        if ((cellStates[i + 1]) && (cellStates[i + 1].alive === true)) { count++; console.log("Tally one score for " + i + " because " + (i + 1))}
      }

          if (cellStates[i].alive === true) {

            if((count < 2)){
              console.log("Cell " + i + " dies with " + count + " neightbors");
              cellCache[i].alive = false;
            }
            if((count > 3)){
              console.log("Cell " + i + " dies with " + count + " neightbors");
              cellCache[i].alive = false;
            }
            if((count === 2)){
              console.log("Cell " + i + " lives with " + count + " neightbors");
              cellCache[i].alive = true;
            }
            if((count === 3)){
              console.log("Cell " + i + " lives with " + count + " neightbors");
              cellCache[i].alive = true;
            }
          };
          if (cellStates[i].alive === false){

            if (count === 3) {
              console.log("Cell " + i + " is born with " + count + " neightbors y'all");
              cellCache[i].alive = true;
            };
          };


  }
  cellStates = cellCache;
  update();
}


let update = function(){
  ReactDOM.render(<Layout />, target);
};


update();
