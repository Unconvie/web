module.exports = function (sequelize, DataTypes) {
  const AttestationBook = sequelize.define('attestation_book', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "Первичный ключ"
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Название темы"
    },
    mark: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Оценка студента"
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Ссылка на студента",
      references: {
        model: 'student',
        key: 'id'
      }
    },
    student_group_session_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Ссылка на сессию группы",
      references: {
        model: 'student_group_session',
        key: 'id'
      }
    },
    trial708: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      comment: "Временное поле"
    }
  });

  return AttestationBook;
};