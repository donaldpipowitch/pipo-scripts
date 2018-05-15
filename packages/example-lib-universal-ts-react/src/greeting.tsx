import React, { SFC } from 'react';

/**
 * The props for `<Greeting />`.
 */
export interface GreetingProps {
  /**
   * The name of the user (e.g. "John Doe" or just "John").
   */
  name: string;
}

/**
 * Greets the user.
 */
export const Greeting: SFC<GreetingProps> = ({ name }) => <p>Hello {name}!</p>;
