import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropDown from 'components/DropDown';
import './DropDownSelect.css';

const propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

const defaultProps = {
  children: '',
  onClick: Function.prototype,
};

class DropDownSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick();
    }
  }

  render() {
    return (
      <DropDown
        className="c-dropdown-select"
        onClick={this.handleOnClick}
        branded
        {...this.props}
      >
        <div className="c-dropdown-select_content">{this.props.children}</div>
      </DropDown>
    );
  }
}

DropDownSelect.propTypes = propTypes;
DropDownSelect.defaultProps = defaultProps;

export default DropDownSelect;
