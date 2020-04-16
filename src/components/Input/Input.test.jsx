import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import 'services/enzyme-test-helper';
import Input from './Input';

describe('<Input>', () => {
  let shallowInput;

  beforeEach(() => {
    shallowInput = shallow(<Input value="" />);
  });

  afterEach(() => {
    shallowInput.unmount();
  });

  it('contains the class name "c-input"', () => {
    expect(shallowInput.find('.c-input')).to.have.length(1);
  });

  it('renders input element', () => {
    expect(shallowInput.find('input')).to.have.length(1);
  });

  it('calls clear', () => {
    const onChange = sinon.spy();

    shallowInput.setProps({ clearable: true, onChange, value: 'Text' });
    shallowInput.find('.c-input__icon--clearable').simulate('click');
    expect(onChange.withArgs('').calledOnce).to.be.true;
  });
});
