import PropTypes from 'prop-types';
import React from 'react';
import Widget, { widgetPropTypes } from 'components/Widget/Widget';
import KeyFigure from './KeyFigure';

const propTypes = {
  params: PropTypes.shape({
    label: PropTypes.string,
    number: PropTypes.string.isRequired,
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

const KeyFigureWidget = ({ params, widget }) => {
  const { number } = params;
  const { jsonParameters: { indicator }, name } = widget;

  return (
    <Widget
      className={
        indicator === 'weightedAve' ? 'widget--key-figure-weighted-ave' : null
      }
      widget={widget}
    >
      {number == null ? null : <KeyFigure label={name} {...params} />}
    </Widget>
  );
};

KeyFigureWidget.propTypes = propTypes;
export default KeyFigureWidget;
