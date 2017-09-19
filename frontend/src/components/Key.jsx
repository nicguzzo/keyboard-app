import React, { Component } from 'react';

class Key extends Component {

  render () { 
    return <div className="key">      
      {this.props.cod} 
      <br/>
      <br/>
      key: {this.props.num}
    </div>;
  }
}
export default Key;

