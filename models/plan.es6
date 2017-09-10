export default function (sequelize, DataTypes) {
    const Plan = sequelize.define('plan', {
      name: { type: DataTypes.STRING, unique: true, validate: { len: [4,64] } },
      core_number: { type: DataTypes.INTEGER },
      memory_amount: { type: DataTypes.INTEGER },
      storage_size: { type: DataTypes.INTEGER },
      storage_tier: { 
          type: DataTypes.ENUM,
          values: [ 'maxiops', 'hdd' ],
          defaultValue: 'maxiops' 
      }    
    })
    return Plan
  }