import 'normalize.css';
import './style.css';
import { multiply } from 'example-lib-universal-js';
import { add } from 'example-lib-universal-ts';

const two = add(1, 1);
const four = multiply(2, 2);

const app = document.getElementById('app');
app.innerText = `Hello world from ts app! 1 + 1 = ${two} and 2 * 2 = ${four}.`;

if (module.hot) {
  module.hot.accept(location.reload);
}
