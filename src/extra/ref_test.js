import React, { Component } from 'react';

class RefTest extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.textInput);
  }

  focus = () =>  {
    // Explicitly focus the text input using the raw DOM API
    console.log(this.textInput);
    this.textInput.focus();
  }

  render () {
    return (
      <div>
        <input
          type="text"
          ref={(input) => {this.textInput = input;}}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focus}
        />
      </div>
    );
  }
}

export default RefTest;
