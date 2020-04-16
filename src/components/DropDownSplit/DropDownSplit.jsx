import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropDown from 'components/DropDown';
import './DropDownSplit.css';

const propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  primaryClickAction: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  tooltip: PropTypes.string,
  disabled: PropTypes.bool,
};

const defaultProps = {
  children: '',
  onClick: Function.prototype,
  primaryClickAction: Function.prototype,
  tooltip: '',
  disabled: false,
};

class DropDownSplit extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleOnClick = this.handleOnClick.bind(this);
    this.handlePrimaryAction = this.handlePrimaryAction.bind(this);
  }

  handleOnClick() {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick();
    }
  }

  handlePrimaryAction() {
    const { primaryClickAction } = this.props;
    if (typeof primaryClickAction !== 'function') return;

    primaryClickAction();
  }

  render() {
    const { tooltip, disabled } = this.props;
    return (
      <DropDown
        {...this.props}
        splitted
        primaryClickAction={this.handlePrimaryAction}
        className={`c-dropdown-split ${this.props.className}`}
        onClick={this.handleOnClick}
        tooltip={tooltip}
        disabled={disabled}
      >
        <div className="c-dropdown-select_content">{this.props.children}</div>
      </DropDown>
    );
  }
}

DropDownSplit.propTypes = propTypes;
DropDownSplit.defaultProps = defaultProps;

export default DropDownSplit;
