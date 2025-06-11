const Sale = (sequelize, DataTypes) => { 
    const model = sequelize.define('Sale', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
    });

    model.associate = (models) => {
        model.belongsTo(models.Store, { foreignKey: 'store_id' });
        model.hasMany(models.SaleItem, { foreignKey: 'sale_id', as: 'items' });
  };
    return model;
}

export default Sale;