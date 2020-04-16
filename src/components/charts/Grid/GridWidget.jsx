import PropTypes from 'prop-types';
import React from 'react';
import Widget, { widgetPropTypes } from 'components/Widget';
import Grid from './Grid';

const propTypes = {
  options: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

const GridWidget = ({ options: { data, expanded }, widget }) => {
  const { id, jsonParameters } = widget;

  return (
    <Widget widget={widget}>
      {data == null ? null : (
        <Grid
          data={data}
          expanded={expanded}
          params={jsonParameters}
          parentElementId={id}
        />
      )}
    </Widget>
  );
};

GridWidget.propTypes = propTypes;
export default GridWidget;
