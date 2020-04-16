import uniqueId from 'uuid/v4';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import RuleGroup from './RuleGroup';
import './query-builder.css';

import { ActionElement, ValueEditor, ValueSelector } from './controls/index';

export default class QueryBuilder extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      root: {
        rules: [],
      },
      schema: {},
    };
  }

  static get defaultTranslations() {
    return {
      fields: {
        title: 'Fields',
      },
      operators: {
        title: 'Operators',
      },
      value: {
        title: 'Value',
      },
      removeRule: {
        id: 'remove',
        label: 'Remove',
        title: 'Remove rule',
      },
      removeGroup: {
        id: 'removeGroup',
        label: 'Remove',
        title: 'Remove group',
      },
      addRule: {
        id: 'addRule',
        label: 'Add Rule',
        title: 'Add rule',
      },
      addGroup: {
        id: 'addGroup',
        label: 'Add Group',
        title: 'Add group',
      },
    };
  }

  static get defaultOperators() {
    return [
      /* { name: 'null', label: 'Is Null' },
      { name: 'notNull', label: 'Is Not Null' },
      { name: 'in', label: 'In' },
      { name: 'notIn', label: 'Not In' },
      { name: '=', label: '=' },
      { name: '!=', label: '!=' }, */
      /* { name: '<', label: '<' },
      { name: '>', label: '>' },
      { name: '<=', label: '<=' },
      { name: '>=', label: '>=' }, */
    ];
  }

  static get defaultControlClassnames() {
    return {
      queryBuilder: '',

      ruleGroup: '',
      addRule: '',
      addGroup: '',
      removeGroup: '',

      rule: '',
      fields: '',
      operators: '',
      value: '',
      removeRule: '',
    };
  }

  static get defaultControlElements() {
    return {
      addGroupAction: ActionElement,
      removeGroupAction: ActionElement,
      addRuleAction: ActionElement,
      removeRuleAction: ActionElement,
      combinatorSelector: ValueSelector,
      fieldSelector: ValueSelector,
      operatorSelector: ValueSelector,
      valueEditor: ValueEditor,
    };
  }

  componentWillMount() {
    const {
      fields,
      operators,
      controlElements,
      controlClassnames,
    } = this.props;
    const classNames = Object.assign(
      {},
      QueryBuilder.defaultControlClassnames,
      controlClassnames
    );
    const controls = Object.assign(
      {},
      QueryBuilder.defaultControlElements,
      controlElements
    );

    this.setState({
      root: this.getInitialQuery(),
      schema: {
        fields,
        operators,
        classNames,
        createRule: this.createRule.bind(this),
        createRuleGroup: this.createRuleGroup.bind(this),
        onRuleAdd: this.notifyQueryChange.bind(this, this.onRuleAdd),
        onGroupAdd: this.notifyQueryChange.bind(this, this.onGroupAdd),
        onRuleRemove: this.notifyQueryChange.bind(this, this.onRuleRemove),
        onGroupRemove: this.notifyQueryChange.bind(this, this.onGroupRemove),
        onPropChange: this.notifyQueryChange.bind(this, this.onPropChange),
        getLevel: this.getLevel.bind(this),
        isRuleGroup: this.isRuleGroup.bind(this),
        controls,
        lastRuleId: null,
        getOperators: (...args) => this.getOperators(...args),
      },
    });
  }

  componentDidMount() {
    this.notifyQueryChange(null);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      schema: {
        ...this.state.schema,
        fields: nextProps.fields,
      },
      root: (nextProps.query &&
        nextProps.query !== 'null' &&
        nextProps.query) || {
        id: 'g-973e5cc7-8cc3-42a1-b845-71c32ea163df}',
        isGroup: true,
        rules: [
          {
            id: 'r-6c54e175-4d91-4fb6-9220-064909e9822e',
            field: '',
            value: '',
            ops: null,
          },
        ],
        combinator: { ops: 'and', not: false },
      },
    });
  }

  onRuleAdd(rule, parentId) {
    if (parentId) {
      const parent = this.findRule(parentId, this.state.root);
      parent.rules.unshift(rule);
    } else {
      this.state.root.rules.unshift(rule);
    }
    this.setState({
      root: this.state.root,
      lastRuleId: rule.id,
    });
  }

  onGroupAdd(group, parentId) {
    const parent = this.findRule(parentId, this.state.root);
    parent.rules.push(group);

    this.setState({
      root: this.state.root,
      lastRuleId: group.rules[0].id,
    });
  }

  onPropChange(prop, value, ruleId) {
    const rule = this.findRule(ruleId, this.state.root);
    const ruleValue = rule.field;
    Object.assign(rule, { [prop]: value });

    if (
      ['null', 'notNull'].includes(value) ||
      (prop === 'field' && ruleValue !== value)
    ) {
      rule.value = '';
    }

    this.setState({ root: this.state.root });
  }

  onRuleRemove(ruleId, parentId) {
    const parent = this.findRule(parentId, this.state.root);
    const index = parent.rules.findIndex(x => x.id === ruleId);

    parent.rules.splice(index, 1);
    this.setState({ root: this.state.root });
  }

  onGroupRemove(groupId, parentId) {
    const parent = this.findRule(parentId, this.state.root);
    const index = parent.rules.findIndex(x => x.id === groupId);

    parent.rules.splice(index, 1);
    this.setState({ root: this.state.root });
  }

  getInitialQuery() {
    return this.props.query || this.createRuleGroup();
  }

  getOperators(field) {
    if (this.props.getOperators) {
      const ops = this.props.getOperators(field);
      if (ops) {
        return ops;
      }
    }

    return this.props.operators;
  }

  getLevel(id) {
    return this.getRecursiveLevel(id, 0, this.state.root);
  }

  getRecursiveLevel(id, index, root) {
    const { isRuleGroup } = this.state.schema;

    let foundAtIndex = -1;
    if (root.id === id) {
      foundAtIndex = index;
    } else if (isRuleGroup(root)) {
      root.rules.forEach(rule => {
        if (foundAtIndex === -1) {
          let indexForRule = index;
          if (isRuleGroup(rule)) indexForRule += 1;
          foundAtIndex = this.getRecursiveLevel(id, indexForRule, rule);
        }
      });
    }
    return foundAtIndex;
  }

  createRuleGroup() {
    const rule = this.createRule();
    return {
      id: `g-${uniqueId()}}`,
      isGroup: true,
      rules: [rule],
      combinator: {
        ops: 'and',
        not: false,
      },
    };
  }

  isRuleGroup(rule) {
    return !!(rule.combinator && rule.rules);
  }

  createRule() {
    const { fields, operators } = this.props;
    return {
      id: `r-${uniqueId()}`,
      field: '',
      value: '',
      ops: '',
    };
  }

  findRule(id, parent) {
    const { isRuleGroup } = this.state.schema;

    if (parent.id === id) {
      return parent;
    }

    for (const rule of parent.rules) {
      if (rule.id === id) {
        return rule;
      } else if (isRuleGroup(rule)) {
        const subRule = this.findRule(id, rule);
        if (subRule) {
          return subRule;
        }
      }
    }
    return null;
  }

  notifyQueryChange(fn, ...args) {
    if (fn) {
      fn.call(this, ...args);
    }

    const { onQueryChange } = this.props;
    if (onQueryChange) {
      const query = JSON.parse(JSON.stringify(this.state.root));
      onQueryChange(query);
    }
  }

  render() {
    const {
      root: { id, rules, combinator },
      schema,
      lastRuleId,
    } = this.state;
    const { translations, onRuleChange } = this.props;

    return (
      <div className={`queryBuilder ${schema.classNames.queryBuilder}`}>
        <RuleGroup
          translations={translations}
          rules={rules}
          combinator={combinator}
          schema={schema}
          query={this.state.root}
          id={id}
          parentId={null}
          onRuleChange={onRuleChange}
          lastRuleId={lastRuleId}
        />
      </div>
    );
  }
}

QueryBuilder.defaultProps = {
  operators: QueryBuilder.defaultOperators,
  translations: QueryBuilder.defaultTranslations,
  controlElements: null,
  getOperators: null,
  onQueryChange: null,
  controlClassnames: null,
};

QueryBuilder.propTypes = {
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
  ),
  controlElements: PropTypes.shape({
    addGroupAction: PropTypes.func,
    removeGroupAction: PropTypes.func,
    addRuleAction: PropTypes.func,
    removeRuleAction: PropTypes.func,
    combinatorSelector: PropTypes.func,
    fieldSelector: PropTypes.func,
    operatorSelector: PropTypes.func,
    valueEditor: PropTypes.func,
  }),
  getOperators: PropTypes.func,
  onQueryChange: PropTypes.func,
  controlClassnames: PropTypes.shape({
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
  }),
};
