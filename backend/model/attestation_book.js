// Главная таблица — электронный журнал. Хранит саму оценку, ID студента и ID сессии. Именно её мы видим и редактируем на фронтенде.
module.exports = function (sequelize, DataTypes) {
	// объявление модели, define это метод sequelize который
	//  говорит создать в js объект который будет 
	// зеркалом таблицы attestation_book в базе
	const AttestationBook = sequelize.define('attestation_book', {
		id: {
			// autoIncrement:true - чтобы база сама ставила ID
			//  каждой новой оценке
			autoIncrement: true,
			type: DataTypes.INTEGER,
			// запрет на «пустоту» в данной колонке
			allowNull: false,
			// назначение поля «Главным» (Первичным ключом), не может быть пустым allowNull всегда false
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
			// references описание Foreign key(внешнего ключа)
			//  на уровне определения столбца, говорим что в этом поле может быть только
			// тот ID котоырй реально существует в таблице студентов
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

	//Мы возвращаем настроенный объект модели, чтобы потом
	//  использовать его в контроллерах для
	//  запросов вроде AttestationBook.findAll()
	return AttestationBook;
};