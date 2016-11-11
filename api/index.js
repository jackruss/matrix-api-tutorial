require('dotenv').config()
const fetch = require('node-fetch')
const HttpCors = require('http-cors')

const cors = new HttpCors()

module.exports = async function (req, res) {
  if (cors.apply(req, res)) return
  if (req.method === 'POST') {
    return await fetch(process.env.URL + '/_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: process.env.KEY,
        secret: process.env.SECRET
      })
    }).then(res => res.json())
  }
  return JSON.stringify({ name: 'Test Matrix API'})
}
