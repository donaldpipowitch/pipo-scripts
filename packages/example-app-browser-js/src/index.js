import { multiply } from 'example-lib-universal-js';
import { add } from 'example-lib-universal-ts';

const two = add(1, 1);
const four = multiply(2, 2);

const app = document.getElementById('app');
app.innerText = `Hello world! 1 + 1 = ${two} and 2 * 2 = ${four}.`;
