import classnames from 'classnames';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Svg from 'components/Svg';

const propTypes = {
  isCurrent: PropTypes.bool.isRequired,
  item: PropTypes.shape({
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
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

class TwitterExpandedProfileItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAvatarExist: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { item: { avatar } } = this.props;

    if (avatar.length > 0) {
      fetch(avatar).then(response => {
        if (response.status === 200) {
          this.setState({ isAvatarExist: true });
        }
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.isCurrent !== nextProps.isCurrent ||
      this.state.isAvatarExist !== nextState.isAvatarExist
    );
  }

  handleChange() {
    const { item, onChange } = this.props;

    onChange(item);
  }

  render() {
    const {
      isCurrent,
      item: { avatar, login, name, order, tweets },
    } = this.props;
    const { isAvatarExist } = this.state;
    const handleKeyDown = event => {
      if (event.keyCode === keycode('enter')) {
        this.handleChange();
      }
    };
    const twitterProfileItem = classnames('c-twitter-profile__item', {
      'is-selected': isCurrent,
    });

    return (
      <div className={twitterProfileItem}>
        <div
          className="c-twitter-profile__frame"
          onClick={this.handleChange}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          <div className="c-twitter-profile__left-col">
            <div className="c-twitter-profile__order">{order}</div>
            <div className="c-twitter-profile__ordinal">
              <FormattedMessage id="Twitter.order" values={{ order }} />
            </div>
          </div>
          <div className="c-twitter-profile__main-col">
            <div className="c-twitter-profile__wrap-img">
              {isAvatarExist ? (
                <img alt="" height="150" src={avatar} width="150" />
              ) : (
                <Svg icon="user" />
              )}
            </div>
          </div>
          <div className="c-twitter-profile__right-col">
            <div className="c-twitter-profile__count">{tweets.length}</div>
            <div className="c-twitter-profile__tweet">
              <FormattedMessage
                id="Twitter.tweet"
                values={{ numTweets: tweets.length }}
              />
            </div>
          </div>
        </div>
        <div className="c-twitter-profile__name">{name}</div>
        <div className="c-twitter-profile__login">{login}</div>
      </div>
    );
  }
}

TwitterExpandedProfileItem.propTypes = propTypes;
export default TwitterExpandedProfileItem;
