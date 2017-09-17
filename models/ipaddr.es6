module.exports = function(sequelize, DataTypes) {
  const IPAddr = sequelize.define( 'ip_address', {
    access: { 
        type: DataTypes.ENUM,
        values: [ 'public', 'private' ],
        defaultValue: 'public'
    },
    address: { 
        type: DataTypes.STRING, 
        validate: { isIP: true } },
    family: { 
        type: DataTypes.ENUM,
        values: [ 'IPv4', 'IPv6' ],
        defaultValue: 'IPv4'
    },
    part_of_plan: { 
        type: DataTypes.ENUM,
        values: [ 'yes', 'no' ],
        defaultValue: 'no'
    },
    ptr_record: { type: DataTypes.STRING, validate: { isFQDN: true } },
  });
  
  IPAddr.associate = (models) => {
    IPAddr.belongsTo(models.server);
  };

  return IPAddr;
}