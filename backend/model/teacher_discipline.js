module.exports = function (sequelize, DataTypes) {
  const TeacherDiscipline = sequelize.define('teacher_discipline', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "Первичный ключ записи"
    },
    discipline_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Внешний ключ на дисциплину",
      references: {
        model: 'discipline',
        key: 'id'
      }
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Внешний ключ на преподавателя",
      references: {
        model: 'teacher',
        key: 'id'
      }
    },
    trial708: {
      type: DataTypes.CHAR(1),
      allowNull: true,
      comment: "Поле для тестирования"
    }
  });

  return TeacherDiscipline;
};