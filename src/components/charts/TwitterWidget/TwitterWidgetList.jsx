import PropTypes from 'prop-types';
import React from 'react';
import TwitterWidgetItem from './TwitterWidgetItem';

const propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAllImagesLoaded: PropTypes.func,
};
const defaultProps = {
  onAllImagesLoaded: null,
};

class TwitterWidgetList extends React.Component {
  constructor(props) {
    super(props);

    this.refListElement = this.refListElement.bind(this);
  }

  componentDidMount() {
    const { onAllImagesLoaded } = this.props;
    const imgElements = this.listElement.querySelectorAll('img');

    if (typeof onAllImagesLoaded === 'function') {
      onAllImagesLoaded(imgElements);
    }
  }

  refListElement(ref) {
    this.listElement = ref;
  }

  render() {
    const { list } = this.props;

    return (
      <div className="twitter-widget__right-col" ref={this.refListElement}>
        {list.map(item => <TwitterWidgetItem item={item} key={item.login} />)}
      </div>
    );
  }
}

TwitterWidgetList.defaultProps = defaultProps;
TwitterWidgetList.propTypes = propTypes;
export default TwitterWidgetList;
