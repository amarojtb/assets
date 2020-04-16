/**
 * Unit tests for Template component.
 */
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import 'services/enzyme-test-helper';
import Template from './Template';

describe('Template', () => {
  const name = 'Kantar Media';
  const templateId = '1';
  let shallowTemplate;

  beforeEach(() => {
    shallowTemplate = shallow(
      <Template name={name} onClick={() => {}} templateId={templateId} />
    );
  });

  it('should render correctly', () => {
    expect(shallowTemplate.type()).to.equal('div');
  });

  it('should have correct className value', () => {
    expect(shallowTemplate.hasClass('c-template')).to.be.true;
  });

  it('should have "is-selected" className is the "isSelected" prop is true', () => {
    shallowTemplate.setProps({ isSelected: true });
    expect(shallowTemplate.hasClass('is-selected')).to.be.true;
  });

  it('should have "aria-checked" prop', () => {
    expect(shallowTemplate.prop('aria-checked')).to.be.false;
    shallowTemplate.setProps({ isSelected: true });
    expect(shallowTemplate.prop('aria-checked')).to.be.true;
  });

  it('should have "role" prop', () => {
    expect(shallowTemplate.prop('role')).to.equal('radio');
  });

  it('should have "tabIndex" prop', () => {
    expect(shallowTemplate.prop('tabIndex')).to.equal(0);
  });

  it('should have correct style prop value', () => {
    expect(shallowTemplate.prop('style')).to.have.property(
      'backgroundImage',
      `url('/Areas/Delivery/Content/img/export/templates/\
${templateId}.jpg')`
    );
  });

  it('should not have an image if the "logo" prop is null', () => {
    expect(shallowTemplate.find('img')).to.have.lengthOf(0);
  });

  it('should have an image if the "logo" prop is not null', () => {
    const url =
      'https://s3-eu-west-1.amazonaws.com/kmplus/Branding/5/logo.png?dummy=15336';

    shallowTemplate.setProps({ logo: url });
    expect(shallowTemplate.find('img')).to.have.lengthOf(1);
    expect(shallowTemplate.find('img').prop('src')).to.equal(url);
  });

  it('should trigger "onClick" when click', () => {
    const spy = sinon.spy();

    shallowTemplate.setProps({ onClick: spy });
    shallowTemplate.simulate('click');
    expect(spy.calledOnce).to.be.true;
  });

  it('should trigger "onClick" when press the "enter" key', () => {
    const spy = sinon.spy();

    shallowTemplate.setProps({ onClick: spy });
    shallowTemplate.simulate('keyDown', { keyCode: 13 });
    expect(spy.calledOnce).to.be.true;
  });
});
