import React, { Component, Fragment } from 'react';
import { items } from './svgs';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

import Svg from "./components/Svg/Svg";
import Img from "./components/Img/Img";

import './App.css';

library.add(faTwitter, fas);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      svgs: items.svgs,
    };
    this.onFilterClick = this.onFilterClick.bind(this);
  }

  onFilterClick(e) {
    const result = items.svgs.filter(item => item.type === e.target.innerText);
    
    this.setState({
      svgs: result
    })
  }

  render() {
    const { svgs } = this.state;
    let color = 'background-color: rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
    const divStyle = {
      backgroundColor: color
    };
    return (
      <Fragment>
        <button type="button" onClick={this.onFilterClick}>All</button>
        {
          svgs.map(svg => (
              <button type="button" onClick={this.onFilterClick}>{svg.type}</button>
            )
          )
        }
        <ul>
          {
            svgs.map(svg => {
                svg.icons.map(item => (
                  <li style={divStyle}>
                    <Img />
                  </li>
                ))
              }
            )
          }
        </ul>

        <div className="social-icons">
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/amarojtb/">
              <Svg icon="twitter" size="medium" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.github.com/amarojtb">
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/AmaroBarros10">
            </a>
        </div>
    </Fragment>
    )
  }
}
