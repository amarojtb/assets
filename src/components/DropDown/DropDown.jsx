import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Button from 'components/Button';
import Svg from 'components/Svg';
import './DropDown.css';

const propTypes = {
  branded: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  collapsed: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  primaryClickAction: PropTypes.func,
  smartDrop: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  showArrow: PropTypes.bool,
  splitted: PropTypes.bool,
  icon: PropTypes.string,
  style: PropTypes.string,
  type: PropTypes.string,
  tooltip: PropTypes.string,
  intl: intlShape.isRequired,
};

const defaultProps = {
  branded: false,
  children: null,
  className: '',
  collapsed: false,
  disabled: false,
  onClick: null,
  primaryClickAction: Function.prototype,
  smartDrop: null,
  title: Function.prototype,
  showArrow: true,
  splitted: false,
  icon: '',
  style: '',
  type: '',
  tooltip: '',
};

class DropDown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: props.collapsed,
    };

    this.handleExpand = this.handleExpand.bind(this);
    this.handleExpandDouble = this.handleExpandDouble.bind(this);
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

  handleExpand(e) {
    const { onClick } = this.props;
    const { collapsed } = this.state;

    e.preventDefault();
    e.stopPropagation();

    this.setState({ collapsed: !collapsed });

    if (typeof onClick === 'function') {
      onClick();
    }
  }

  handleExpandDouble(e) {
    const { collapsed } = this.state;

    e.preventDefault();
    e.stopPropagation();

    this.setState({ collapsed: !collapsed });
  }

  pageClick(e) {
    if (!this.dropdown.contains(e.target) && this.state.collapsed) {
      this.setState({ collapsed: false });
    }
  }

  refDropdownElement(ref) {
    this.dropdown = ref;
  }

  renderSplitted() {
    const {
      branded,
      children,
      className,
      disabled,
      title,
      showArrow,
      icon,
      style,
      type,
      primaryClickAction,
      intl: { formatMessage },
    } = this.props;
    const { collapsed } = this.state;
    const direction = this.getDropDirection();
    const dropdownClassNames = classnames(
      'drop-down',
      style,
      { 'is-open': collapsed },
      className
    );
    const typeStyle = type ? `btn--${type}` : '';
    return (
      <div
        className={dropdownClassNames}
        ref={this.refDropdownElement}
        disabled
      >
        <div
          className={classnames('drop-down-trigger', typeStyle, {
            disabled,
          })}
        >
          {
            <Fragment>
              {(typeof title === 'function' && title()) || (
                <Button
                  onClick={primaryClickAction}
                  onKeyUp={primaryClickAction}
                  className="drop-down_splitted__primary"
                  type="primary"
                  title={formatMessage({ id: 'Insight.tabulation.createWidget' })}
                  disabled={disabled}
                >
                  <span dangerouslySetInnerHTML={{ __html: title }} />
                </Button>
              )}
              {icon !== '' && <Svg className="m-left--xx-small" icon={icon} />}
              {showArrow && (
                <Button
                  onClick={this.handleExpand}
                  type="primary"
                  disabled={disabled}
                  onKeyUp={this.handleExpand}
                  className={`drop-down-icon ${(branded &&
                    't-color-primary-bg') ||
                    ''}`}
                >
                  <Svg
                    className="m-left--xx-small"
                    icon={collapsed ? 'up' : 'down'}
                    size="x-small"
                  />
                </Button>
              )}
            </Fragment>
          }
        </div>
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

  renderNormal() {
    const {
      branded,
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
      'drop-down',
      style,
      { 'is-open': collapsed },
      className
    );
    const typeStyle = type ? `btn--${type}` : '';
    return (
      <div className={dropdownClassNames} ref={this.refDropdownElement}>
        <Button
          className={classnames('drop-down-trigger', typeStyle)}
          disabled={disabled}
          onClick={this.handleExpand}
          title={tooltip}
        >
          {
            <Fragment>
              {(title && (typeof title === 'function' && title())) || (
                <span
                  className="p-right--small"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {icon !== '' && <Svg className="m-left--x-small" icon={icon} />}
              {showArrow && (
                <span
                  className={`drop-down-icon sb__btn ${(branded &&
                    't-color-primary-bg') ||
                    ''}`}
                >
                  <Svg
                    className="m-left--x-small"
                    icon={collapsed ? 'up' : 'down'}
                    size="x-small"
                  />
                </span>
              )}
            </Fragment>
          }
        </Button>
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

  renderIcon() {
    const {
      children,
      className,
      disabled,
      icon,
      style,
      type,
      tooltip,
    } = this.props;
    const { collapsed } = this.state;
    const direction = this.getDropDirection();
    const dropdownClassNames = classnames(
      'drop-down',
      style,
      { 'is-open': collapsed },
      className
    );
    const typeStyle = type ? `btn--${type}` : '';
    return (
      <div className={dropdownClassNames} ref={this.refDropdownElement}>
        <Button
          className={classnames('drop-down-trigger', typeStyle)}
          disabled={disabled}
          onClick={this.handleExpand}
          title={tooltip}
        >
          {<Fragment>{icon !== '' && <Svg icon={icon} />}</Fragment>}
        </Button>
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

  renderDouble() {
    const {
      children,
      className,
      disabled,
      title,
      showArrow,
      icon,
      style,
      type,
      onDoubleClick,
      tooltip,
      onMouseDown,
    } = this.props;
    const { collapsed } = this.state;
    const direction = this.getDropDirection();
    const dropdownClassNames = classnames(
      'drop-down',
      style,
      { 'is-open': collapsed },
      className
    );
    const typeStyle = type ? `btn--${type}` : '';
    return (
      <div className={dropdownClassNames} ref={this.refDropdownElement}>
        {(typeof title === 'function' && title()) || (
          <span
            role="button"
            tabIndex={0}
            className={typeStyle}
            disabled={disabled}
            title={tooltip}
            onKeyUp={onMouseDown}
            onClick={onMouseDown}
            onDoubleClick={onDoubleClick}
          >
            <span dangerouslySetInnerHTML={{ __html: title }} />
          </span>
        )}
        {showArrow && (
          <Button
            className={typeStyle}
            disabled={disabled}
            title={tooltip}
            onMouseDown={this.handleExpandDouble}
          >
            {icon !== '' && <Svg className="m-left--x-small" icon={icon} />}
            <span className="drop-down-icon">
              <Svg className="m-left--x-small" icon="more-actions" />
            </span>
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

  render() {
    const { splitted, double, iconRendering } = this.props;

    if (splitted) {
      return this.renderSplitted();
    } else if (double) {
      return this.renderDouble();
    } else if (iconRendering) {
      return this.renderIcon();
    }
    return this.renderNormal();
  }
}

DropDown.defaultProps = defaultProps;
DropDown.propTypes = propTypes;
export default injectIntl(DropDown);
