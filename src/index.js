const { readdirSync } = require('fs')
const buildESBuildLambda = require('./builders/esbuild')
const getFiles = require('./utils/get-files')
const parseHandlersFiles = require('./utils/parse-handlers-files')
const parseHandlersYML = require('./utils/parse-handlers-yml')
const zipDirectory = require('./utils/zip-directory')

const builders = {
  esbuild: buildESBuildLambda
}

/**
 * @typedef {{
 *  functions?: string,
 *  builder?: string,
 *  outdir?: string,
 *  base_dir?: string,
 *  sourcemap?: boolean,
 *  bundle?: boolean,
 *  individually?: boolean,
 *  zip?: boolean
 * }} BuildOptions
 * 
 * @param {BuildOptions} options 
 */
const buildRun = async (options = {}) => {
  const buildOptions = {
    functions: options.functions ?? 'serverless.yml',
    builder: options.builder ?? 'esbuild',
    outdir: options.outdir ?? 'build',
    base_dir: options.base_dir ?? 'src',
    sourcemap: options.sourcemap ?? true,
    bundle: options.bundle ?? true,
    individually: options.individually ?? true,
    zip: options.zip ?? true
  }

  const builder = builders[buildOptions.builder ?? 'esbuild']

  if(buildOptions.individually) {
    const handlers = parseHandlersYML(buildOptions.functions)

    await builder({
      handlers,
      build: buildOptions
    })
  } else {
    const files = await getFiles(buildOptions.base_dir)
    const handlers = parseHandlersFiles(files)

    await builder({
      handlers,
      build: buildOptions
    })
  }

  if(buildOptions.zip) {
    const handlers = readdirSync(buildOptions.outdir)
    console.debug(`Starting lambdas compress: - ${handlers.length} function(s)`)

    for(let handler of handlers) {
      const inputFolder = `${process.cwd()}/${buildOptions.outdir}/${handler}`
      
      console.time(`Compress lambda - ${handler}`)
      await zipDirectory(inputFolder, handler)
      console.timeEnd(`Compress lambda - ${handler}`)
    }
  }

  console.info(`Build finished`)
}

buildRun({
  individually: false,
  bundle: false,
  zip: true,
  sourcemap: true,
  base_dir: `src`
})