module.exports = (sequelize, DataTypes) => {
  let user = sequelize.define('user', {
    user_id: { type: DataTypes.UUID, primaryKey: true },
    image_url: { type: DataTypes.TEXT },
    third_party: { type: DataTypes.STRING(16) },
    third_party_access_token: { type: DataTypes.STRING(64) }
  }, {
      timestamps: false,
      tableName: 'user'
    });
  return user;
};
