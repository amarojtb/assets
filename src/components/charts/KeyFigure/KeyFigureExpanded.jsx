import PropTypes from 'prop-types';
import React from 'react';
import Expanded from 'components/Expanded/Expanded';
import { widgetPropTypes } from 'components/Widget/Widget';
import KeyFigure from './KeyFigure';

const propTypes = {
  params: PropTypes.shape({
    label: PropTypes.string,
    segment1OnField: PropTypes.string,
    number: PropTypes.string.isRequired,
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

const KeyFigureExpanded = ({
  params: { label, number, indicator, segment1OnField },
  widget,
}) => (
  <Expanded
    hasMainHeader={false}
    hasSidebar={false}
    icon="key-figure"
    name="key-figure"
    widget={widget}
  >
    {number == null ? null : (
      <KeyFigure
        label={widget.name}
        number={number}
        indicator={indicator}
        segment1OnField={segment1OnField}
      />
    )}
  </Expanded>
);

KeyFigureExpanded.propTypes = propTypes;
export default KeyFigureExpanded;
