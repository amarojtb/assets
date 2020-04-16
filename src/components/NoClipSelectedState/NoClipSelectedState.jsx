import React from 'react';
import { FormattedMessage } from 'react-intl';
import Svg from 'components/Svg';
import './NoClipSelectedState.css';

const NoClipSelectedState = () => (
  <div className="c-no-clip-selected-state">
    <div className="c-no-clip-selected-state__content">
      <Svg className="c-no-clip-selected-state__icon" icon="reply" />
      <div className="c-no-clip-selected-state__text">
        <FormattedMessage id="MonitoringPreview.notSelected.firstLine" />
        <br />
        <FormattedMessage id="MonitoringPreview.notSelected.secondLine" />
      </div>
      <div className="c-no-clip-selected-state__footer">
        {['radio', 'web', 'press', 'social', 'tv'].map(iconName => (
          <Svg
            className="c-no-clip-selected-state__media-icon"
            icon={iconName}
            key={iconName}
          />
        ))}
      </div>
    </div>
  </div>
);

export default NoClipSelectedState;
