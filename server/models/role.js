module.exports = (sequelize, DataTypes) => {
  let role = sequelize.define('role', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    role_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    decision_id: { type: DataTypes.INTEGER.UNSIGNED },
    prev_id: { type: DataTypes.INTEGER.UNSIGNED },
    next_id: { type: DataTypes.INTEGER.UNSIGNED },
    state: { type: DataTypes.TINYINT.UNSIGNED },
    creator_id: { type: DataTypes.INTEGER.UNSIGNED },
    modified_datetime: { type: DataTypes.DATE },
    name: { type: DataTypes.STRING(32) },
    member: { type: DataTypes.TINYINT.UNSIGNED },
    role: { type: DataTypes.TINYINT.UNSIGNED },
    proceeding: { type: DataTypes.TINYINT.UNSIGNED },
    decision: { type: DataTypes.TINYINT.UNSIGNED },
    activity: { type: DataTypes.TINYINT.UNSIGNED },
    receipt: { type: DataTypes.TINYINT.UNSIGNED }
  }, {
      timestamps: false,
      tableName: 'role'
    });
  return role;
};
