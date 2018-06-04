import { getBabelConfig } from './babelrc';
module.exports = require('babel-jest').createTransformer(getBabelConfig());
