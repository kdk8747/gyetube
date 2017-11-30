module.exports = (sequelize, DataTypes) => {
  let member = sequelize.define('member', {
    group_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    member_id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
    decision_id: { type: DataTypes.INTEGER.UNSIGNED },
    prev_id: { type: DataTypes.INTEGER.UNSIGNED },
    next_id: { type: DataTypes.INTEGER.UNSIGNED },
    state: { type: DataTypes.TINYINT.UNSIGNED },
    creator_id: { type: DataTypes.INTEGER.UNSIGNED },
    modified_datetime: { type: DataTypes.DATE },
    user_id: { type: DataTypes.UUID },
    image_url: { type: DataTypes.TEXT },
    name: { type: DataTypes.STRING(32) }
  }, {
      timestamps: false,
      tableName: 'member'
    });
  return member;
};
