import models from '../models'
import fs from 'fs'

initializeDatabase()

async function initializeDatabase() {
  await models.sequelize.sync({ force: true });
  models.sequelize.close();
}
