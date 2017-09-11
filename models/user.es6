const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {

    const User = sequelize.define('user', {
        annotation_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            field: 'username',
            validate: { len: [3,64] }
        },
        email: {
            type: DataTypes.STRING,
            validate: { isEmail: true, len: [5,128] } 
        },
        password: DataTypes.STRING,
    });

    User.associate = (models) => {
        User.hasMany(models.server, {as: 'servers'});
        User.hasMany(models.storage_device, {as: 'storages'});
    };
    User.prototype.generatePassword = (password) => {
        console.log(password); //debug
        var salt = bcrypt.genSaltSync(10); 
        var hash = bcrypt.hashSync(password, salt);
        return hash;
    };
    User.prototype.validPassword = (password) => {
        return bcrypt.compareSync(password, this.password);
    };

    return User;
}