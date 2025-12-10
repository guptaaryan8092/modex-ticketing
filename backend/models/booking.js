'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        static associate(models) {
            // define association here
            Booking.belongsTo(models.Show, {
                foreignKey: 'show_id',
                as: 'show'
            });
        }
    }
    Booking.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        show_id: DataTypes.UUID,
        seats_requested: DataTypes.INTEGER,
        seats_assigned: DataTypes.JSONB,
        status: {
            type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'FAILED'),
            defaultValue: 'PENDING'
        }
    }, {
        sequelize,
        modelName: 'Booking',
    });
    return Booking;
};
