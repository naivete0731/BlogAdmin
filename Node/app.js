const express = require('express')
const path = require('path')
// gzip配置
const compression = require('compression')
const app = express()

app.use(compression())
app.use(express.static(path.join(__dirname, 'public')))

app.listen(80, () => { console.log('启动成功') })