const Store = (sequelize, DataTypes) => {
  const model = sequelize.define('Store', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  model.associate = (models) => {
    model.hasMany(models.ProductStock, { foreignKey: 'store_id', as: 'stocks' });
    model.hasMany(models.Sale, { foreignKey: 'store_id' });
    model.hasMany(models.Return, { foreignKey: 'store_id' });
    model.hasMany(models.StockRequest, { foreignKey: 'store_id' });
  };

  return model;
};

export default Store;
