'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Show extends Model {
        static associate(models) {
            // define association here
            Show.hasMany(models.Booking, {
                foreignKey: 'show_id',
                as: 'bookings'
            });
        }
    }
    Show.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        start_time: DataTypes.DATE,
        total_seats: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Show',
    });
    return Show;
};
