module.exports = (sequelize, DataTypes) => {
  let receipt = sequelize.define('receipt', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    receipt_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    decision_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    activity_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    creator_id: { type: DataTypes.INTEGER.UNSIGNED },
    modified_datetime: { type: DataTypes.DATE },
    settlement_datetime: { type: DataTypes.DATE },
    title: { type: DataTypes.STRING(32) },
    image_url: { type: DataTypes.TEXT, allowNull: true },
    difference: { type: DataTypes.BIGINT }
  }, {
      timestamps: false,
      tableName: 'receipt'
    });
  return receipt;
};
