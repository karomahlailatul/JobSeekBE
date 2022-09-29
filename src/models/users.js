const Pool = require("../config/db");

const findEmail = (email) => {
  return Pool.query(`SELECT * FROM users WHERE email='${email}'`);
};

const findUsername = (username) => {
  return Pool.query(`select * from users where username='${username}'`);
};

const create = (data) => {
  const { id, email, passwordHash, name, role, phone } = data;
  return new Promise((resolve, reject) =>
    Pool.query(`INSERT INTO users(id,email,password,name,role,phone) VALUES('${id}','${email}','${passwordHash}','${name}','${role}','${phone}')`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};



const updateAccount = (email, name, gender, phone, date_of_birth, picture, job_desk, domicile, location, description , role) => {
  return Pool.query(` update users set name='${name}',  gender='${gender}', phone='${phone}', date_of_birth='${date_of_birth}', picture='${picture}', job_desk = '${job_desk}',  domicile = '${domicile}',  location = '${location}',  description = '${description}', role='${role}' where email='${email}'`);
};

const updateNoPict = (email, name, gender, phone, date_of_birth,job_desk, domicile, location, description , role) => {
  return Pool.query(` update users set name='${name}',  gender='${gender}', phone='${phone}', date_of_birth='${date_of_birth}', job_desk = '${job_desk}',  domicile = '${domicile}',  location = '${location}',  description = '${description}', role='${role}' where email='${email}'`);
};

const changeEmailAccount = (email, emailBody) => {
  return Pool.query(`update users set email='${emailBody}' where email='${email}'`);
};

const changePassword = (email, passwordNewHash) => {
  return Pool.query(`update users set password='${passwordNewHash}' where email='${email}'`);
};

const deleteAccount = (email) => {
  return Pool.query(`delete from users where email='${email}'`);
};

const createUserWithRecuiterOnRegister = ( id, email, passwordHash, name, role, phone ) => {
  return Pool.query(`insert into users ( id , email , password , name , role , phone ) values ( '${id}' , '${email}' , '${passwordHash}' , '${name}' , '${role}' , '${phone}' ) `);
};

const createRecuiterOnRegister = (
  recuiter_id, users_id , position, company 
) => {
  return Pool.query(`insert into recuiter ( id, users_id , position, company )  values ( '${recuiter_id}' , '${users_id}' , '${position}', '${company}' ) `)
}


module.exports = {
  findEmail,
  findUsername,
  create,
  updateAccount,
  updateNoPict,
  changeEmailAccount,
  changePassword,
  deleteAccount,
  createUserWithRecuiterOnRegister,
  createRecuiterOnRegister
};
