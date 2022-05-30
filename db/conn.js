const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
})

try {
  sequelize.authenticate()
  console.log('Conectado')
} catch (err) {
  console.log(err)
}

module.exports = sequelize