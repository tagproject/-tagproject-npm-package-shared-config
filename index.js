/* --------------------------------------------------------------- */
/* This file generated automatically                               */
/* @see https://www.npmjs.com/package/standard-shared-config       */
/* --------------------------------------------------------------- */

/* eslint-disable */
import SharedConfig from 'standard-shared-config'
import dependencies from './dependencies'
import scripts from './scripts'
import snapshots from './snapshots'

await new SharedConfig().share(".config", { dependencies, scripts, snapshots });