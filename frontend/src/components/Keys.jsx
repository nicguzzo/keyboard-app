import React, { Component } from 'react';
import Key from './Key'

class Keys extends Component {

  get_code(side,n){
    const ni = parseInt(n, 10)
    const { conf, layer } = this.props;
    const {scancodes}=this.props
    //return (conf.layers) ? conf.layers[layer][side][ni]: null;
    if (conf.layers){
      const code=conf.layers[layer][side][ni]
      const {us}=scancodes.layouts;
      return (us[code])? us[code] : code;
    }else{
      return null;
    }
  }


  render() {
    let col = [...Array(5).keys()];
    col = col.map(x => [...Array(6).keys()]);
    return (
      <div className="keys">
        <ul id="left_keys">
          { col.map( (row, i) =>
            <li>
              {row.map((v, j) =>
                <div className="wrap">
                  { (j === 4 && i > 3) && <div className="separador"></div> }
                  <Key cod={this.get_code("left", i * 6 + j)} num={i * 6 + j}/>
                </div>
              )}
            </li>
          )}
        </ul>
        <div className="separador"></div>
        <ul id="right_keys">
          { col.map( (row, i) =>
            <li>
              {row.map((v, j) =>
                <div className="wrap">
                  { (j === 0 && i < 4) && <div className="separador"></div> }
                  <Key cod={this.get_code("right", i * 6 + j)} num={i * 6 + j}/>
                  
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    );
  }
}


export default Keys;
