import PropTypes from 'prop-types';
import React from 'react';
import Expanded from 'components/Expanded/Expanded';
import { widgetPropTypes } from 'components/Widget/Widget';
import MonoHorizontalBar from './MonoHorizontalBar';

const propTypes = {
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ),
    showNumber: PropTypes.bool.isRequired,
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

const MonoHorizontalBarExpanded = ({ params, widget }) => (
  <Expanded
    hasSidebar={false}
    icon="mono-horizontal-bar"
    name="mono-horizontal-bar"
    widget={widget}
  >
    {params.data == null ? null : <MonoHorizontalBar params={params} />}
  </Expanded>
);

MonoHorizontalBarExpanded.propTypes = propTypes;
export default MonoHorizontalBarExpanded;
