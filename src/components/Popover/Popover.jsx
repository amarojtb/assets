/**
 * A popover is a non-modal dialog.
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Popover.css';

const propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const defaultProps = {
  children: null,
};

class Popover extends Component {
  constructor(props) {
    super(props);

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.refPopoverCallback = this.refPopoverCallback.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick(event) {
    const { onClose } = this.props;
    const { target } = event;

    if (
      this.popover instanceof HTMLDivElement &&
      !this.popover.contains(target)
    ) {
      document.removeEventListener('click', this.handleDocumentClick);
      onClose();
    }
  }

  refPopoverCallback(ref) {
    this.popover = ref;
  }

  render() {
    const { children } = this.props;

    return (
      <TransitionGroup>
        <CSSTransition appear classNames="c-popover-dialog" timeout={200}>
          <div
            className="c-popover o-nubbin--top"
            ref={this.refPopoverCallback}
          >
            <div className="c-popover__body">{children}</div>
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}

Popover.defaultProps = defaultProps;
Popover.propTypes = propTypes;
export default Popover;
