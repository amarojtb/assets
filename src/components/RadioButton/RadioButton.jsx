import React from 'react';
import PropTypes from 'prop-types';
import './RadioButton.css';

const propTypes = {
  combinator: PropTypes.shape({
    ops: PropTypes.string.isRequired,
    not: PropTypes.bool.isRequired,
  }).isRequired,
  combinators: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      handleClick: PropTypes.func.isRequired,
      disabled: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      buttonClassNames: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      checked: PropTypes.string,
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

class RadioButton extends React.Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { combinators, combinator } = this.props;
    const control = combinators.filter(
      item => item.name === event.target.getAttribute('name')
    )[0];

    if (control) {
      const value = {
        ops: control.name,
        not: combinator.not,
      };

      control.handleClick(value);
    }
  }
  render() {
    const { combinators, combinator } = this.props;
    return (
      <div className="radio--button">
        {combinators.map(control => (
          <button
            key={control.name}
            type="button"
            className={`btn btn--primary ${
              control.name === combinator.ops ? '' : 'inverted'
            }`}
            disabled={control.disabled}
            onClick={this.handleClick}
            name={control.name}
          >
            {control.title}
          </button>
        ))}
      </div>
    );
  }
}

RadioButton.defaultProps = defaultProps;
RadioButton.propTypes = propTypes;
export default RadioButton;
