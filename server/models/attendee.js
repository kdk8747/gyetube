module.exports = (sequelize, DataTypes) => {
  let attendee = sequelize.define('attendee', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    proceeding_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    member_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    state: { type: DataTypes.TINYINT.UNSIGNED }
  }, {
      timestamps: false,
      tableName: 'attendee'
    });
  return attendee;
};
