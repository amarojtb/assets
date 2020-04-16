import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import svg4everybody from 'svg4everybody';
import './Svg.css';

const propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.string,
};
const defaultProps = {
  className: '',
  size: 'medium',
  icon: '',
};

class Svg extends Component {
  constructor(props) {
    super(props);

    this.refIcon = this.refIcon.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { className, icon } = this.props;

    return className !== nextProps.className || icon !== nextProps.icon;
  }

  componentDidUpdate() {
    const { icon } = this.props;
    const path = this.icon.getElementsByTagName('path')[0];

    if (path != null) {
      const use = document.createElement('use');

      path.remove();
      use.setAttribute('xlink:href', `/build/img/sprite.svg#${icon}`);
      this.icon.appendChild(use);
      svg4everybody();
    }
  }

  refIcon(ref) {
    this.icon = ref;
  }

  render() {
    const { className, icon, size } = this.props;
    const iconClassNames = classnames(
      'icon',
      `icon-${icon}`,
      `icon--${size}`,
      className
    );

    return (
      <svg className={iconClassNames} ref={this.refIcon}>
        <use xlinkHref={`/build/img/sprite.svg#${icon}`} />
      </svg>
    );
  }
}

Svg.defaultProps = defaultProps;
Svg.propTypes = propTypes;
export default Svg;
