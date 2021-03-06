module.exports = function(sequelize, DataTypes) {

  const Storage = sequelize.define('storage_device', {
    uuid: { type: DataTypes.STRING, unique: true },
    access: { 
        type: DataTypes.ENUM,
        values: [ 'public', 'private' ],
        defaultValue: 'private' 
    },
    // TODO backup_rule as own model
    // TODO backups as storage models
    favorite: { type: DataTypes.BOOLEAN, defaultValue: false },
    license: { 
      type: DataTypes.INTEGER, 
      defaultValue: 0,
      validate: { isIn: [[ 0, 1 ]] }
    },
    size: { type: DataTypes.INTEGER, validate: { min: 10, max: 2048 } },
    state: { 
      type: DataTypes.ENUM,
      values: [ 'online', 'maintenance', 'cloning', 'backuping', 'error' ],
      defaultValue: 'online',
      validate: { isIn: [['online', 'maintenance', 'cloning', 'backuping', 'error']] }
    },
    tier: { 
        type: DataTypes.ENUM,
        values: [ 'hdd', 'maxiops' ],
        defaultValue: 'maxiops',
        validate: { isIn: [['hdd', 'maxiops']] }
    },
    title: { type: DataTypes.STRING, validate: { len: [0,64] } },
    type: { 
      type: DataTypes.ENUM,
      values: [ 'normal', 'backup', 'cdrom', 'template' ],
      defaultValue: 'normal',
      validate: { isIn: [['normal', 'backup', 'cdrom', 'template']] }
    },
    zone: { 
        type: DataTypes.ENUM,
        values: [ 'fi-hel1', 'uk-lon1', 'us-chi1', 'de-fra1', 'sg-sin1', 'ne-ams1' ],
        validate: { isIn: [['fi-hel1', 'uk-lon1', 'us-chi1', 'de-fra1', 'sg-sin1', 'ne-ams1']] }
    }
  });

  Storage.associate = (models) => {
    Storage.belongsToMany(models.server, {as: 'servers', through: 'ServerStorage'});
  };

  return Storage;
}