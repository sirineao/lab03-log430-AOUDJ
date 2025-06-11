const Return = (sequelize, DataTypes) => {
  const model = sequelize.define('Return', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    synced: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });

  model.associate = (models) => {
    model.belongsTo(models.Store, { foreignKey: 'store_id' });
    model.belongsTo(models.Sale, { foreignKey: 'sale_id' });
    model.hasMany(models.ReturnItem, { foreignKey: 'return_id', as: 'items' });
  };

  return model;
};

export default Return;
