import React from 'react';
import { intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import { ValueSelector, ValueEditor, ActionElement } from './controls';

class Rule extends React.Component {
  constructor(props) {
    super(props);

    this.field = props.field;
    this.operator = props.ops;
    this.value = props.value;

    this.onFieldChanged = this.onFieldChanged.bind(this);
    this.onOperatorChanged = this.onOperatorChanged.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);
    this.onElementChanged = this.onElementChanged.bind(this);
    this.removeRule = this.removeRule.bind(this);
  }

  componentDidMount() {
    const { id, onRuleChange } = this.props;
    onRuleChange(this.field, this.operator, this.value, id, true);
  }

  componentWillReceiveProps(nextProps) {
    this.combinator = nextProps.combinator;
    this.forceUpdate();
  }

  onFieldChanged(value) {
    const { onRuleChange, id } = this.props;
    this.field = value.value;
    this.onElementChanged('field', value.value);
    if (onRuleChange) {
      onRuleChange(this.field, this.operator, this.value, id);
    }
  }

  onOperatorChanged(value) {
    const { onRuleChange, id } = this.props;
    this.operator = (value && value.value && value.value) || null;
    this.onElementChanged('ops', this.operator);

    if (onRuleChange) {
      onRuleChange(this.field, this.operator, this.value, id);
    }
  }

  onValueChanged(value) {
    const { onRuleChange, id } = this.props;
    const val = (typeof value === 'string' && value) || value;
    this.value = val;
    this.onElementChanged('value', val);

    if (onRuleChange) {
      onRuleChange(this.field, this.operator, this.value, id);
    }
  }

  onElementChanged(property, value) {
    const { id, schema: { onPropChange } } = this.props;
    onPropChange(property, value, id);
  }

  removeRule(event) {
    event.preventDefault();
    event.stopPropagation();

    this.props.schema.onRuleRemove(this.props.id, this.props.parentId);
  }

  render() {
    const { intl: { formatMessage } } = this.props;
    const {
      id,
      lastRuleId,
      field,
      ops,
      value,
      translations,
      schema: { fields, getOperators, getLevel, classNames },
    } = this.props;
    const level = getLevel(this.props.id);
    return (
      <div
        className={`rule ${classNames.rule} ${(id === lastRuleId &&
          'rule-highlight') ||
          ''}`}
      >
        {(this.combinator && (
          <div className="operator_label btn--primary">
            {(this.props.index === 0 &&
              formatMessage({ id: 'QueryBuilder.select' })) ||
              (this.combinator &&
                formatMessage({ id: `QueryBuilder.${this.combinator.ops}` }))}
          </div>
        )) || (
          <div className="operator_label btn--primary">
            {formatMessage({ id: 'QueryBuilder.select' })}
          </div>
        )}
        <ValueSelector
          className={`rule-fields ${classNames.fields}`}
          handleOnChange={this.onFieldChanged}
          level={level}
          options={fields}
          placeholder={formatMessage({ id: 'QueryBuilder.selectOption' })}
          title={translations.fields.title}
          value={field}
        />
        <ValueSelector
          className={`rule-operators ${classNames.operators}`}
          field={field}
          handleOnChange={this.onOperatorChanged}
          level={level}
          options={getOperators(field)}
          placeholder={formatMessage({ id: 'QueryBuilder.selectOperator' })}
          title={translations.operators.title}
          value={ops}
        />
        <ValueEditor
          className={`rule-value ${classNames.value}`}
          field={field}
          fields={fields}
          handleOnChange={this.onValueChanged}
          level={level}
          ops={ops}
          placeholder={formatMessage({ id: 'QueryBuilder.selectValue' })}
          title={translations.value.title}
          value={value}
        />
        <ActionElement
          id={translations.removeRule.id}
          label={translations.removeRule.label}
          title={translations.removeRule.title}
          className={`rule-remove ${classNames.removeRule}`}
          handleOnClick={this.removeRule}
          level={level}
        />
      </div>
    );
  }
}

Rule.propTypes = {
  intl: intlShape,
  field: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
    }),
  ]).isRequired,
  ops: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      label: PropTypes.string,
    }),
  ]).isRequired,
  translations: PropTypes.shape({
    fields: PropTypes.shape({
      title: PropTypes.string,
    }),
    operators: PropTypes.shape({
      title: PropTypes.string,
    }),
    value: PropTypes.shape({
      title: PropTypes.string,
    }),
    removeRule: PropTypes.shape({
      title: PropTypes.string,
      label: PropTypes.string,
    }),
    removeGroup: PropTypes.shape({
      title: PropTypes.string,
      label: PropTypes.string,
    }),
    addRule: PropTypes.shape({
      title: PropTypes.string,
      label: PropTypes.string,
    }),
    addGroup: PropTypes.shape({
      title: PropTypes.string,
      label: PropTypes.string,
    }),
  }).isRequired,
  onRuleRemove: PropTypes.func.isRequired,
  onRuleChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired,
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
  schema: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
          PropTypes.shape({
            startDate: PropTypes.instanceOf(moment),
            endDate: PropTypes.instanceOf(moment),
          }),
        ]),
      })
    ).isRequired,
    operators: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        label: PropTypes.string,
      })
    ).isRequired,
    classNames: PropTypes.shape({
      queryBuilder: PropTypes.string,
      ruleGroup: PropTypes.string,
      addRule: PropTypes.string,
      addGroup: PropTypes.string,
      removeGroup: PropTypes.string,
      rule: PropTypes.string,
      fields: PropTypes.string,
      operators: PropTypes.string,
      value: PropTypes.string,
      removeRule: PropTypes.string,
    }).isRequired,
    createRule: PropTypes.func.isRequired,
    createRuleGroup: PropTypes.func.isRequired,
    onRuleAdd: PropTypes.func.isRequired,
    onGroupAdd: PropTypes.func.isRequired,
    onRuleRemove: PropTypes.func.isRequired,
    onGroupRemove: PropTypes.func.isRequired,
    onPropChange: PropTypes.func.isRequired,
    getLevel: PropTypes.func.isRequired,
    isRuleGroup: PropTypes.func.isRequired,
    controls: PropTypes.shape({
      addGroupAction: PropTypes.func,
      addRuleAction: PropTypes.func,
      combinatorSelector: PropTypes.func,
      fieldSelector: PropTypes.func,
      operatorSelector: PropTypes.func,
      removeGroupAction: PropTypes.func,
      removeRuleAction: PropTypes.func,
      valueEditor: PropTypes.func,
    }).isRequired,
    getOperators: PropTypes.func.isRequired,
  }).isRequired,
};

Rule.defaultProps = {
  intl: {},
};

export default injectIntl(Rule, { withRef: true });
