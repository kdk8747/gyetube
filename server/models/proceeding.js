module.exports = (sequelize, DataTypes) => {
  let proceeding = sequelize.define('proceeding', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    proceeding_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    prev_id: { type: DataTypes.INTEGER.UNSIGNED },
    next_id: { type: DataTypes.INTEGER.UNSIGNED },
    state: { type: DataTypes.TINYINT.UNSIGNED },
    created_datetime: { type: DataTypes.DATE },
    meeting_datetime: { type: DataTypes.DATE },
    title: { type: DataTypes.STRING(32) },
    description: { type: DataTypes.TEXT }
  }, {
      timestamps: false,
      tableName: 'proceeding'
    });
  return proceeding;
};
