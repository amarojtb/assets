import React, {Fragment } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

import Svg from "./components/Svg/Svg";
import Link from "./components/Link/Link";
import Button from "./components/Button/Button";

import './App.css';

library.add(faTwitter, fas);

const App = () => {
  return (
    <Fragment>
      <Button type="button" buttonStyle="primary" onClick={null}>
        All
      </Button>

      <div className="social-icons">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/amarojtb/"
        >
          <Svg icon="twitter" size="medium" />
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.github.com/amarojtb"
        >
          <Svg icon="github" size="medium" />
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/AmaroBarros10"
        >
          <Svg icon="linkedin" size="medium" />
        </Link>
      </div>
    </Fragment>
  );
}

export default App;