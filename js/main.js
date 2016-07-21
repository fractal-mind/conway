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
      alive: (getRandomState()),
      score: null
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

let scoreSet = false;

let evaluate = () => {
  if (scoreSet === true) {
    for (let i = 0; i < cellStates.length; i++) {
      if (cellStates[i].alive === true) {

        if((cellStates[i].score < 2)){
          cellStates[i].alive = false;
        }
        if((cellStates[i].score > 3)){
          cellStates[i].alive = false;
        }
        if((cellStates[i].score === 2)){
          cellStates[i].alive = true;
        }
        if((cellStates[i].score === 3)){
          cellStates[i].alive = true;
        }
      };
      if (cellStates[i].alive === false){

        if (cellStates[i].score === 3) {
          cellStates[i].alive = true;
        };
      };
      cellStates[i].score = null;
    }
    scoreSet = false;
  };
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
        <Footer />
      </div>
    )
  }
};
let intervalId;
let firstPlay = false;



class Life extends React.Component {
  constructor(props, context){
    super(props, context);
    this.playModeOff = this.playModeOff.bind(this);
    this.playModeOn = this.playModeOn.bind(this);
    this.state = {
      playMode: true
    }
  }
  playModeOff(){
    clearInterval(intervalId);
    this.setState({playMode: false});
    console.log("Play Mode: " + this.state.playMode);
    update();
  };
  playModeOn(){
    intervalId = setInterval(lifeCycle, 100);
    this.setState({playMode: true});
    console.log("Play Mode: " + this.state.playMode);
    update();
  };


  render(){
    if (!firstPlay) {
      intervalId = setInterval(lifeCycle, 100);
      firstPlay = true;
    }
    return(
      <div>
        <Grid />
        <Buttons playModeOn={this.playModeOn} playModeOff={this.playModeOff} playMode={this.state.playMode} />
        <p className="generationCounter">{generations}</p>
      </div>
    )
  }
};




class Buttons extends React.Component {
  render(){
    if (this.props.playMode){
      return(
        <div>
          <PauseButton pause={this.props.playModeOff} playMode={this.props.playMode}/>

          <ClearButton />
        </div>
      )
    } else {
      return(
        <div>

          <PlayButton play={this.props.playModeOn} playMode={this.props.playMode}/>
          <ClearButton />
        </div>
      )
    }

  }
};

class PauseButton extends React.Component {
  render(){

    return(
      <i className="controlButton material-icons" onClick={this.props.pause}>pause_circle_filled</i>
    )
  }
};

class PlayButton extends React.Component {
  render(){

    return(
      <i className="controlButton material-icons" onClick={this.props.play}>play_circle_filled</i>
    )
  }
};

class ClearButton extends React.Component {
  handleClick(){
    for (let i = 0; i < cellStates.length; i++) {
      cellStates[i].alive = false;
    }
    update();
  };
  render(){
    return(

      <i className="clearButton material-icons" onClick={this.handleClick}>clear</i>
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
    evaluate();
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

class Footer extends React.Component {
  render(){
    return(
      <div>
          <a href="//stillwill.net" className="attribution">© 2016 Will Moody</a>
          <a href="//github.com/fractal-mind/conway" className="source">View Source on Github</a>
      </div>
    )
  }
}

let generations = 0;
//here is where the rules of the game are defined. this function is called according to handlePlay on Buttons
let lifeCycle = () => {
  for(let i = 0; i < cellStates.length; i++){
    let count = 0;
      //NW
      if ((cellStates[i - 26]) && (cellStates[i - 26].alive === true)) { count++; }
      //N
      if ((cellStates[i - 25]) && (cellStates[i - 25].alive === true)) { count++; }
      //NE
      if ((cellStates[i - 24]) && (cellStates[i - 24].alive === true)) { count++; }

      //SW
      if ((cellStates[i + 24]) && (cellStates[i + 24].alive === true)) { count++; }
      //S
      if ((cellStates[i + 25]) && (cellStates[i + 25].alive === true)) { count++; }
      //SE
      if ((cellStates[i + 26]) && (cellStates[i + 26].alive === true)) { count++; };

      if ((i % 25) !== 0){
        //W
        if ((cellStates[i - 1]) && (cellStates[i - 1].alive === true)) { count++; }
      }
      if (((i + 1) % 25) !== 0){
        //E
        if ((cellStates[i + 1]) && (cellStates[i + 1].alive === true)) { count++; }
      }
      cellStates[i].score = count;
      scoreSet = true;
          /**if (cellStates[i].alive === true) {

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
              console.log(cellStates[i].alive);
              console.log("Cell " + i + " is born with " + count + " neightbors y'all");
              console.log(cellStates[i].alive);
              cellCache[i].alive = true;
              console.log(cellCache[i].alive);
              console.log(cellStates[i].alive);
            };
          };**/


  }
  generations++;
  update();
}

let update = function(){

  ReactDOM.render(<Layout />, target);
};


update();
