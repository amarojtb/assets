import PropTypes from 'prop-types';
import React from 'react';
import TagsInput from 'react-tagsinput';
import './InputTags.css';

const propTypes = {
  placeholder: PropTypes.string,
};
const defaultProps = {
  placeholder: null,
};

const InputTags = props => {
  const inputProps = { className: 'c-input-tags__input' };
  const tagProps = {
    className: 'c-input-tags__tag',
    classNameRemove: 'c-input-tags__remove',
  };

  if (props.placeholder != null) {
    inputProps.placeholder = props.placeholder;
  }

  return (
    <TagsInput
      addOnBlur
      className="c-input-tags"
      focusedClassName="has-focus"
      inputProps={inputProps}
      tagProps={tagProps}
      {...props}
    />
  );
};

InputTags.defaultProps = defaultProps;
InputTags.propTypes = propTypes;
export default InputTags;
