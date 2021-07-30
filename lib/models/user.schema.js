'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secret';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      /* eslint-disable new-cap */
      type: DataTypes.ENUM('user', 'writer', 'editor', 'admin'),
      defaultValue: 'user',
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({username: this.username}, SECRET);
      },
      set(tokenObj) {
        const token = jwt.sign(tokenObj, SECRET);
        return token;
      },
    },
    capabilities: {
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ['read'],
          writer: ['read', 'create'],
          editor: ['read', 'create', 'update'],
          admin: ['read', 'create', 'update', 'delete'],
        };
        return acl[this.role];
      },
    },
  });

  model.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  model.authenticateBasic = async function(username, password) {
    const options = {
      where: {username: username},
    };

    const user = await this.findOne(options);
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }

    return 'no user found';
  };

  model.authenticateToken = async function(token) {
    try {
      const parsedToken = await jwt.verify(token, SECRET);
      const user = await this.findOne({
        where: {username: parsedToken.username},
      });
      if (user) {
        return user;
      }
      return 'no user found';
    } catch (e) {
      console.error(e.message);
    }
  };
  return model;
};
