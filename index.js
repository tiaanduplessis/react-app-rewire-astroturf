const EXTENSION = '.module.css'

function rewireAstroturf (config, env, opts = {}) {
  config.module.rules.push({
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    use: [
      {
        loader: 'astroturf/loader',
        options: Object.assign({ extension: EXTENSION }, opts)
      }
    ]
  })

  return config
}

module.exports = rewireAstroturf
