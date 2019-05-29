const Koa = require('koa')
const Socket = require('koa-socket-2')

const app = new Koa()
const io = new Socket()
const https = require('https')

const url = `https://datagarrison.com/users/1105898/351579054854805/temp/351579054854805_live.txt`

let sample = {}

https.get(url, response => {
  if (response.statusCode !== 200) {
    throw new Error(`status code ${response.statusCode}`)
  }

  let stream
  response.on('data', chunk => { stream += chunk })
  response.on('end', () => {
    const lines = stream.split(`\r\n`)
    const header = lines[2].split('\t')
    const last_line = lines[lines.length - 2].split('\t')
    header.pop() // extra \t
    header.forEach((title, index) => sample[title] = last_line[index])
  })
}).on('error', e => { throw e })

io.attach(app)

app.use(async ctx => {
  ctx.body = JSON.stringify(sample)
})

app.listen(3000)
