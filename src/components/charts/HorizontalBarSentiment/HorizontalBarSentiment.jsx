import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HorizontalBarSentimentItem from './HorizontalBarSentimentItem';
import uuid from 'uuid';
import './HorizontalBarSentiment.css';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      negative: PropTypes.number.isRequired,
      neutral: PropTypes.number.isRequired,
      positive: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  onItemClick: PropTypes.func,
};
const defaultProps = {
  onItemClick: null,
};

class HorizontalBarSentiment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedKey: '',
      sentiment: '',
    };

    this.handleSentimentItemClick = this.handleSentimentItemClick.bind(this);
    this.onCloseExpandedModal = this.onCloseExpandedModal.bind(this);
  }

  componentWillMount() {
    document.addEventListener('closeLightbox', this.onCloseExpandedModal);
  }

  componentWillUnmount() {
    document.removeEventListener('closeLightbox', this.onCloseExpandedModal);
  }

  onCloseExpandedModal() {
    this.setState({
      selectedKey: '',
      sentiment: '',
    });
  }

  handleSentimentItemClick(item, sentiment) {
    const { onItemClick } = this.props;

    this.setState({
      selectedKey: item.key,
      sentiment,
    });

    if (onItemClick != null) {
      onItemClick(item, sentiment);
    }
  }

  renderItem(item, index) {
    const { selectedKey, sentiment } = this.state;

    return (
      <HorizontalBarSentimentItem
        index={index + 1}
        item={item}
        key={`${item.key}${uuid()}`}
        onClick={this.handleSentimentItemClick}
        selectedKey={selectedKey}
        sentiment={sentiment}
      />
    );
  }

  render() {
    const { data } = this.props;

    return (
      <div className="horizontal-bar-sentiment">
        {data.map((item, index) => this.renderItem(item, index))}
      </div>
    );
  }
}

HorizontalBarSentiment.defaultProps = defaultProps;
HorizontalBarSentiment.propTypes = propTypes;
export default HorizontalBarSentiment;
