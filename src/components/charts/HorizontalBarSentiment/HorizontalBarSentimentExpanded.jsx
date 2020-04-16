import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import ClipActionCreators from 'actions/ClipActionCreators';
import Button from 'components/Button/Button';
import Expanded from 'components/Expanded/Expanded';
import Loader from 'components/Loader/Loader';
import Scroll from 'components/Scroll/Scroll';
import { widgetPropTypes } from 'components/Widget/Widget';
import ClipStore from 'stores/ClipStore';
import parameters from 'constants/parameters';
import HorizontalBarSentiment from './HorizontalBarSentiment';
import HorizontalBarSentimentClipItem from './HorizontalBarSentimentClipItem';

const propTypes = {
  getSearchModel: PropTypes.func,
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
const defaultProps = {
  getSearchModel: null,
};
const { FACET_ITEM_KEY_SEPARATOR } = parameters;

class HorizontalBarSentimentExpanded extends Component {
  static renderItem(clipId) {
    return <HorizontalBarSentimentClipItem clipId={clipId} key={clipId} />;
  }

  constructor(props) {
    super(props);

    this.label = '';
    this.sentiment = '';
    this.skip = 0;
    this.total = 0;

    this.state = {
      clipIds: [],
      loading: false,
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleMoreClick = this.handleMoreClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onGetNextClips = this.onGetNextClips.bind(this);
  }

  componentWillMount() {
    ClipStore.addChangeListener(this.onChange);
    ClipStore.addGetNextClipsListener(this.onGetNextClips);
  }

  componentWillReceiveProps() {
    this.label = '';
    this.skip = 0;
    this.setState({ clipIds: [] });
    document.dispatchEvent(
      new CustomEvent('closeLightbox', {
        detail: {
          id: 'dashboard-lightbox',
        },
      })
    );
  }

  componentWillUnmount() {
    ClipStore.removeChangeListener(this.onChange);
    ClipStore.removeGetNextClipsListener(this.onGetNextClips);
  }

  onChange(clipIds) {
    this.skip += clipIds.length;
    this.setState({
      clipIds,
      loading: false,
    });
  }

  onGetNextClips(newClipIds) {
    const { clipIds } = this.state;

    this.skip += newClipIds.length;
    this.setState({
      clipIds: [...clipIds, ...newClipIds],
      loading: false,
    });
  }

  handleItemClick(item, sentiment) {
    if (this.label !== item.label || this.sentiment !== sentiment) {
      const { getSearchModel } = this.props;
      const searchModel = getSearchModel();
      searchModel.searchModel.groupBy = '';
      const scroll = document.querySelector(
        '.c-expanded-main__body .scrollable--y'
      );

      this.label = item.label;
      this.sentiment = sentiment;
      this.skip = 0;
      this.total = item[sentiment];
      if (scroll) scroll.scrollTop = 0;
      this.setState({ loading: true });
      ClipActionCreators.getClips({
        ...searchModel,
        ...{
          facetsSelected: [
            ...searchModel.facetsSelected,
            `source.name.untouched${FACET_ITEM_KEY_SEPARATOR + this.label}`,
            `sentiment.level${FACET_ITEM_KEY_SEPARATOR + this.sentiment}`,
          ],
        },
      });
    }
  }

  handleMoreClick() {
    const { getSearchModel } = this.props;
    const searchModel = getSearchModel();

    this.setState({ loading: true });
    ClipActionCreators.getNextClips({
      ...searchModel,
      ...{
        facetsSelected: [
          ...searchModel.facetsSelected,
          `source.name.untouched${FACET_ITEM_KEY_SEPARATOR + this.label}`,
          `sentiment.level${FACET_ITEM_KEY_SEPARATOR + this.sentiment}`,
        ],
        searchModel: {
          ...searchModel.searchModel,
          ...{ skip: this.skip },
        },
      },
    });
  }

  renderDefaultMessage() {
    const { loading } = this.state;

    return (
      <div className="u-position--relative u-full-height">
        {loading && <Loader />}
        <div
          className="horizontal-bar-sentiment-expanded-default-message
          u-position--absolute text-align--center text-uppercase"
        >
          <div className="text-bold">
            <FormattedMessage id="HorizontalBarSentimentExpanded.defaultMessageTextStrong" />
          </div>

          <div className="text-thin">
            <FormattedMessage id="HorizontalBarSentimentExpanded.defaultMessageText" />
          </div>
        </div>
      </div>
    );
  }

  renderList() {
    const { clipIds, loading } = this.state;

    return (
      <Scroll>
        {loading ? <Loader /> : null}
        {clipIds.map(clipId =>
          HorizontalBarSentimentExpanded.renderItem(clipId)
        )}
        {this.total > this.skip ? (
          <Button
            className="horizontal-bar-sentiment-expanded-button-more u-full-width"
            onClick={this.handleMoreClick}
            type="default"
          >
            <FormattedMessage id="HorizontalBarSentimentExpanded.seeMoreButton" />
          </Button>
        ) : null}
      </Scroll>
    );
  }

  renderMainBody() {
    const { clipIds } = this.state;

    return clipIds.length > 0 ? this.renderList() : this.renderDefaultMessage();
  }

  renderSidebarBody() {
    const { params: { data } } = this.props;
    return (
      <HorizontalBarSentiment
        data={data}
        onItemClick={this.handleItemClick}
        selectedKey={this.selectedKey}
      />
    );
  }

  render() {
    const { widget } = this.props;

    return (
      <Expanded
        icon="horizontal-bar-sentiment"
        name="horizontal-bar-sentiment"
        sidebarBody={this.renderSidebarBody()}
        widget={widget}
      >
        {this.renderMainBody()}
      </Expanded>
    );
  }
}

HorizontalBarSentimentExpanded.defaultProps = defaultProps;
HorizontalBarSentimentExpanded.propTypes = propTypes;
export default HorizontalBarSentimentExpanded;
