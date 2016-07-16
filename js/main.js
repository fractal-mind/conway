import React from 'react';
import ReactDOM from 'react-dom';

console.log("loaded");

const target = document.getElementById('root');

class Layout extends React.Component {
  render(){
    return(
      <h1>Hello World</h1>
    )
  }
};

ReactDOM.render(<Layout />, target);
