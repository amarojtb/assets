import cn from 'classnames';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Svg from 'components/Svg';
import Button from 'components/Button';
import './FabButton.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  trigger: PropTypes.node,
  direction: PropTypes.string,
  disabled: PropTypes.bool,
  intl: intlShape.isRequired,
};
const defaultProps = {
  children: null,
  className: '',
  isOpen: false,
  onClick: null,
  trigger: null,
  direction: 'left',
  disabled: false,
};

class FabButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.fabRef = this.fabRef.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocumentClick, false);
  }

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

  handleDocumentClick(e) {
    if (!this.fab.contains(e.target) && this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  }

  fabRef(ref) {
    this.fab = ref;
  }

  renderActions() {
    const { children } = this.props;

    return <div className="fab-actions">{children}</div>;
  }

  renderTrigger() {
    const {
      trigger,
      disabled,
      intl: { formatMessage },
    } = this.props;
    const { isOpen } = this.state;

    return (
      (typeof trigger === 'function' && (
        <Button
          className={`fab-trigger ${
            isOpen ? 'btn--default--active' : 'btn--default'
          }`}
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
          disabled={disabled}
          title={formatMessage({ id: 'Global.expand' })}
        >
          {trigger()}
        </Button>
      )) || (
        <Button
          className="fab-trigger btn--default"
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
          disabled={disabled}
          title={formatMessage({ id: 'Global.expand' })}
        >
          <Svg icon="plus" />
        </Button>
      )
    );
  }

  render() {
    const { className, direction } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={className}>
        <div
          ref={this.fabRef}
          className={cn({
            'c-fab-button_container': true,
            btn: true,
            [direction]: true,
            collapsed: !isOpen,
            expanded: isOpen,
          })}
        >
          {this.renderActions()}
          {this.renderTrigger()}
        </div>
      </div>
    );
  }
}

FabButton.defaultProps = defaultProps;
FabButton.propTypes = propTypes;
export default injectIntl(FabButton);
