// see tests/datagarrison.js for a usage example

// default timeout of 15 seconds
const defaultTimeout = 1000 * 15

/**
 *
 * @param {{user: number, stream: number}} stream - user and stream/wireless id
 * @param {number} [timeoutInMs=15000] - maximum request time out in milliseconds
 * @returns {Promise<{timezone: string, name: string, header: [string], samples: [Object]}>}
 */
const get = (stream, timeoutInMs = defaultTimeout) => fetchStream(stream, timeoutInMs).then(parse)

const fetchStream = ({ user, stream }, ms) => {
  const endpoint = `https://datagarrison.com/users/${user}/${stream}/temp/${stream}_live.txt`

  // set up Abort controller with a custom timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), ms)

  console.log('using local stream')
  return fetch(endpoint, {
    signal: controller.signal // assign controller's abort signal so the request times out after a specified time
  }).then(response => {
    const { status, ok } = response
    if (ok) return response.text()

    throw new Error(`Request rejected with status ${status}`)
  }).finally(() => {
    // clear the timeout on success or failure
    clearTimeout(timeoutId)
  })
}

const parse = data => {
  const lines = data.split('\r\n')

  const name = lines.shift().trim()
  // todo: should we include the timezone in the dates?
  const timezone = lines.shift().split(':')[1].trim()
  const header = lines.shift().split('\t')
  header.pop() // extra '\t'

  const samples = lines.map(line => {
    return line
      .split('\t')
      .map((datum, index) => {
        if (!index) return Date.parse(datum) // first is datetime
        if (!datum) return null
        return parseFloat(datum)
      })
  })

  return {
    name, timezone, header, samples
  }
}

module.exports = { get, parse }
