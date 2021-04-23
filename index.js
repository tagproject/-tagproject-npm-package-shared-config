/* --------------------------------------------------------------- */
/* This file generated automatically                               */
/* @see https://www.npmjs.com/package/standard-shared-config       */
/* --------------------------------------------------------------- */

/* eslint-disable */
const sharedConfig = require('standard-shared-config');
const dependencies = require('./dependencies');
const scripts = require('./scripts');
const snapshots = require('./snapshots');

sharedConfig.share(".config", { dependencies, scripts, snapshots });