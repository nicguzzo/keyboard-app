import React, { Component } from 'react';
import '../styles/App.css';

const Key = ({ position }) => <div className="key">
  {position}
</div>;

class Keys extends Component {

  getLeft(n){
    const ni = parseInt(n)
    const { conf, layer } = this.props;
    return (conf.layers) ? conf.layers[layer].left[ni]: null;
  }
  getRight(n){
    const ni = parseInt(n)
    const { conf, layer } = this.props;
    return (conf.layers) ? conf.layers[layer].right[ni]: null;
  }

  render() {
    let amountRows = [...Array(5).keys()];
    amountRows = amountRows.map(x => [...Array(6).keys()]);
    return (
      <div className="keys">
        <ul id="left_keys">
          { amountRows.map( (row, i) => <li key={i}>
              {row.map((v, j) =>
                <Key key={j}
                  position={this.getLeft(i+j)}
                />
              )}
            </li>
          )}
        </ul>
        <ul id="right_keys">
          { amountRows.map( (row, i) => <li key={i}>
              {row.map((v, j) =>
                <Key key={j}
                  position={this.getRight(i+j)}
                />
              )}
            </li>
          )}

        </ul>
      </div>
    );
  }
}

function getScancodes(){

}

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      conf:{},
      layer:1,
      message: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.sendKeys = this.sendKeys.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  componentWillMount() {
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
    const { opcode, payload } =JSON.parse(data);
    if(opcode === "hello"){
      this.socket.send("get_conf");
    }
    if(opcode === "conf"){
      this.setState({ conf: payload, layer:1 })
    }
  }

  handleSubmit(event) {
    const { message } = this.state;
    this.socket.send(message);
    this.setState({ message: "" });
    event.preventDefault();
  }

  sendKeys(layer,side){
    const { layers } = this.state.conf;
    layers[layer][side].map( (key, i) => {
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

  handleMessageChange(event) {
    this.setState({
      message: event.target.value
    });
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
          <input
            type="text"
            id="message"
            value={this.state.message}
            onChange={this.handleMessageChange}
          />
          <input type="submit" value="Send"/>
        </form>
        <Keys conf={this.state.conf} layer={this.state.layer}/>
        <button onClick={this.handleUpload} > upload</button>
      </div>
    );
  }
}

export default App;
