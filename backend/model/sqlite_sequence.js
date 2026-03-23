module.exports = function (sequelize, DataTypes) {
  const SqliteSequence = sequelize.define('sqlite_sequence', {
    trial708: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      comment: "Временное поле для тестирования"
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: "Имя таблицы базы данных"
    },
    seq: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: "Последовательность нумерации"
    }
  });

  return SqliteSequence;
};