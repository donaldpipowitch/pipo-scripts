import React from 'react';
import renderer from 'react-test-renderer';
import { Smile } from '../src/smile';

it('Render <Smile />', () => {
  const component = renderer.create(<Smile />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
