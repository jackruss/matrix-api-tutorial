require('dotenv').config()
const fetch = require('node-fetch')
const HttpCors = require('http-cors')

const cors = new HttpCors()

module.exports = async function (req, res) {
  if (cors.apply(req, res)) return
  if (req.method === 'POST') {
    return { todo: 'fetch token'}
  }
  return JSON.stringify({ name: 'Test Matrix API'})
}
