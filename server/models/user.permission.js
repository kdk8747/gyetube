module.exports = (sequelize, DataTypes) => {
  let user_permission = sequelize.define('user_permission', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    member: { type: DataTypes.TINYINT.UNSIGNED },
    role: { type: DataTypes.TINYINT.UNSIGNED },
    proceeding: { type: DataTypes.TINYINT.UNSIGNED },
    decision: { type: DataTypes.TINYINT.UNSIGNED },
    activity: { type: DataTypes.TINYINT.UNSIGNED },
    receipt: { type: DataTypes.TINYINT.UNSIGNED }
  }, {
      timestamps: false,
      tableName: 'user_permission'
    });
  return user_permission;
};
