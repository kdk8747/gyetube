module.exports = (sequelize, DataTypes) => {
  let activity = sequelize.define('activity', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    activity_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    decision_id: { type: DataTypes.INTEGER.UNSIGNED },
    creator_id: { type: DataTypes.BIGINT.UNSIGNED },
    modified_datetime: { type: DataTypes.DATE },
    activity_datetime: { type: DataTypes.DATE },
    title: { type: DataTypes.STRING(32) },
    description: { type: DataTypes.TEXT },
    image_urls: { type: DataTypes.TEXT, allowNull: true },
    document_urls: { type: DataTypes.TEXT, allowNull: true },
    elapsed_time: { type: DataTypes.SMALLINT.UNSIGNED },
    total_difference: { type: DataTypes.BIGINT }
  }, {
      timestamps: false,
      tableName: 'activity'
    });
  return activity;
};
