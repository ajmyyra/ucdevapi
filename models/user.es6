var bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {

var User = sequelize.define('user', {
    annotation_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        field: 'username'
    },
    email: {
        type: DataTypes.STRING,
        validate: { isEmail: true } 
    },
    password: DataTypes.STRING,
    createdAt: {
        type: DataTypes.DATE,
        default: DataTypes.NOW
    }
}, {
    classMethods: {
        // TODO servers, storages & ip_addresses to here and user to each model
    },
    instanceMethods: {
        generateHash: function(password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
        },
        validPassword: function(password) {
            return bcrypt.compareSync(password, this.password);
        },
    }
});

    return User;
}