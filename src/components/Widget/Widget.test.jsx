/**
 * Unit tests for Widget component.
 */
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import Loader from 'components/Loader';
import 'services/enzyme-test-helper';
import Widget from './Widget';

describe('<Widget />', () => {
  const id = 'widget-id';
  const name = 'Widget Name';
  const partialViewName = 'DotGridChart';
  const widget = {
    data: null,
    id,
    name,
    partialViewName,
  };
  let shallowWidget;

  beforeEach(() => {
    shallowWidget = shallow(<Widget widget={widget} />);
  });

  afterEach(() => {
    shallowWidget.unmount();
  });

  it('should render correctly', () => {
    expect(shallowWidget.type()).to.equal('div');
  });

  it('should have correct className value', () => {
    expect(shallowWidget.hasClass('c-widget')).to.be.true;
  });

  it('should render the header', () => {
    expect(shallowWidget.find('header.c-widget__header')).to.have.lengthOf(1);
  });

  it('should no render the header if the name is null', () => {
    const widgetDataWithoutName = { ...widget, name: null };

    shallowWidget.setProps({ widget: widgetDataWithoutName });
    expect(shallowWidget.find('header.c-widget__header')).to.have.lengthOf(0);
  });

  it('should render a Loader', () => {
    const loader = shallowWidget.find(Loader);

    expect(loader).to.have.lengthOf(1);
    expect(loader.prop('id')).to.equal(`normal-loader-${id}`);
    expect(loader.prop('style')).to.have.property('display', 'none');
  });

  it('should render a trash button', () => {
    const button = shallowWidget.find(Button);

    expect(button).to.have.lengthOf(1);
    expect(button.hasClass('c-widget__delete')).to.be.true;
    expect(button.hasClass('js-widget__delete')).to.be.true;
  });

  it('should have an overlay', () => {
    expect(
      shallowWidget.find('.c-widget__overlay.js-widget-overlay')
    ).to.have.lengthOf(1);
  });

  it('should have a message indicating that there is no data', () => {
    expect(shallowWidget.find('.c-widget__no-data')).to.have.lengthOf(1);
    expect(
      shallowWidget
        .find(FormattedMessage)
        .findWhere(messageItem => messageItem.prop('id') === 'Global.noData')
    ).to.have.lengthOf(1);
  });

  it('should render children', () => {
    shallowWidget.setProps({ children: <div className="children" /> });
    expect(shallowWidget.find('.children')).to.have.lengthOf(1);
  });
});
