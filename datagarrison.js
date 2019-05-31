// see tests/datagarrison.js for a usage example

const parse = data => {
  const lines = data.split(`\r\n`)

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

const find = timestamp => {
  const fifteenMinutesInMs = 15 * 60 * 1000
  const indexBy15Minutes = timestamp % fifteenMinutesInMs
  return indexBy15Minutes
}

module.exports = { parse, find }
