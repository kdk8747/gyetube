module.exports = (sequelize, DataTypes) => {
  let url_segment = sequelize.define('url_segment', {
    url_segment: { type: DataTypes.CHAR(32), primaryKey: true },
    group_id: { type: DataTypes.INTEGER.UNSIGNED }
  }, {
      timestamps: false,
      tableName: 'url_segment'
    });
  return url_segment;
};
