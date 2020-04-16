import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Svg from 'components/Svg';
import DropDown from 'components/DropDown';
import parameters from 'constants/parameters';

import './VerticalTabs.css';

const { BREAKPOINT } = parameters;

const propTypes = {
  active: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['expanded-widget', 'normal']),
  tabs: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  submitActions: PropTypes.instanceOf(Object),
  extraActions: PropTypes.instanceOf(Object),
  children: PropTypes.node,
  resizeChart: PropTypes.func.isRequired,
  onTabChange: PropTypes.func,
};

const defaultProps = {
  mode: 'normal',
  tabs: [],
  submitActions: {},
  extraActions: {},
  children: null,
  onTabChange: Function.prototype,
};

class VerticalTabs extends Component {
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
    this.onExpandChart = this.onExpandChart.bind(this);
  }

  componentWillMount() {
    const {
      tabs: [first],
    } = this.props;
    this.willDoTransition = first.showChildren;
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillReceiveProps(nextProps) {
    const { tabs, active } = nextProps;
    const { selectedTab } = this.state;
    const disabledTabs = tabs.filter(tab => !tab.active).map(tab => tab.value);
    const activeTabs = tabs.filter(tab => tab.active).map(tab => tab.value);

    if (disabledTabs.includes(selectedTab)) {
      this.setState({
        selectedTab: activeTabs[0],
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  onExpandChart() {
    const { resizeChart } = this.props;
    this.setState({ isExpanded: !this.state.isExpanded }, () => {
      if (typeof resizeChart === 'function') {
        resizeChart();
      }
    });
  }

  setSelectedTab(tabName) {
    const { onTabChange } = this.props;

    return e => {
      if ([...e.target.offsetParent.classList].includes('enable-filters')) {
        return;
      }
      const { tabs } = this.props;
      const nextTab = tabs.find(tab => tab.value === tabName);
      const previousTab = tabs.find(
        tab => tab.value === this.state.selectedTab
      );

      onTabChange();

      this.setState(
        {
          selectedTab: tabName,
        },
        () => {
          if (nextTab.showChildren && !previousTab.showChildren) {
            setTimeout(() => {
              this.willDoTransition = nextTab.showChildren;
            }, 500);
          } else {
            this.willDoTransition = nextTab.showChildren;
          }
        }
      );
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
          'vertical-tabs__sidebar--item text-truncate': true,
          'tab-selected t-color-primary-border t-color-primary':
            selectedTab === tab.value,
          'tab-disabled': !tab.active,
        })}
        onClick={this.setSelectedTab(tab.value)}
        onKeyUp={this.setSelectedTab(tab.value)}
        tabIndex={0}
        title={tab.title}
      >
        <Svg icon={tab.icon} size={tab.iconSize} />
        <span className="text-tuncate">{tab.label()}</span>
      </div>
    ));
  }

  renderExpandedWidget() {
    const { tabs, submitActions, extraActions, children } = this.props;
    const { selectedTab, isExpanded } = this.state;
    const currentTab = tabs.find(tab => tab.value === selectedTab);

    return (
      <div className="c-vertical-tabs">
        <div className="vertical-tabs__tabs">
          {this.renderTabs()}
          {(typeof extraActions === 'function' && extraActions()) || null}
          <div className="c-add-widget__submit_actions">
            {(typeof submitActions === 'function' && submitActions()) || null}
          </div>
        </div>
        <div className="vertical-tabs__container">
          <div
            className={cn({
              'vertical-tabs__wrapper': true,
              showTab: !isExpanded && this.willDoTransition,
              show: !isExpanded,
              hideTab:
                isExpanded && currentTab.showChildren && this.willDoTransition,
              hide: isExpanded && currentTab.showChildren,
            })}
          >
            {tabs.map(tab => (
              <div
                key={tab.value}
                className={cn({
                  'vertical-tabs__sidebar--content': true,
                  'selected-tab': selectedTab === tab.value,
                })}
              >
                {(typeof tab.content === 'function' && tab.content()) || null}
              </div>
            ))}
          </div>
          <div
            className={cn({
              'vertical-tabs__children': true,
              show: currentTab && currentTab.showChildren,
              hide: currentTab && !currentTab.showChildren,
            })}
          >
            <button
              onClick={this.onExpandChart}
              className="btn--primary btn--bold expand-btn"
              type="button"
              tabIndex={-1}
            >
              {isExpanded ? (
                <Svg className="chevron-icon" icon="chevron-right" />
              ) : (
                <Svg className="chevron-icon" icon="chevron-left" />
              )}
            </button>
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
      <div className="c-vertical-tabs">
        <DropDown
          className="vertical-tabs__actions t-color-primary-bg"
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
        <div className="vertical-tabs__container">
          {tabs.map(tab => (
            <div
              key={tab.value}
              className={cn({
                'vertical-tabs__sidebar--content': true,
                'selected-tab': selectedTab === tab.value,
              })}
            >
              {(typeof tab.content === 'function' && tab.content()) || null}
            </div>
          ))}
        </div>
        <div className="vertical-tabs__submit_actions">
          {(typeof submitActions === 'function' && submitActions()) || null}
        </div>
      </div>
    );
  }

  renderNormal() {
    const { tabs, submitActions, extraActions } = this.props;
    const { selectedTab } = this.state;
    return (
      <div className="c-vertical-tabs">
        <div className="vertical-tabs__tabs">
          {this.renderTabs()}
          {(typeof extraActions === 'function' && extraActions()) || null}
          <div className="c-add-widget__submit_actions">
            {(typeof submitActions === 'function' && submitActions()) || null}
          </div>
        </div>
        <div className="vertical-tabs__container">
          {tabs.map(tab => (
            <div
              key={tab.value}
              className={cn({
                'vertical-tabs__sidebar--content': true,
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

VerticalTabs.propTypes = propTypes;
VerticalTabs.defaultProps = defaultProps;

export default VerticalTabs;
