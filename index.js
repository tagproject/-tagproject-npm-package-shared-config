/* --------------------------------------------------------------- */
/* This file generated automatically                               */
/* @see https://www.npmjs.com/package/standard-shared-config       */
/* --------------------------------------------------------------- */

/* eslint-disable */
const SharedConfig = require('standard-shared-config').default;
const dependencies = require('./dependencies');
const scripts = require('./scripts');
const snapshots = require('./snapshots');
const config = new SharedConfig();

config.share(".config", { dependencies, scripts, snapshots });