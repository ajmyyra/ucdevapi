module.exports = function(sequelize, DataTypes) {
    
    const Server = sequelize.define('server', {
        uuid: { type: DataTypes.STRING, unique: true, validate: { isUUID: 4 } },
        boot_order: { 
            type: DataTypes.ENUM,
            values: [ 'disk / cdrom / disk', 'cdrom / cdrom', 'disk' ], 
            defaultValue: 'disk' },
        core_number: { type: DataTypes.INTEGER },
        firewall: { 
            type: DataTypes.ENUM,
            values: [ 'on', 'off' ],
            defaultValue: 'on' 
        },
        host: { type: DataTypes.INTEGER },
        hostname: { 
            type: DataTypes.STRING, 
            validate: { 
                isFQDN: { 
                    require_tld: true, 
                    allow_underscores: false, 
                    allow_trailing_dot: false 
                }, 
                len: [0,128] 
            } 
        },
        license: { type: DataTypes.INTEGER },
        memory_amount: { type: DataTypes.INTEGER },
        nic_model: { 
            type: DataTypes.ENUM,
            values: [ 'e1000', 'virtio', 'rtl8139' ] 
        },
        plan: { type: DataTypes.STRING },
        state: { 
            type: DataTypes.ENUM,
            values: [ 'started', 'stopped', 'maintenance', 'error' ] 
        },
        tags: { type: DataTypes.STRING },
        timezone: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING, validate: { len: [0,64] } },
        video_model: { 
            type: DataTypes.ENUM,
            values: [ 'cirrus', 'vga' ],
            defaultValue: 'vga' 
        },
        vnc: { 
            type: DataTypes.ENUM,
            values: [ 'on', 'off' ],
            defaultValue: 'off'
        },
        vnc_host: { type: DataTypes.STRING },
        vnc_password: { type: DataTypes.STRING },
        vnc_port: { type: DataTypes.INTEGER },
        zone: { 
            type: DataTypes.ENUM,
            values: [ 'fi-hel1', 'uk-lon1', 'us-chi1', 'de-fra1', 'sg-sin1', 'ne-ams1' ]
        },
    });

    Server.associate = (models) => {
        Server.belongsToMany(models.storage_device, { as: 'storage_devices', through: 'ServerStorage' });
        Server.hasMany(models.ip_address, {as: 'ip_addresses'});
    };

    return Server;
}