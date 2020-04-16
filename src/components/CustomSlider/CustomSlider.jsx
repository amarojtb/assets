import React, { Component } from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { SliderRail, Handle, Track, Tick } from './Helper';

import './CustomSlider.css';

const sliderStyle = {
  position: 'relative',
  width: '100%',
  touchAction: 'none',
};

const domain = [1, 2];
const defaultValues = [1];

class CustomSlider extends Component {
  constructor() {
    super();
    this.state = {
      values: defaultValues.slice(),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(values) {
    const { onCustomSliderChange} = this.props;

    onCustomSliderChange(values);
    this.setState({ values });
  }

  render() {
    const { values } = this.state;
    const { label } = this.props;

    return (
      <div className="c-custom-slider">
        <div className="custom-clider__label">{label}</div>
        <Slider
          mode={1}
          step={1}
          domain={domain}
          rootStyle={sliderStyle}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={values}
        >
          <Rail>
            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks count={1}>
            {({ ticks }) => (
              <div className="slider-ticks">
                {ticks.map(tick => {
                  const newTick = { ...tick };
                  switch (tick.value) {
                    case 1:
                      newTick.value = 'Small';
                      return (
                        <Tick
                          key={tick.id}
                          tick={newTick}
                          count={ticks.length}
                        />
                      );
                    case 2:
                      newTick.value = 'Large';
                      return (
                        <Tick
                          key={tick.id}
                          tick={newTick}
                          count={ticks.length}
                        />
                      );
                    default:
                      break;
                  }
                })}
              </div>
            )}
          </Ticks>
        </Slider>
      </div>
    );
  }
}

export default CustomSlider;
