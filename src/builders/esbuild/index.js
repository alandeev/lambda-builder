const esbuild = require('esbuild')

const parseHandlersToEntrypoints = require('./parse-handlers-to-entry-points')

const defaultSettings = {
  platform: 'node',
  outdir: 'build',
  sourcemap: true,
  bundle: false,
  logLevel: 'debug',
  treeShaking: false,
  minify: false,
}

const buildESBuildLambda = async ({ handlers, build }) => {
  const entryPoints = parseHandlersToEntrypoints(handlers, build)

  const buildOptions = {
    entryPoints,
    outdir: build.outdir ?? defaultSettings.outdir,
    platform: build.platform ?? defaultSettings.platform,
    sourcemap: build.sourcemap ?? defaultSettings.sourcemap,
    bundle: build.bundle ?? defaultSettings.bundle,
    treeShaking: build.three_shaking ?? defaultSettings.treeShaking,
    minify: build.minify ?? defaultSettings.minify,
  }

  return esbuild.build(buildOptions)
}

module.exports = buildESBuildLambda
