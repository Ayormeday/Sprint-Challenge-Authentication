const db = require('../database/dbConfig');

const getUsers = (filter) => {
  if (!filter) {
    return db('users');
  } else {
    return db('users').where(filter);
  }
}

const getUser = (filter) => {
  return db('users').where(filter).first();
}

const add = (user) => {
  return db('users').insert(user).then((ids) => getUser({ id: ids[0] }));
}

const update = (changes, id) => {
  return db('users').where({ id }).update(changes).then(() => getUser(id));
}

const remove = (id) => {
  return db('users').where({ id }).del();
}

module.exports = {
  getUsers,
  getUser,
  add,
  update,
  remove,
}