module.exports = (sequelize, DataTypes) => {
  let decision = sequelize.define('decision', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    decision_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    proceeding_id: { type: DataTypes.INTEGER.UNSIGNED },
    prev_id: { type: DataTypes.INTEGER.UNSIGNED },
    next_id: { type: DataTypes.INTEGER.UNSIGNED },
    state: { type: DataTypes.TINYINT.UNSIGNED },
    meeting_datetime: { type: DataTypes.DATE },
    expiry_datetime: { type: DataTypes.DATE },
    title: { type: DataTypes.STRING(32) },
    description: { type: DataTypes.TEXT },
    total_elapsed_time: { type: DataTypes.INTEGER.UNSIGNED },
    total_difference: { type: DataTypes.BIGINT }
  }, {
      timestamps: false,
      tableName: 'decision'
    });
  return decision;
};
