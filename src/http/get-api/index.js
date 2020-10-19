let arc = require('@architect/functions')

exports.handler = arc.http.async(http)

/** use architect/functions to automatically handle cache headers */
async function http () {
  return {
    json: { wss: process.env.ARC_WSS_URL }
  }
}
