import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { postFetch } from 'services/AppUtils';
import ReactSelect from 'components/ReactSelect';
import QueryBuilderStore from 'stores/QueryBuilderStore';
import SearchStore from 'stores/SearchStore';

const propTypes = {
  intl: intlShape,
  field: PropTypes.string.isRequired,
  ops: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
      })
    ),
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ]).isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

class ValueEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
    };

    this.getSourceOptions = this.getSourceOptions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { field } = nextProps;
    const fieldName = (typeof field === 'string' && field) || field.value;
    const storeField = QueryBuilderStore.getFieldByName(fieldName);
    const fieldValues =
      storeField && QueryBuilderStore.getValuesByFieldId(storeField.fieldId);

    this.setState({
      options: (fieldValues && fieldValues.length && fieldValues) || [],
    });
  }

  getSourceOptions(input, callback) {
    const { searchModel } = window.km.Delivery.Shared
      ? window.km.Delivery.Shared.Search.searchModelJson()
      : SearchStore.buildSearchModel();
    clearTimeout(this.sourceInterval);
    if (input.length === 0) {
      callback(null, { options: [] });
      return;
    }

    this.sourceInterval = setTimeout(() => {
      postFetch(
        '/Common/GetFieldValues',
        {
          criteriaNames: 3,
          fieldId: input,
          culture: km.getLang() || 'en',
          searchModel,
        },
        json => {
          const data = Array.isArray(json.data) ? json.data : [];
          const sources = data.reduce((previous, current) => {
            const isSupportNameAlreadyAdded =
              previous.find(({ value }) => value === current.value) != null;

            return isSupportNameAlreadyAdded
              ? previous
              : [...previous, current];
          }, []);

          this.sources = data;
          this.setState({
            options: sources.map(src => ({
              label: src.value,
              value: src.value,
            })),
          });
          callback(null, {
            options: sources.map(src => ({
              label: src.value,
              value: src.value,
            })),
          });
        }
      );
    }, 1000);
  }

  render() {
    const { intl: { formatMessage } } = this.props;
    const { ops, value, handleOnChange, field } = this.props;
    const { options } = this.state;
    const fieldName = (typeof field === 'string' && field) || field.value;
    const operator =
      (typeof ops === 'string' && ops) ||
      (typeof ops === 'object' && ops !== null && ops.value);

    if (operator === '1' || operator === '2') {
      return null;
    }

    if (['7', '8', '9', '10'].includes(operator)) {
      return (
        <div className="c-query_builder-value_editor">
          <input
            type="text"
            className="c-input"
            value={
              typeof value === 'string' ? value : (value && value.value) || ''
            }
            onChange={e => handleOnChange(e.target.value)}
          />
        </div>
      );
    }
    return (
      <div className="c-query_builder-value_editor">
        <ReactSelect
          async={fieldName === 'SourceNames'}
          autoload={false}
          cache={false}
          loadOptions={
            (fieldName === 'SourceNames' && this.getSourceOptions) || null
          }
          labelKey="label"
          multi={['3', '4'].includes(operator)}
          onChange={handleOnChange}
          options={
            (Array.isArray(options) &&
              options.map(fld => ({
                label: fld.value,
                value: fld.key,
              }))) ||
            []
          }
          placeholder={this.props.placeholder}
          valueKey="value"
          value={value}
        />
      </div>
    );
  }
}

ValueEditor.displayName = 'ValueEditor';
ValueEditor.propTypes = propTypes;
ValueEditor.defaultProps = {
  intl: {},
};
export default injectIntl(ValueEditor);
