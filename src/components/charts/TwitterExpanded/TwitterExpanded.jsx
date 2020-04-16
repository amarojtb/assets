import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  FormattedMessage,
  FormattedNumber,
  injectIntl,
  intlShape,
} from 'react-intl';
import Alert from 'components/Alert';
import Expanded from 'components/Expanded';
import Scroll from 'components/Scroll';
import Svg from 'components/Svg';
import { widgetPropTypes } from 'components/Widget';
import TwitterExpandedProfileItem from './TwitterExpandedProfileItem';
import TwitterExpandedTonalityItem from './TwitterExpandedTonalityItem';
import TwitterExpandedTweetItem from './TwitterExpandedTweetItem';
import './TwitterExpanded.css';

const propTypes = {
  intl: intlShape.isRequired,
  params: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        followers: PropTypes.number.isRequired,
        login: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
        tweets: PropTypes.arrayOf(
          PropTypes.shape({
            date: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            message: PropTypes.string.isRequired,
            tonality: PropTypes.number.isRequired,
          })
        ).isRequired,
      })
    ),
  }).isRequired,
  widget: widgetPropTypes.isRequired,
};

class TwitterExpanded extends Component {
  static renderSidebarHeader() {
    return (
      <div className="c-twitter-expanded__header">
        <Svg className="c-expanded__icon m-right--large" icon="twitter" />
        <div className="c-expanded-sidebar__title">
          <div className="c-twitter-expanded__title">
            <FormattedMessage id="Twitter.title" />
          </div>
          <div className="c-twitter-expanded__subtitle">
            <FormattedMessage id="Twitter.subtitle" />
          </div>
        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      currentProfile: props.params.data == null ? null : props.params.data[0],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps({ params: { data } }) {
    if (data != null) {
      this.setState({ currentProfile: data[0] });
    }
  }

  getTonalities() {
    const { intl: { formatMessage } } = this.props;
    const { currentProfile: { tweets } } = this.state;
    const balanced = {
      id: 'balanced',
      name: formatMessage({ id: 'Global.balanced' }),
      value: 0,
    };
    const negative = {
      id: 'negative',
      name: formatMessage({ id: 'Global.negative' }),
      value: 0,
    };
    const neutral = {
      id: 'neutral',
      name: formatMessage({ id: 'Global.neutral' }),
      value: 0,
    };
    const notanalyzed = {
      id: 'notanalyzed',
      name: formatMessage({ id: 'Global.notanalyzed' }),
      value: 0,
    };
    const positive = {
      id: 'positive',
      name: formatMessage({ id: 'Global.positive' }),
      value: 0,
    };

    tweets.forEach(({ tonality }) => {
      if (tonality === -1) {
        negative.value += 1;
      } else if (tonality === 0) {
        neutral.value += 1;
      } else if (tonality === 1) {
        positive.value += 1;
      } else if (tonality === 2) {
        balanced.value += 1;
      } else if (tonality === 3) {
        notanalyzed.value += 1;
      }
    });

    return [positive, balanced, negative, neutral, notanalyzed];
  }

  handleChange(profile) {
    this.setState({ currentProfile: profile });
  }

  renderMainHeader() {
    const { currentProfile } = this.state;
    const { followers, login, name, order } = currentProfile;

    return currentProfile == null ? null : (
      <div className="c-expanded__title">
        <div className="c-twitter-header">
          <span className="c-twitter-header__order">{order}</span>
          <div className="c-twitter-header__profile">
            <div className="c-twitter-header__name">{name}</div>
            <div className="c-twitter-header__login">{login}</div>
          </div>
          {followers >= 0 ? (
            <div className="c-twitter-header__nb-followers">
              <FormattedNumber value={followers} />{' '}
              <FormattedMessage id="Twitter.followers" />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  renderSidebarBody() {
    const { params } = this.props;
    const { currentProfile } = this.state;

    return currentProfile == null ? null : (
      <Scroll>
        <div className="c-twitter-profile">
          {params.data
            .slice(0, 10)
            .map(item => (
              <TwitterExpandedProfileItem
                isCurrent={currentProfile.login === item.login}
                item={item}
                key={item.login}
                onChange={this.handleChange}
              />
            ))}
        </div>
      </Scroll>
    );
  }

  render() {
    const { params: { data }, widget } = this.props;
    const { currentProfile } = this.state;

    return (
      <Expanded
        mainHeader={data == null ? null : this.renderMainHeader()}
        name="twitter"
        onToggleChart={this.handleToggleChart}
        sidebarBody={this.renderSidebarBody()}
        sidebarHeader={TwitterExpanded.renderSidebarHeader()}
        widget={widget}
      >
        {currentProfile == null ? null : (
          <div className="u-full-height">
            <Scroll>
              <div className="c-twitter-tweet__layout">
                {currentProfile.tweets.length > 0 ? (
                  currentProfile.tweets.map(item => (
                    <TwitterExpandedTweetItem item={item} key={item.id} />
                  ))
                ) : (
                  <Alert type="info">
                    <FormattedMessage id="Twitter.emptyTweet" />
                  </Alert>
                )}
              </div>
            </Scroll>
            <div className="c-twitter-tonality">
              <div className="c-twitter-tonality__layout">
                {this.getTonalities().map(item => (
                  <TwitterExpandedTonalityItem item={item} key={item.id} />
                ))}
              </div>
            </div>
          </div>
        )}
      </Expanded>
    );
  }
}

TwitterExpanded.propTypes = propTypes;
export default injectIntl(TwitterExpanded);
