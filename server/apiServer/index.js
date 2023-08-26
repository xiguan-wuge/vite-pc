const http = require('http')
const qs = require('querystring')
const server = http.createServer()
server.on('request', async (req, res) => {
  console.log('req', req.method, req.url);
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Accept', 'application/json;charset=UTF-8')
  if(req.method ==='OPTIONS') {
    res.statusCode = 204
    res.end()
  }

  if(req.url.startsWith('/getUserInfo')) {
    let params = {}

    if(req.method === 'GET') {
      params = req.url.split('?')[1]
    }
    let bufferArr = []
    if(req.method === 'POST') {
      req.on('data', (data) => {
        bufferArr.push(data)
        console.log('data',qs.parse(data));
        
      })
      req.on('end', () => {
        console.log('end', bufferArr);
        if(bufferArr.length) {
          params = qs.parse(bufferArr.toString())
        }
        console.log('params', params);
      })
    }
    setTimeout(() => {
      res.statusCode = 200
      res.end(JSON.stringify({
        code: 1,
        data: {
          name: '张三',
          searchKey: params || 'no params'
        },
        message: '200'
      }))
    }, 5000)
  }
})

server.listen(8091, () => {
  console.log(`server run at: http://localhost:8091`)
})