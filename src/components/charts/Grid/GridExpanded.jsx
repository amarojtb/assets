import Expanded from 'components/Expanded';
import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'components/Scroll';
import { widgetPropTypes } from 'components/Widget';
import Grid from './Grid';

const propTypes = {
  options: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

const GridExpanded = ({ options: { data, expanded }, widget }) => {
  const { id, jsonParameters } = widget;
  const getIconBySegment = () => {
    const { segment1OnField } = jsonParameters;

    switch (segment1OnField) {
      case 'facebookShares':
        return 'widget-facebook';
      case 'twittertweetid':
        return 'twitter';
      case 'mediaImpactScore':
        return null;
      case 'latestArticles':
        return 'word-cloud';
      default:
        return null;
    }
  };

  return (
    <Expanded
      hasSidebar={false}
      icon={getIconBySegment()}
      name="grid"
      widget={widget}
    >
      {data == null ? null : (
        <Scroll>
          <div className="p-vertical--x-small">
            <Grid
              data={data}
              params={jsonParameters}
              parentElementId={`expanded-${id}`}
              expanded={expanded}
            />
          </div>
        </Scroll>
      )}
    </Expanded>
  );
};

GridExpanded.propTypes = propTypes;
export default GridExpanded;
