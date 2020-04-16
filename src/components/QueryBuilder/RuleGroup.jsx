import React, { Fragment, Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getRuleById } from '../../../Areas/Delivery/Content/components/QueryBuilderConfiguration/QueryBuilderUtils';
import Rule from './Rule';
import CombinatorsGroup from './controls/CombinatorsGroup';
import { ActionElement } from './controls';

class RuleGroup extends Component {
  constructor(props) {
    super(props);

    this.onCombinatorChange = this.onCombinatorChange.bind(this);
    this.addRule = this.addRule.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.removeGroup = this.removeGroup.bind(this);
    this.findRule = this.findRule.bind(this);
  }

  onCombinatorChange(value) {
    const { onPropChange } = this.props.schema;

    onPropChange('combinator', value, this.props.id);
  }

  hasParentGroup() {
    return this.props.parentId;
  }

  addRule(event) {
    event.preventDefault();
    event.stopPropagation();

    const { createRule, onRuleAdd } = this.props.schema;

    const newRule = createRule();
    onRuleAdd(newRule, this.props.id);
  }

  addGroup(event) {
    event.preventDefault();
    event.stopPropagation();

    const { createRuleGroup, onGroupAdd } = this.props.schema;
    const newGroup = createRuleGroup();
    onGroupAdd(newGroup, this.props.id);
  }

  removeGroup(event) {
    event.preventDefault();
    event.stopPropagation();

    this.props.schema.onGroupRemove(this.props.id, this.props.parentId);
  }

  findRule(id) {
    const result = getRuleById(this.props.query || this.query, id);

    return result;
  }

  render() {
    const {
      intl: { formatMessage },
      combinator,
      rules,
      translations,
      schema: { onRuleRemove, getLevel, classNames },
      onRuleChange,
    } = this.props;

    const combinators = [
      {
        type: 'button',
        handleClick: this.onCombinatorChange,
        disabled: false,
        name: 'not',
        buttonClassNames: 'btn btn--default',
        title: formatMessage({ id: 'QueryBuilder.not' }),
      },
      {
        type: 'radio-button',
        children: [
          {
            type: 'radio',
            handleClick: this.onCombinatorChange,
            disabled: rules && rules.length <= 1,
            name: 'and',
            buttonClassNames: 'btn btn--primary',
            title: formatMessage({ id: 'QueryBuilder.and' }),
            checked: 'checked',
          },
          {
            type: 'radio',
            handleClick: this.onCombinatorChange,
            disabled: rules && rules.length <= 1,
            name: 'or',
            buttonClassNames: 'btn btn--primary',
            title: formatMessage({ id: 'QueryBuilder.or' }),
          },
        ],
      },
    ];
    const level = getLevel(this.props.id);
    return (
      <div className={`ruleGroup ${classNames.ruleGroup}`}>
        {(this.props.parentCombinator && (
          <div className="group_operator_label btn--primary">
            <span className="group_operator_parent-text">
              {(this.props.parentCombinator &&
                this.props.parentCombinator.ops &&
                this.props.index > 0 &&
                formatMessage({
                  id: `QueryBuilder.${this.props.parentCombinator.ops}`,
                })) ||
                formatMessage({
                  id: 'QueryBuilder.select',
                })}
            </span>
          </div>
        )) || (
          <div className="group_operator_label btn--primary">
            <span className="group_operator_parent-text">
              {formatMessage({
                id: 'QueryBuilder.select',
              })}
            </span>
          </div>
        )}
        <div className="ruleGroup__actions">
          <div className="ruleGroup__actions-selector">
            <CombinatorsGroup
              combinators={combinators}
              combinator={combinator}
            />
          </div>
          <div className="ruleGroup__actions-wrapper">
            <ActionElement
              id={translations.addRule.id}
              label={translations.addRule.label}
              title={translations.addRule.title}
              className={`ruleGroup-addRule ${classNames.addRule}`}
              handleOnClick={this.addRule}
              rules={rules}
              level={level}
            />
            <ActionElement
              id={translations.addGroup.id}
              label={translations.addGroup.label}
              title={translations.addGroup.title}
              className={`ruleGroup-addGroup ${classNames.addGroup}`}
              handleOnClick={this.addGroup}
              rules={rules}
              level={level}
              disabled={level === 2}
            />
            {this.hasParentGroup() ? (
              <ActionElement
                id={translations.removeGroup.id}
                label={translations.removeGroup.label}
                title={translations.removeGroup.title}
                className={`ruleGroup-remove ${classNames.removeGroup}`}
                handleOnClick={this.removeGroup}
                rules={rules}
                level={level}
              />
            ) : null}
          </div>
        </div>
        <div className="ruleGroup__children">
          {rules.map(
            (r, index) =>
              r.isGroup ? (
                <Fragment key={index}>
                  <RuleGroup
                    intl={this.props.intl}
                    key={r.id}
                    id={r.id}
                    index={index}
                    schema={this.props.schema}
                    parentId={this.props.id}
                    parentCombinator={this.props.combinator}
                    combinator={r.combinator}
                    translations={this.props.translations}
                    rules={r.rules}
                    onRuleChange={onRuleChange}
                    findRuleById={this.findRule}
                    lastRuleId={this.props.lastRuleId}
                  />
                </Fragment>
              ) : (
                <Rule
                  key={r.id}
                  id={r.id}
                  index={index}
                  field={r.field}
                  value={r.value}
                  ops={r.ops}
                  schema={this.props.schema}
                  parentId={this.props.id}
                  translations={this.props.translations}
                  onRuleRemove={onRuleRemove}
                  onRuleChange={onRuleChange}
                  combinator={combinator}
                  findRuleById={this.findRule}
                  lastRuleId={this.props.lastRuleId}
                />
              )
          )}
        </div>
      </div>
    );
  }
}

RuleGroup.propTypes = {
  intl: intlShape,
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  index: PropTypes.number,
  onRuleChange: PropTypes.func.isRequired,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      field: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
        PropTypes.shape({
          startDate: PropTypes.instanceOf(moment),
          endDate: PropTypes.instanceOf(moment),
        }),
      ]),
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
      ]),
      ops: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string,
          label: PropTypes.string,
        }),
      ]),
    })
  ),
  translations: PropTypes.shape({
    fields: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    operators: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    value: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    removeRule: PropTypes.shape({
      title: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
    removeGroup: PropTypes.shape({
      title: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
    addRule: PropTypes.shape({
      title: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
    addGroup: PropTypes.shape({
      title: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  combinator: PropTypes.shape({
    ops: PropTypes.string.isRequired,
    not: PropTypes.bool.isRequired,
  }).isRequired,
  parentCombinator: PropTypes.shape({
    ops: PropTypes.string.isRequired,
    not: PropTypes.bool.isRequired,
  }),
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
    }),
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

RuleGroup.defaultProps = {
  intl: {},
  rules: [],
  parentId: null,
  index: 0,
  parentCombinator: {
    ops: '',
    not: false,
  },
};

export default injectIntl(RuleGroup, { withRef: true });
