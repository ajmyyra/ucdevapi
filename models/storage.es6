export default function (sequelize, DataTypes) {
  const Storage = sequelize.define('storage_device', {
    uuid: { type: DataTypes.STRING, unique: true },
    access: { 
        type: DataTypes.ENUM,
        values: [ 'public', 'private' ],
        defaultValue: 'private' 
    },
    // backup_rule
    // backups
    favorite: { type: DataTypes.BOOLEAN },
    license: { type: DataTypes.INTEGER },
    size: { type: DataTypes.INTEGER, validate: { min: 10, max: 1024 } },
    state: { type: DataTypes.STRING },
    tier: { 
        type: DataTypes.ENUM,
        values: [ 'hdd', 'maxiops' ],
        defaultValue: 'maxiops' 
    },
    title: { type: DataTypes.STRING, validate: { len: [0,64] } },
    type: { 
      type: DataTypes.ENUM,
      values: [ 'normal', 'backup', 'cdrom', 'template' ]
    },
    zone: { 
        type: DataTypes.ENUM,
        values: [ 'fi-hel1', 'uk-lon1', 'us-chi1', 'de-fra1', 'sg-sin1', 'ne-ams1' ]
    }
  });

  Storage.associate = (models) => {
    Storage.belongsToMany(models.server, {as: 'servers', through: 'ServerStorage'});
  };

  return Storage;
}