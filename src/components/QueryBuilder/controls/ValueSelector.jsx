import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import ReactSelect from 'components/ReactSelect';

const ValueSelector = ({
  value,
  options,
  handleOnChange,
  className,
  intl: { formatMessage },
  placeholder,
}) => {
  const result = options.map(option => ({
    label: option.label,
    value: option.name,
  }));
  return (
    <ReactSelect
      className={className}
      onChange={handleOnChange}
      options={result}
      placeholder={placeholder}
      valueKey="value"
      labelKey="label"
      value={value}
    />
  );
};

ValueSelector.displayName = 'ValueSelector';

ValueSelector.defaultProps = {
  intl: {},
  className: '',
};

ValueSelector.propTypes = {
  intl: intlShape,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
    }),
  ]).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
  handleOnChange: PropTypes.func.isRequired,
};

export default injectIntl(ValueSelector);
