import keycode from 'keycode';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Svg from 'components/Svg';
import './Toggle.css';

const propTypes = {
  collapsed: PropTypes.bool.isRequired,
  handleToggleClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const defaultProps = {
  className: '',
};

class Collapse extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleClick() {
    const { handleToggleClick } = this.props;

    if (typeof handleToggleClick === 'function') {
      handleToggleClick();
    }
  }

  handleKeyDown(event) {
    const { handleToggleClick } = this.props;

    if (event.keyCode === keycode('enter')) {
      handleToggleClick();
    }
  }

  render() {
    const { collapsed, className } = this.props;

    return (
      <button
        className={`btn toggle-cmp ${className}`}
        onClick={this.handleClick}
        onKeyPress={this.handleKeyDown}
        type="button"
        tabIndex={-1}
      >
        {collapsed ? <Svg icon="chevron-left" /> : <Svg icon="chevron-right" />}
      </button>
    );
  }
}

Collapse.propTypes = propTypes;
Collapse.defaultProps = defaultProps;

export default Collapse;
