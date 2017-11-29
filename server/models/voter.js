module.exports = (sequelize, DataTypes) => {
  let voter = sequelize.define('voter', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    decision_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    member_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    vote: { type: DataTypes.TINYINT.UNSIGNED }
  }, {
      timestamps: false,
      tableName: 'voter'
    });
  return voter;
};
