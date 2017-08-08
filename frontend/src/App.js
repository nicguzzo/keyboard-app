import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var conf={};
var layer=1;

var socket = new WebSocket("ws://127.0.0.1:3333","rust-websocket");

socket.onmessage = function (event) {
  console.log(event.data);
  conf=event.data;
  if(event.data=="Hello"){
    socket.send("get_conf"); 
  }
};
socket.onopen = function (event) {
  //this.socket.send("get_conf"); 
};

class Key extends Component {
  render() {
    let k=null;
    if(conf["layers"]){
      k=conf["layers"][layer]["left"][parseInt(this.props.num)]
    }
    return (
      <div className="key">
        key {this.props.num} <br/>
        {k}
      </div>
    );
  }
}

class Keys extends Component {
  render() {
    return (
      <div className="keys">
        <ul id="left_keys">
          <li><Key num="0"/><Key num="1"/><Key num="2"/><Key num="3"/><Key num="4"/><Key num="5"/></li>
          <li><Key num="6"/><Key num="7"/><Key num="8"/><Key num="9"/><Key num="10"/><Key num="12"/></li>
          <li><Key num="13"/><Key num="14"/><Key num="15"/><Key num="16"/><Key num="17"/><Key num="18"/></li>
          <li><Key num="19"/><Key num="20"/><Key num="21"/><Key num="22"/><Key num="23"/><b className="separador"/><Key num="24"/></li>
          <li><Key num="25"/><Key num="26"/><Key num="27"/><Key num="28"/><Key num="29"/><b className="separador"/><Key num="30"/></li>
        </ul>
        <b className="separador"/>
        <ul id="right_keys">
          <li><b className="separador"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/></li>
          <li><b className="separador"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/></li>
          <li><b className="separador"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/></li>
          <li><Key number="0"/><b className="separador"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/></li>
          <li><Key number="0"/><b className="separador"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/><Key number="0"/></li>
        </ul>
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    
    var input = document.getElementById("message");
    socket.send(input.value);
    input.value = "";
    event.preventDefault();
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">          
          <h2>Keyboard Configuration</h2>
        </div>
        <p id="received">
          <strong>Received Messages:</strong>
        </p>
        <form onSubmit={this.handleSubmit} >
          <input type="text" id="message"/>
          <input type="submit" value="Send"/>
        </form>
        <Keys/>
      </div>
    );
  }
}

export default App;
