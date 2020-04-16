import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import './Scroll.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
const defaultProps = {
  className: '',
};

class Scroll extends Component {
  constructor(props) {
    super(props);

    this.refScrollCallback = this.refScrollCallback.bind(this);
  }

  refScrollCallback(ref) {
    this.scroll = ref;
  }

  scrollTop() {
    this.scroll.scrollTop = 0;
  }

  render() {
    const { children, className } = this.props;
    const scrollClassNames = classnames(
      'scroll-content',
      'scrollable--y',
      className
    );

    return (
      <div className={scrollClassNames} ref={this.refScrollCallback}>
        {children}
      </div>
    );
  }
}

Scroll.defaultProps = defaultProps;
Scroll.propTypes = propTypes;
export default Scroll;
