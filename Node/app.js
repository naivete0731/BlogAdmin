const express = require('express')
const path = require('path')
// gzip配置
const compression = require('compression')
const https = require('https')
const fs = require('fs')
const app = express()

const options = {
  cert: fs.readFileSync('./full_chain.pem'),
  key: fs.readFileSync('./private.key')
}

app.use(compression())
app.use(express.static(path.join(__dirname, 'public')))

app.listen(80, () => { console.log('启动成功') })

// https.createServer(options, app).listen(443, () => {
//   console.log('server running at https://127.0.0.1:443')
// })s
