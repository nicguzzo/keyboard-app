import React, { Component } from 'react';
import './App.css';

class Key extends Component {
  render() {    
    return (
      <div className="key">        
        {this.props.k}
      </div>
    );
  }
}

class Keys extends Component {

  get_l(n){
    let k=null;    
    
    if(this.props.conf.layers)
    {
      k=this.props.conf.layers[this.props.layer].left[parseInt(n)]
    }
    return k;
  }
  get_r(n){
    let k=null;    
    
    if(this.props.conf["layers"])
    {
      k=this.props.conf.layers[this.props.layer].right[parseInt(n)]
    }
    return k;
  }

  render() {
    return (
      <div className="keys">
        <ul id="left_keys">
          <li><Key k={this.get_l(0 )}/><Key k={this.get_l(1 )}/><Key k={this.get_l(2 )}/><Key k={this.get_l(3 )}/><Key k={this.get_l(4 )}/><Key k={this.get_l(5 )}/></li>
          <li><Key k={this.get_l(6 )}/><Key k={this.get_l(7 )}/><Key k={this.get_l(8 )}/><Key k={this.get_l(9 )}/><Key k={this.get_l(10)}/><Key k={this.get_l(11)}/></li>
          <li><Key k={this.get_l(12)}/><Key k={this.get_l(13)}/><Key k={this.get_l(14)}/><Key k={this.get_l(15)}/><Key k={this.get_l(16)}/><Key k={this.get_l(17)}/></li>
          <li><Key k={this.get_l(18)}/><Key k={this.get_l(19)}/><Key k={this.get_l(20)}/><Key k={this.get_l(21)}/><Key k={this.get_l(22)}/><b className="separador"/><Key k={this.get_l(23)}/></li>
          <li><Key k={this.get_l(24)}/><Key k={this.get_l(25)}/><Key k={this.get_l(26)}/><Key k={this.get_l(27)}/><Key k={this.get_l(28)}/><b className="separador"/><Key k={this.get_l(29)}/></li>
        </ul>
        <b className="separador"/>
        <ul id="right_keys">
          <li><b className="separador"/><Key k={this.get_r(0 )}/><Key k={this.get_r(1 )}/><Key k={this.get_r(2 )}/><Key k={this.get_r(3 )}/><Key k={this.get_r(4 )}/><Key k={this.get_r(5 )}/></li>
          <li><b className="separador"/><Key k={this.get_r(6 )}/><Key k={this.get_r(7 )}/><Key k={this.get_r(8 )}/><Key k={this.get_r(9 )}/><Key k={this.get_r(10)}/><Key k={this.get_r(11)}/></li>
          <li><b className="separador"/><Key k={this.get_r(12)}/><Key k={this.get_r(13)}/><Key k={this.get_r(14)}/><Key k={this.get_r(15)}/><Key k={this.get_r(16)}/><Key k={this.get_r(17)}/></li>
          <li><Key k={this.get_r(18)}/><b className="separador"/><Key k={this.get_r(19)}/><Key k={this.get_r(20)}/><Key k={this.get_r(21)}/><Key k={this.get_r(22)}/><Key k={this.get_r(23)}/></li>
          <li><Key k={this.get_r(24)}/><b className="separador"/><Key k={this.get_r(25)}/><Key k={this.get_r(26)}/><Key k={this.get_r(27)}/><Key k={this.get_r(28)}/><Key k={this.get_r(29)}/></li>          
        </ul>
      </div>
    );
  }
}

function get_scancodes(){
  
}

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.sendKeys = this.sendKeys.bind(this);
    this.state={
      conf:{},
      layer:1
    }
    this.socket = new WebSocket("ws://127.0.0.1:3333","rust-websocket");
    this.socket.onmessage = function (event) {      
      this.handleData(event.data);
    }.bind(this);        
    fetch('scancodes.json')  
      .then(response => response.json())
      .then(json => {
          this.scancodes=json
      })
      .catch((error) => {
        console.error(`err: ${error}`);
      });
    
  }
  handleData(data){    
    //console.log(data);
    var dat=JSON.parse(data);
    if(dat["opcode"]==="hello"){
      this.socket.send("get_conf"); 
    }
    if(dat["opcode"]==="conf"){
      this.setState({conf: dat["payload"],layer:1})
    }
  }
  handleSubmit(event) {
    var input = document.getElementById("message");
    this.socket.send(input.value);
    input.value = "";
    event.preventDefault();
  }
  sendKeys(layer,side){    
    this.state.conf.layers[1][side].map( (key, i) => {
      const n =`0${i}`.slice(-2);
      //console.log(this.scancodes);
      let t='c';
      let k=null;
      if(this.scancodes.modifiers.indexOf(key)>=0){
        t='m';
        k=key;
      }else{
        k=this.scancodes.codes[key];
      }
      if(k){
        const cmd = `${side.slice(0,1)}${layer}${n}${t}${k}`;
        this.socket.send(cmd);       
        console.log(cmd);
      }
      //const cmd = `${side.slice(0,1)}${layer}${n}${key}`;
      //this.socket.send(cmd);      
      //console.log(cmd);
    });    
  }
  handleUpload(event) {    
    this.sendKeys(1,'left');
    this.sendKeys(1,'right');

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
        <Keys conf={this.state.conf} layer={this.state.layer}/>
        <button onClick={this.handleUpload} > upload</button>
      </div>
    );
  }
}

export default App;
