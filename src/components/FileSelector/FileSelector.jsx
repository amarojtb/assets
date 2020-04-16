/**
 * The File selector component allows the user to select file(s)
 * from a user’s file system.
 * Either natively using an file input or drag and drop.
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import uuid from 'uuid';
import Button from 'components/Button';
import FormElement from 'components/FormElement';
import Svg from 'components/Svg';
import './FileSelector.css';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  extensions: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape.isRequired,
  label: PropTypes.string,
  maxSize: PropTypes.number,
  onDropAccepted: PropTypes.func,
  showHelp: PropTypes.bool,
};
const defaultProps = {
  children: null,
  className: '',
  extensions: [],
  label: null,
  maxSize: Infinity,
  onDropAccepted: null,
  showHelp: true,
};

class FileSelector extends PureComponent {
  constructor(props) {
    super(props);

    this.id = `file-selector-${uuid()}`;

    this.state = { error: false };

    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDropAccepted = this.handleDropAccepted.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
  }

  bytesToSize(bytes) {
    const { intl: { formatMessage } } = this.props;
    const unitSymbols = [
      formatMessage({ id: 'Global.bytes' }),
      formatMessage({ id: 'Global.kilobyteSymbol' }),
      formatMessage({ id: 'Global.megabyteSymbol' }),
    ];
    const size = Math.floor(Math.log(bytes) / Math.log(1024));

    return {
      size: Math.round(bytes / 1024 ** size),
      unitSymbol: unitSymbols[size],
    };
  }

  handleDragLeave() {
    this.setState({ error: false });
  }

  handleDropAccepted(file) {
    const { onDropAccepted } = this.props;

    if (typeof onDropAccepted === 'function') {
      onDropAccepted(file);
    }

    this.setState({ error: false });
  }

  handleDropRejected() {
    this.setState({ error: true });
  }

  render() {
    const {
      children,
      className,
      extensions,
      intl: { formatMessage },
      label,
      maxSize,
      showHelp,
      ...rest
    } = this.props;
    const { error } = this.state;
    const fileSelectorDropzoneClassNames = classnames(
      'c-file-selector__dropzone',
      { 'has-error': error },
      className
    );
    const buttonLabel = rest.multiple
      ? 'multipleFilesButtonLabel'
      : 'singleFileButtonLabel';
    const text = rest.multiple ? 'multipleFilesText' : 'singleFileText';

    return (
      <FormElement
        error={
          error
            ? formatMessage({ id: 'FileSelector.noSupportedFileText' })
            : null
        }
        id={this.id}
        label={label}
      >
        {showHelp && (
          <div className="c-form-element__help">
            {extensions.map(extensionItem => `.${extensionItem} `)}
            {maxSize !== Infinity && (
              <FormattedMessage
                id="FileSelector.maxSizeMessage"
                values={this.bytesToSize(maxSize)}
              />
            )}
          </div>
        )}
        <div className="c-file-selector c-file-selector--files">
          <Dropzone
            {...rest}
            className={fileSelectorDropzoneClassNames}
            inputProps={{ id: this.id }}
            maxSize={maxSize}
            onDragLeave={this.handleDragLeave}
            onDropAccepted={this.handleDropAccepted}
            onDropRejected={this.handleDropRejected}
            rejectClassName="has-error"
            style={{}}
          >
            {({ isDragReject }) => (
              <div className="c-file-selector__body">
                <Button
                  className="c-file-selector__button"
                  disabled={isDragReject}
                  type="primary"
                >
                  <Svg className="btn__icon--left" icon="upload" />
                  <FormattedMessage id={`FileSelector.${buttonLabel}`} />
                </Button>
                <span className="c-file-selector__text u-hidden-md-down">
                  <FormattedMessage
                    id={
                      isDragReject
                        ? 'FileSelector.noSupportedFileText'
                        : `FileSelector.${text}`
                    }
                  />
                </span>
              </div>
            )}
          </Dropzone>
        </div>
        {children}
      </FormElement>
    );
  }
}

FileSelector.defaultProps = defaultProps;
FileSelector.propTypes = propTypes;
export default injectIntl(FileSelector);
