import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Svg from 'components/Svg';
import DropDown from 'components/DropDown';
import parameters from 'constants/parameters';

import './HorizontalTabs.css';

const { BREAKPOINT } = parameters;

const propTypes = {
  active: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['expanded-widget', 'normal']),
  tabs: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  children: PropTypes.node,
};

const defaultProps = {
  mode: 'normal',
  tabs: [],
  children: PropTypes.node,
};

class HorizontalTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: props.active,
      windowWidth: window.innerWidth,
      isExpanded: false,
    };

    this.setSelectedTab = this.setSelectedTab.bind(this);
    this.renderExpandedWidget = this.renderExpandedWidget.bind(this);
    this.renderNormal = this.renderNormal.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  setSelectedTab(tabName) {
    return () => {
      this.setState({
        selectedTab: tabName,
      });
    };
  }

  handleWindowResize() {
    this.setState({
      windowWidth: window.innerWidth,
    });
  }

  renderTabs() {
    const { tabs } = this.props;
    const { selectedTab } = this.state;
    return tabs.map(tab => (
      <div
        key={tab.value}
        role="button"
        className={cn({
          'horizontal-tabs__sidebar--item text-truncate': true,
          't-color-primary-border t-color-primary': selectedTab === tab.value,
        })}
        onClick={this.setSelectedTab(tab.value)}
        onKeyUp={this.setSelectedTab(tab.value)}
        tabIndex={0}
        title={tab.title}
      >
        {tab.icon && <Svg icon={tab.icon} size={tab.iconSize} />}
        <span className="text-tuncate">{tab.label()}</span>
      </div>
    ));
  }

  renderExpandedWidget() {
    const { tabs, submitActions, extraActions, children } = this.props;
    const { selectedTab, isExpanded } = this.state;
    const currentTab = tabs.find(tab => tab.value === selectedTab);

    return (
      <div className="c-horizontal-tabs">
        <div className="horizontal-tabs__tabs">
          {this.renderTabs()}
          {(typeof extraActions === 'function' && extraActions()) || null}
          <div className="c-add-widget__submit_actions">
            {(typeof submitActions === 'function' && submitActions()) || null}
          </div>
        </div>
        <div className="horizontal-tabs__container">
          <div
            className={cn({
              'horizontal-tabs__wrapper': true,
              show: !isExpanded || selectedTab === 'filters',
              hide: isExpanded,
            })}
          >
            {tabs.map(tab => (
              <div
                key={tab.value}
                className={cn({
                  'horizontal-tabs__sidebar--content': true,
                  'selected-tab': selectedTab === tab.value,
                })}
              >
                {(typeof tab.content === 'function' && tab.content()) || null}
              </div>
            ))}
          </div>
          <div
            className={cn({
              'horizontal-tabs__children': true,
              show: currentTab && currentTab.showChildren,
              hide: currentTab && !currentTab.showChildren,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  renderMobileNormal() {
    const { tabs, submitActions } = this.props;
    const { selectedTab } = this.state;
    const currentTab = tabs.find(tab => tab.value === selectedTab);
    return (
      <div className="c-horizontal-tabs">
        <DropDown
          className="horizontal-tabs__actions t-color-primary-bg"
          title={
            (currentTab &&
              (() => (
                <Svg icon={currentTab.icon} size={currentTab.iconSize} />
              ))) ||
            (() => <Svg icon="gear" size="x-large" />)
          }
        >
          {this.renderTabs()}
        </DropDown>
        <div className="horizontal-tabs__container">
          {tabs.map(tab => (
            <div
              key={tab.value}
              className={cn({
                'horizontal-tabs__sidebar--content': true,
                'selected-tab': selectedTab === tab.value,
              })}
            >
              {(typeof tab.content === 'function' && tab.content()) || null}
            </div>
          ))}
        </div>
        <div className="horizontal-tabs__submit_actions">
          {(typeof submitActions === 'function' && submitActions()) || null}
        </div>
      </div>
    );
  }

  renderNormal() {
    const { tabs, submitActions, extraActions } = this.props;
    const { selectedTab } = this.state;
    return (
      <div className="c-horizontal-tabs">
        <div className="horizontal-tabs__tabs">
          {this.renderTabs()}
          {(typeof extraActions === 'function' && extraActions()) || null}
          <div className="c-add-widget__submit_actions">
            {(typeof submitActions === 'function' && submitActions()) || null}
          </div>
        </div>
        <div className="horizontal-tabs__container">
          {tabs.map(tab => (
            <div
              key={tab.value}
              className={cn({
                'horizontal-tabs__sidebar--content': true,
                'selected-tab': selectedTab === tab.value,
              })}
            >
              {(typeof tab.content === 'function' && tab.content()) || null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { mode } = this.props;
    const { windowWidth } = this.state;

    return mode === 'normal'
      ? (windowWidth >= BREAKPOINT.md && this.renderNormal()) ||
          this.renderMobileNormal()
      : (windowWidth >= BREAKPOINT.md && this.renderExpandedWidget()) ||
          this.renderMobileNormal();
  }
}

HorizontalTabs.propTypes = propTypes;
HorizontalTabs.defaultProps = defaultProps;

export default HorizontalTabs;
