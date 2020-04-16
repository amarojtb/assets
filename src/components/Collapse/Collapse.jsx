import classnames from 'classnames';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Svg from 'components/Svg';
import './Collapse.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.node,
};
const defaultProps = {
  children: null,
  className: '',
  isOpen: false,
  onClick: null,
  title: '',
};

class Collapse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /*   componentWillReceiveProps(nextProps) {
    this.setState({
      isOpen: nextProps.isOpen || false,
    });
  } */

  handleClick() {
    const { isOpen } = this.state;
    const { onClick } = this.props;

    this.setState({ isOpen: !isOpen });

    if (typeof onClick === 'function') {
      onClick();
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === keycode('enter')) {
      this.handleClick();
    }
  }

  render() {
    const { children, className, title } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={classnames('c-collapse', className)}>
        <div
          className="c-collapse__header"
          onClick={this.handleClick}
          onKeyPress={this.handleKeyDown}
          role="button"
          tabIndex={-1}
        >
          {title}
          <span className="c-collapse__icon">
            {isOpen ? <Svg icon="up" /> : <Svg icon="down" />}
          </span>
        </div>
        <div
          className={classnames('c-collapse__content', {
            'is-hidden': !isOpen,
          })}
        >
          {children}
        </div>
      </div>
    );
  }
}

Collapse.defaultProps = defaultProps;
Collapse.propTypes = propTypes;
export default Collapse;
