import semver from 'semver';

const engines = '^14.13.1 || >=16.0.0';
const comparators = semver
  .toComparators(engines)
  .flat()
  .map(v => semver.coerce(v));
const minVersion = semver.minSatisfying(comparators, engines).version;
const maxVersion = semver.maxSatisfying(comparators, engines).version;
const mainVersion = `${semver.major(maxVersion)}.x`;

console.log({
  node: {
    matrix: {
      node: [minVersion, mainVersion],
    },
    main: mainVersion,
  },
});
