module.exports = (sequelize, DataTypes) => {
  let group = sequelize.define('group', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    url_segment: { type: DataTypes.STRING(32), unique: true },
    title: { type: DataTypes.STRING(32) },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.TEXT },
    created_datetime: { type: DataTypes.DATE }
  }, {
      timestamps: false,
      tableName: 'group'
    });
  return group;
};
