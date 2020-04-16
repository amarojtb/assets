import React, { Component } from 'react';
import { isBase64 } from 'services/AppUtils';
import PropTypes from 'prop-types';
import Svg from 'components/Svg/Svg';

const propTypes = {
  item: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
  }).isRequired,
};

class TwitterWidgetItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAvatarExist: false,
    };
  }

  componentWillMount() {
    const { item } = this.props;

    if (item.avatar.length > 0) {
      if (isBase64(item.avatar)) {
        this.setState({ isAvatarExist: true });
      } else {
        fetch(item.avatar).then(response => {
          this.setState({ isAvatarExist: response.status === 200 });
        });
      }
    } else {
      this.setState({ isAvatarExist: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isAvatarExist !== nextState.isAvatarExist;
  }

  render() {
    const { item: { avatar } } = this.props;
    const { isAvatarExist } = this.state;

    return (
      <div className="twitter-widget__item">
        <div className="twitter-widget__img-wrap">
          {isAvatarExist ? (
            <img alt="" height="110" src={avatar} width="110" />
          ) : (
            <svg fill="#555">
              <path
                d="m23.616186,0.00554c0.254744,0 0.509489,0 0.764238,
                0c13.949908,-0.360041 11.816832,19.832854 7.282345,
                29.105622c-0.849152,1.739072 -1.891914,3.413603 -1.725479,
                4.965855c0.658947,6.056173 12.713544,4.568456 15.332334,
                8.121319c1.86814,2.533878 0.757445,0.76084 1.341661,
                5.713108c-15.013052,-0.152847 -30.532197,0.298909 -45.222571,
                -0.227576c0.594408,-4.857161 -0.499303,-2.989018 1.341664,
                -5.485533c2.876936,-3.906115 14.877188,-1.908904 15.328938,
                -8.348889c0.101899,-1.450359 -0.859343,-2.968647 -1.725481,
                -4.738285c-4.806217,-9.833211 -6.382247,-29.489439 7.282351,
                -29.105622l0,0z"
              />
            </svg>
          )}
        </div>
      </div>
    );
  }
}

TwitterWidgetItem.propTypes = propTypes;
export default TwitterWidgetItem;
