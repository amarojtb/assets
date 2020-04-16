import PropTypes from 'prop-types';
import React from 'react';
import Widget, { widgetPropTypes } from 'components/Widget';
import parameters from 'constants/parameters';
import TwitterWidgetList from './TwitterWidgetList';
import './TwitterWidget.css';
import Svg from 'components/Svg/Svg';

const propTypes = {
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
const { COLORS } = parameters;

const TwitterWidget = ({ params, widget }) => (
  <Widget widget={widget}>
    {params.data == null ? null : (
      <div className="twitter-widget">
        <div className="twitter-widget__left-col twitter-widget__icon">
          <svg fill={COLORS.twitter}>
            <path
              d="m48.046137,4.633889q-2.042575,2.98764 -4.938755,
              5.091183q0.030492,0.426808 0.030492,1.280418q0,
              3.963196 -1.15848,7.91115t-3.521146,7.575801t-5.624689,
              6.41733t-7.865419,4.450976t-9.847021,1.661491q-8.26174,
              0 -15.121119,-4.420488q1.067014,0.121948 2.377918,
              0.121948q6.859378,0 12.224935,-4.207089q-3.201041,
              -0.060971 -5.731391,-1.966353t-3.475418,-4.86254q1.006042,
              0.152431 1.859654,0.152431q1.310902,0 2.591318,
              -0.335345q-3.414444,-0.701184 -5.655174,-3.399204t-2.24073,
              -6.2649l0,-0.121942q2.073056,1.158473 4.450974,
              1.249929q-2.012085,-1.341389 -3.201043,-3.505905t-1.18896,
              -4.694862q0,-2.682779 1.34139,-4.969239q3.688821,
              4.542432 8.978164,7.27094t11.325598,3.033369q-0.243892,
              -1.15847 -0.243892,-2.255971q0,-4.08514 2.880936,
              -6.96608t6.966085,-2.880939q4.268057,0 7.194723,
              3.109585q3.322991,-0.640208 6.249658,-2.377918q-1.127986,
              3.505905 -4.329031,5.426531q2.835209,-0.304861 5.670422,
              -1.524307l0,-0.000001l0,-0.000001z"
            />
          </svg>
        </div>.
        <TwitterWidgetList
          list={params.data.slice(0, 6)}
          onAllImagesLoaded={params.handleAllImagesLoaded}
        />
      </div>
    )}
  </Widget>
);

TwitterWidget.propTypes = propTypes;
export default TwitterWidget;
