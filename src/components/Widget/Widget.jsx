import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LinesEllipsis from 'react-lines-ellipsis';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Svg from 'components/Svg';
import './Widget.css';

const widgetPropTypes = PropTypes.shape({
  data: PropTypes.any,
  id: PropTypes.string.isRequired,
  jsonParameters: PropTypes.shape({
    indicator: PropTypes.string,
    segment1OnField: PropTypes.string,
  }),
  name: PropTypes.string,
  partialViewName: PropTypes.string.isRequired,
});
const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  widget: widgetPropTypes.isRequired,
};
const defaultProps = {
  children: null,
  className: '',
};

export const renderNoDataMessage = () => (
  <div className="c-widget__no-data">
    <FormattedMessage id="Global.noData" />
  </div>
);

class Widget extends Component {
  componentDidMount() {
    const { widget: { onRender } } = this.props;

    if (typeof onRender === 'function') {
      onRender(true);
    }
  }

  render() {
    const { children, className, widget: { id, name } } = this.props;
    const widgetClassNames = classnames('c-widget', className);
    const loaderStyles = { display: 'none' };
    return (
      <div className={widgetClassNames}>
        {name == null ? null : (
          <header className="c-widget__header">
            <div className="c-widget__title">
              <LinesEllipsis
                text={name.toUpperCase()} // {name}
                maxLine="2"
                ellipsis="..."
                basedOn="words"
              />
            </div>
          </header>
        )}
        <section className="c-widget__body">
          <div className="c-widget__content">
            {children == null ? renderNoDataMessage() : children}
          </div>
        </section>
        <Loader
          className="js-widget-loader"
          id={`normal-loader-${id}`}
          style={loaderStyles}
        />
        <Button className="c-widget__delete js-widget__delete">
          <Svg icon="trash" />
        </Button>
        <div className="c-widget__overlay js-widget-overlay" />
      </div>
    );
  }
}

Widget.defaultProps = defaultProps;
Widget.propTypes = propTypes;
export default Widget;
export { widgetPropTypes };
