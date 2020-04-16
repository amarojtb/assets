import PropTypes from 'prop-types';
import React from 'react';
import Widget, { widgetPropTypes } from 'components/Widget/Widget';
import HorizontalBarSentiment from './HorizontalBarSentiment';

const propTypes = {
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        negative: PropTypes.number.isRequired,
        neutral: PropTypes.number.isRequired,
        positive: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

const HorizontalBarSentimentWidget = ({ params: { data }, widget }) => (
  <Widget widget={widget}>
    {data == null ? null : <HorizontalBarSentiment data={data} />}
  </Widget>
);

HorizontalBarSentimentWidget.propTypes = propTypes;
export default HorizontalBarSentimentWidget;
