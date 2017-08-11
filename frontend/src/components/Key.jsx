import React, { Component } from 'react';

class Key extends Component {

  render () { 
    return <div className="key">      
      {this.props.cod}
    </div>;
  }
}
export default Key;

