import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import RefTest from './extra/ref_test';

const App = () => {
  return (
    <div>
      <RefTest />

    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)