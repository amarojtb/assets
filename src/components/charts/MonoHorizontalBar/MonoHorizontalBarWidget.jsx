import PropTypes from 'prop-types';
import React from 'react';
import Widget, { widgetPropTypes } from 'components/Widget';
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
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

const MonoHorizontalBarWidget = ({ params, widget }) => (
  <Widget widget={widget}>
    {params.data == null ? null : <MonoHorizontalBar params={params} />}
  </Widget>
);

MonoHorizontalBarWidget.propTypes = propTypes;
export default MonoHorizontalBarWidget;
