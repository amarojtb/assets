import React from 'react';
import PropTypes from 'prop-types';
import Widget, { widgetPropTypes } from 'components/Widget';
import WordCloud from './WordCloud';

const propTypes = {
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

const WordCloudWidget = ({ params: { data }, widget }) => (
  <Widget widget={widget}>
    {data == null ? null : (
      <WordCloud data={data} id={`wordcloud-${widget.id}`} range={[10, 40]} />
    )}
  </Widget>
);

WordCloudWidget.propTypes = propTypes;
export default WordCloudWidget;
