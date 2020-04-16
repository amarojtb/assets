import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './ContextMenu.css';

const propTypes = {
  buttonId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['left', 'right']).isRequired,
};

class ContextMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidMount() {
    const { buttonId } = this.props;
    const openButton = document.getElementById(buttonId);

    if (openButton) openButton.addEventListener('click', this.handleExpand);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleOutsideClick);
  }

  handleClose() {
    this.setState({ collapsed: false });
  }

  handleExpand(event) {
    const { buttonId } = this.props;
    const { collapsed } = this.state;
    const { target } = event;

    if (collapsed) {
      document.body.removeEventListener('click', this.handleOutsideClick);
    } else {
      document.body.addEventListener('click', this.handleOutsideClick);
    }

    if (
      typeof target.closest === 'function' &&
      !target.closest('.context-menu') &&
      target.closest(`#${buttonId}`) &&
      target.closest(`#${buttonId}`).id === buttonId
    ) {
      this.setState({ collapsed: !collapsed });
    }
  }

  handleOutsideClick(event) {
    const { buttonId } = this.props;
    const { target } = event;

    if (
      typeof target.closest === 'function' &&
      !target.closest(`#${buttonId}`)
    ) {
      this.setState({ collapsed: false });
      document.body.removeEventListener('click', this.handleOutsideClick);
    }
  }

  render() {
    const { children, position } = this.props;
    const { collapsed } = this.state;

    return (
      collapsed && (
        <div className={`context-menu nubbin--${position}`}>{children}</div>
      )
    );
  }
}

ContextMenu.propTypes = propTypes;
export default ContextMenu;
