const Product = (sequelize, DataTypes) => {
    const model = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });

     model.associate = (models) => {
        model.hasMany(models.ProductStock, { foreignKey: 'product_id', as: 'stocks' });
        model.hasMany(models.SaleItem, { foreignKey: 'product_id' });
        model.hasMany(models.ReturnItem, { foreignKey: 'product_id' });
        model.hasMany(models.StockRequest, { foreignKey: 'product_id' });
        model.hasMany(models.LogisticsStock, { foreignKey: 'product_id' });
    };

    return model;
};

export default Product;