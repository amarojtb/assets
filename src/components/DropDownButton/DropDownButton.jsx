import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Svg from 'components/Svg';

import './DropDownButton.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  collapsed: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  smartDrop: PropTypes.string,
  title: PropTypes.node,
  showArrow: PropTypes.bool,
  icon: PropTypes.string,
  style: PropTypes.string,
  type: PropTypes.string,
  tooltip: PropTypes.string,
};

const defaultProps = {
  children: null,
  className: '',
  collapsed: false,
  disabled: false,
  onClick: null,
  smartDrop: null,
  title: Function.prototype,
  showArrow: true,
  icon: '',
  style: '',
  type: '',
  tooltip: '',
};

class DropDownButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.collapsed,
    };

    this.handleExpand = this.handleExpand.bind(this);
    this.pageClick = this.pageClick.bind(this);
    this.getDropDirection = this.getDropDirection.bind(this);
    this.refDropdownElement = this.refDropdownElement.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.pageClick, false);
  }

  componentWillReceiveProps(nextProps) {
    if (
      'collapsed' in nextProps &&
      nextProps.collapsed !== 'undefined' &&
      !nextProps.collapsed &&
      this.state.collapsed
    ) {
      this.setState({
        collapsed: false,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.pageClick, false);
  }

  getDropDirection() {
    const { smartDrop } = this.props;

    if (smartDrop) {
      const parentWrapper = document.querySelector(smartDrop);

      if (parentWrapper) {
        const dropDownPosition = this.dropdown
          ? this.dropdown.getBoundingClientRect()
          : {};

        if (parentWrapper.clientHeight - dropDownPosition.top < 0) {
          return 'top';
        }
      }
    }
    return 'down';
  }

  handleExpand(event) {
    event.preventDefault();
    const { onClick } = this.props;
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });

    if (typeof onClick === 'function') {
      onClick();
    }
  }

  pageClick(e) {
    if (!this.dropdown.contains(e.target) && this.state.collapsed) {
      this.setState({ collapsed: false });
    }
  }

  refDropdownElement(ref) {
    this.dropdown = ref;
  }

  render() {
    const {
      children,
      className,
      disabled,
      title,
      showArrow,
      icon,
      style,
      type,
      tooltip,
    } = this.props;
    const { collapsed } = this.state;
    const direction = this.getDropDirection();
    const dropdownClassNames = classnames(
      'drop-down-button',
      style,
      { 'is-open': collapsed },
      className
    );

    const typeStyle = type ? classnames('btn', `btn--${type}`) : '';
    return (
      <div className={dropdownClassNames} ref={this.refDropdownElement}>
        <div className="show--inline-flex">{title}</div>
        {showArrow && (
          <Button
            className={classnames('drop-down-button-trigger', typeStyle)}
            disabled={disabled}
            onMouseDown={this.handleExpand}
            title={tooltip}
          >
            {
              <Fragment>
                {icon !== '' && <Svg className="m-left--x-small" icon={icon} />}
                <span className="drop-down-icon">
                  <Svg
                    className="m-left--x-small"
                    icon={collapsed ? 'up' : 'down'}
                    size="x-small"
                  />
                </span>
              </Fragment>
            }
          </Button>
        )}

        <div
          className={
            collapsed
              ? `dropdown-show-content ${direction}`
              : 'dropdown-hide-content'
          }
        >
          {children}
        </div>
      </div>
    );
  }
}

DropDownButton.defaultProps = defaultProps;
DropDownButton.propTypes = propTypes;
export default DropDownButton;
