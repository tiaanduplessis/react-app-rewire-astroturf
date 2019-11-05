const rewireAstroturf = require('react-app-rewire-astroturf')

module.exports = function override(config, env) {

  config = rewireAstroturf(config, env, {
    // config
  })

  return config
}
