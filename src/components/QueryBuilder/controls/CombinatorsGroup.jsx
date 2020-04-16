import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'uuid/v4';
import RadioButton from '../../RadioButton/RadioButton';

const propTypes = {
  combinator: PropTypes.shape({
    ops: PropTypes.string.isRequired,
    not: PropTypes.bool.isRequired,
  }).isRequired,
  combinators: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      handleClick: PropTypes.func,
      disabled: PropTypes.bool,
      name: PropTypes.string,
      buttonClassNames: PropTypes.string,
      title: PropTypes.string,
      checked: PropTypes.string,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string,
          handleClick: PropTypes.func,
          disabled: PropTypes.bool,
          name: PropTypes.string,
          buttonClassNames: PropTypes.string,
          title: PropTypes.string,
          checked: PropTypes.string,
        })
      ),
    })
  ),
};

const defaultProps = {
  combinators: [
    {
      checked: 'checked',
    },
  ],
};

class CombinatorsGroup extends React.Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }
  onClick(event) {
    const { combinators, combinator } = this.props;
    const control = combinators.filter(
      item => item.name === event.target.getAttribute('name')
    )[0];
    if (control) {
      const value = {
        ops: combinator.ops,
        not: !combinator.not,
      };

      control.handleClick(value);
    }
  }
  render() {
    const { combinators, combinator } = this.props;
    return (
      <Fragment>
        {combinators.map(control => {
          switch (control.type) {
            case 'button':
              return (
                <button
                  key={uniqueId()}
                  type="button"
                  className={`btn btn--primary ${
                    combinator && combinator.not ? '' : 'inverted'
                  }`}
                  disabled={control.disabled}
                  onClick={this.onClick}
                  name={control.name}
                >
                  {control.title}
                </button>
              );
            default:
              return (
                <RadioButton
                  key={uniqueId()}
                  combinators={control.children}
                  combinator={combinator || {}}
                />
              );
          }
        })}
      </Fragment>
    );
  }
}

CombinatorsGroup.defaultProps = defaultProps;
CombinatorsGroup.propTypes = propTypes;
export default CombinatorsGroup;
