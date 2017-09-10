import models from '../models'
import fs from 'fs'

insertTestdata()

async function insertTestdata() {
  await models.sequelize.sync({ force: true });
  const users = JSON.parse( fs.readFileSync('testdata/users.json','utf-8') );
  const plans = JSON.parse( fs.readFileSync('testdata/plans.json','utf-8') );
  for (const user of users) {
    await models.user.create(user);
  }
  for (const plan of plans) {
    await models.plan.create(plan);
  }
  models.sequelize.close();
}
