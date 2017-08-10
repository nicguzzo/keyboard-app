import React, { Component } from 'react';
import Key from './Key'

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


export default Keys;
