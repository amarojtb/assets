import React, {Fragment } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

import Svg from "./components/Svg/Svg";
import Link from "./components/Link/Link";
import Button from "./components/Button/Button";

// import './App.css';

library.add(faTwitter, fas);

const App = () => {
  return (
    <Fragment>
      <Button type="button" buttonStyle="primary" onClick={null}>
        All
      </Button>
      <Button type="button" buttonStyle="primary" onClick={null}>
        <Svg icon="" />
      </Button>
    </Fragment>
  );
}

export default App;