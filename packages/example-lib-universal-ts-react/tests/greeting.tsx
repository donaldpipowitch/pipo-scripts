import React from 'react';
import renderer from 'react-test-renderer';
import { Greeting } from '../src/greeting';

test('Render <Greeting />', () => {
  const component = renderer.create(<Greeting name="John Doe" />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
