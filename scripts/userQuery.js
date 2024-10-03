import { Users } from './databaseInit.js';
import sequelizeObj from './databaseInit.js';
// defining command using discord's SlashCommandBuilder tool
await sequelizeObj.authenticate();
sequelizeObj.sync(); // { force: true } to rebuild users table
const userList = await Users.findAll();

console.log('User List ---> ', userList[0]);
let leaderList = [];

for (var i = 0; i < userList.length; i++) {
    leaderList.push({name: userList[i].dataValues.id, currency: userList[i].dataValues.currency});
}

console.log('list ->', leaderList);

// console.log('User List index 0 ->', userList[0]);