/**
 * Wrapper for the react-select external component.
 * This allows you to configure custom options.
 */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import Select, { Creatable } from 'react-select';
import Svg from 'components/Svg';
import './ReactSelect.css';

const propTypes = {
  async: PropTypes.bool,
  canAddNewTags: PropTypes.bool,
  className: PropTypes.string,
  intl: intlShape.isRequired,
  openTop: PropTypes.bool,
  isSearchable: PropTypes.bool,
};
const defaultProps = {
  async: false,
  canAddNewTags: false,
  className: '',
  openTop: false,
  isSearchable: true,
};

const ReactSelect = ({
  async,
  canAddNewTags,
  className,
  intl: { formatMessage },
  openTop,
  ...rest
}) => {
  const customProps = {
    addLabelText: formatMessage({ id: 'ReactSelect.addLabelText' }),
    // eslint-disable-next-line react/prop-types
    arrowRenderer: ({ isOpen }) => (
      <Svg
        className="Select-arrow"
        icon={isOpen ? 'up' : 'down'}
        size="x-small"
      />
    ),
    backspaceToRemoveMessage: formatMessage({
      id: 'ReactSelect.backspaceToRemoveMessage',
    }),
    className: classnames(className, { 'Select--open-top': openTop }),
    clearable: false,
    clearAllText: formatMessage({ id: 'ReactSelect.clearAllText' }),
    clearValueText: formatMessage({ id: 'ReactSelect.clearValueText' }),
    ignoreAccents: false,
    loadingPlaceholder: formatMessage({
      id: 'ReactSelect.loadingPlaceholder',
    }),
    noResultsText: formatMessage({ id: 'ReactSelect.noResultsText' }),
    searchPromptText: formatMessage({ id: 'ReactSelect.searchPromptText' }),
  };
  const props = { ...customProps, ...rest };

  if (canAddNewTags) {
    return <Creatable {...props} />;
  }

  if (async) {
    return <Select.Async {...props} />;
  }

  return <Select {...props} />;
};

ReactSelect.defaultProps = defaultProps;
ReactSelect.propTypes = propTypes;
export default injectIntl(ReactSelect);
