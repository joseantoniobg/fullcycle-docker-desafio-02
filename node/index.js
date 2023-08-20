const express = require('express')
const app = express()
const port = 3000

async function generateNewNameAndGetAllNamesFromBd() {
  const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
  }

  const mysql = require('mysql')
  const util = require('util')
  const randomName = require('node-random-name')

  const connection = mysql.createConnection(config)

  const sql = `INSERT INTO people (name) VALUES ('${randomName()}')`

  await connection.query(sql)

  const query = util.promisify(connection.query).bind(connection);

  const names = await query(`SELECT name FROM people ORDER BY name`)

  const formattedNames = names.map(n => `<li>${n.name}</li>`).reduce((n1, n2) => `${n1}${n2}`, '')

  connection.end()

  return formattedNames
}

app.get('/', async (req, res) => {
  const formattedNames = await generateNewNameAndGetAllNamesFromBd();
  res.send(`<h1>Full Cycle Rocks!</h1>
            <ol>${formattedNames}</ol>`)
})

app.listen(port, () => {
  console.log(`Exec on port ${port}`)
})