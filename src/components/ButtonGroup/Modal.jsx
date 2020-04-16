import { getLang, isoCodeToLocale } from 'services/AppUtils';
import React, { Component } from 'react';
import classnames from 'classnames';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ModalBody from '../ModalBody/ModalBody';
import ModalFooter from '../ModalFooter/ModalFooter';
import ModalHeader from '../ModalHeader/ModalHeader';
import './Modal.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  type: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.oneOf(['auto', 'small', 'medium', 'large', 'full']),
    PropTypes.string,
  ]),
};
const defaultProps = {
  children: null,
  className: '',
  isOpen: false,
  onCancel() {},
  width: 'medium',
  type: '',
};

class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleModalClick = this.handleModalClick.bind(this);
  }

  componentDidMount() {
    const { className, width } = this.props;

    this.node = document.createElement('div');
    this.node.className = classnames(
      'modal',
      typeof width === 'string' && `modal--${width}`,
      'u-position--fixed',
      'u-pin--top-left',
      'u-full-width',
      'u-full-height',
      className
    );

    document.body.appendChild(this.node);

    this.componentDidUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen) {
      window.addEventListener('keydown', this.handleKeyDown);
    } else {
      window.removeEventListener('keydown', this.handleKeyDown);
    }

    this.setState({
      isOpen: nextProps.isOpen,
    });
  }

  componentDidUpdate() {
    const { children, width, type } = this.props;
    const { isOpen } = this.state;

    if (isOpen) {
      this.node.classList.add('modal--open');
      this.node.style.overflowY = 'hidden';
      document.body.classList.add('modal-open');

      // The delay of the Modal transition (present in the Modal.css file)
      setTimeout(() => {
        const wrapper =
          document.body.contains(this.node) &&
          this.node.getElementsByClassName('modal__wrapper')[0];

        if (wrapper && wrapper.offsetHeight > window.innerHeight) {
          this.node.style.overflowY = '';
        }
      }, 200);
    } else {
      this.node.classList.remove('modal--open');
      document.body.classList.remove('modal-open');
    }

    ReactDOM.render(
      <IntlProvider
        locale={isoCodeToLocale(getLang())}
        messages={window.Messages}
      >
        <div
          className={`modal__wrapper ${type} u-display--table u-full-width
        u-full-height`}
        >
          <div
            className="modal__layout u-display--table-cell u-full-width
            u-full-height text-align--center align-middle"
            onClick={this.handleModalClick}
            role="presentation"
          >
            <div
              className="modal__container u-display--inline-block
              text-align--left"
              style={
                typeof width === 'string' ? { maxWidth: `${width}rem` } : null
              }
            >
              {children}
            </div>
          </div>
        </div>
      </IntlProvider>,
      this.node
    );
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.node);
    document.body.removeChild(this.node);
  }

  handleKeyDown(event) {
    const { onCancel } = this.props;

    if (event.keyCode === 27) {
      onCancel();
    }
  }

  handleModalClick(event) {
    const { onCancel } = this.props;
    if (event.target.classList.contains('modal__layout')) {
      onCancel();
    }
  }

  scrollTop() {
    this.node.scrollTop = 0;
  }

  render() {
    return null;
  }
}

Modal.defaultProps = defaultProps;
Modal.propTypes = propTypes;
export default Modal;
export { ModalBody, ModalFooter, ModalHeader };
