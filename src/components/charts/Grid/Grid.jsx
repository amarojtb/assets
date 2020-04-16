import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderNoDataMessage } from 'components/Widget';
import GridFacebook from './GridFacebook';
import GridMediaImpactScore from './GridMediaImpactScore';
import GridTwitter from './GridTwitter';
import GridLatestArticlesExpanded from './GridLatestArticlesExpanded';
import GridLatestArticles from './GridLatestArticles';
import './Grid.css';

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  expanded: PropTypes.bool.isRequired,
  params: PropTypes.shape({
    segment1OnField: PropTypes.string,
  }).isRequired,

  parentElementId: PropTypes.string.isRequired,
};

class Grid extends Component {
  constructor(props) {
    super(props);

    this.parentElement = document.getElementById(props.parentElementId);

    this.state = {
      width: this.parentElement.offsetWidth,
    };

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({ width: this.parentElement.offsetWidth });
  }

  getRenderBySegment(props) {
    const { params: { segment1OnField } } = this.props;

    switch (segment1OnField) {
      case 'facebookShares':
        return <GridFacebook {...props} />;
      case 'twittertweetid':
        return <GridTwitter {...props} />;
      case 'mediaImpactScore':
        return <GridMediaImpactScore {...props} />;
      case 'latestArticles':
        return props.expanded ? (
          <GridLatestArticlesExpanded {...props} />
        ) : (
          <GridLatestArticles {...props} />
        );
      default:
        return null;
    }
  }

  render() {
    const { data, params: { segment1OnField }, expanded } = this.props;
    const { width } = this.state;
    const gridClassNames = classnames('c-grid', {
      'c-grid--facebook': segment1OnField === 'facebookShares',
      'c-grid--twitter': segment1OnField === 'twittertweetid',
      'c-grid--latest-articles': segment1OnField === 'latestArticles',
    });
    const props = { data, width, expanded };
    const render = this.getRenderBySegment(props);

    return render === null ? (
      renderNoDataMessage()
    ) : (
      <div className={gridClassNames}>{this.getRenderBySegment(props)}</div>
    );
  }
}

Grid.propTypes = propTypes;
export default Grid;
