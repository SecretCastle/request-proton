import React, { Component } from 'react';

class FileTest extends Component {
  componentDidMount() {
    const btn = document.getElementById('fileTest');
    const ipt = document.getElementById('fileInput');

    btn.addEventListener('click', () => {
      ipt.click();
    }, false);

    ipt.addEventListener('change', (e) => {
      console.log(e);
      e.target.value = '';
    }, false);
  }
  
  render() {
    return (
      <div>
        <button id="fileTest">test</button>
        <input id="fileInput" type="file" style={{ opacity: 0 }}/>
      </div>
    );
  }
};

export default FileTest;