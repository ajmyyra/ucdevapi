export default function (sequelize, DataTypes) {
  return sequelize.define( 'ip_address', {
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
    server: { type: DataTypes.STRING, validate: { isUUID: true } },
  }
)}