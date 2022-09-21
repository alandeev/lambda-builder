const esbuild = require('esbuild')
const parseHandlersToEntrypoints = require('./parse-handlers-to-entry-points')

const defaultSettings = {
  platform: 'node',
  outdir: 'build',
  sourcemap: true,
  bundle: false,
  logLevel: 'debug'
}

const buildESBuildLambda = async ({ handlers, build }) => {
  const entryPoints = parseHandlersToEntrypoints(handlers, build)

  const buildOptions = {
    entryPoints: entryPoints,
    outdir: build.outdir ?? defaultSettings.outdir,
    platform: build.platform ?? defaultSettings.platform,
    sourcemap: build.sourcemap ?? defaultSettings.sourcemap,
    bundle: build.bundle ?? defaultSettings.bundle,
    logLevel: defaultSettings.logLevel
  }

  const resultBuild = await esbuild.build(buildOptions)

  console.log(resultBuild)

  return resultBuild
}

module.exports = buildESBuildLambda