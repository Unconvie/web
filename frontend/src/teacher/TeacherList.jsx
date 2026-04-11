// связи многие-ко-многим
// Один преподаватель может вести несколько дисциплин, и одна дисциплина может закрепляться за разными учителями.

// управления штатом преподавателей.
// реализована логика работы с массивами ID.
// Это позволяет «пришивать» к одному человеку целый список предметов прямо при создании или редактировании.


import { useState, useEffect } from 'react';
import http from '../http-common'; // Твой конфиг axios

const TeacherList = () => {
	// массивы данных из БД
	const [teachers, setTeachers] = useState([]);
	const [disciplines, setDisciplines] = useState([]);

	// Состояние для глобального фильтра (показать всех, кто ведет «Математику»).
	const [selectedDisciplineId, setSelectedDisciplineId] = useState("");
	// Буфер для создания новой записи.
	const [newTeacherName, setNewTeacherName] = useState("");
	// Буфер для создания новой записи.
	const [selectedNewDisciplines, setSelectedNewDisciplines] = useState([]); // Массив ID
	// «Теневые» состояния.
	// Когда нажимаем «Править», данные текущего преподавателя копируются сюда,
	// чтобы менять их, не ломая основной список до момента сохранения.
	const [editingId, setEditingId] = useState(null);       // ID строки, которую правим
	const [editName, setEditName] = useState("");           // Временное имя при правке
	const [editDisciplines, setEditDisciplines] = useState([]); // ID дисциплин при правке

	// Загрузка данных
	useEffect(() => {
		retrieveTeachers();
		retrieveDisciplines();
	}, []);

	// Эти 2 метода — «разведка», которые поставляют актуальные сведения из бэкенда.
	const retrieveTeachers = () => {
		// GET-запрос по эндпоинту /listTeachers
		http.get("/listTeachers")
			.then(response => {
				// Если успех — сохраняем массив преподавателей в стейт
				setTeachers(response.data);
			})
			// Если провал — выводим ошибку в консоль для отладки
			.catch(e => console.error(e));
	};
	const retrieveDisciplines = () => {
		// Запрашиваем список всех доступных предметов
		http.get("/listDisciplines")
			.then(response => {
				// Сохраняем их, чтобы использовать в выпадающих списках
				setDisciplines(response.data);
			})
			.catch(e => console.error(e));
	};

	// фильтрация
	// логика «вложенного поиска», так как связь идет через массив.
	const filteredTeachers = selectedDisciplineId
		? teachers.filter(t =>
			// some: проверяет, есть ли в массиве дисциплин конкретного преподавателя
			// хотя бы одна запись, совпадающая с выбранным ID фильтра.
			// String: защита от конфликта типов данных
			t.disciplines && t.disciplines.some(d => String(d.id) === String(selectedDisciplineId))
		)
		// Если фильтр не выбран — отдаем полный список без изменений
		: teachers;

	// СОЗДАНИЕ
	const handleCreate = () => {
		// Валидация: пустое имя недопустимо
		if (!newTeacherName) return alert("Введите имя!");

		// Создание с массивом связей
		const data = {
			// Имя из инпута
			name: newTeacherName,
			// Массив выбранных ID предметов
			disciplineIds: selectedNewDisciplines
		};

		// Отправляем объект на сервер
		http.post("/addTeacher", data)
			.then(response => {
				console.log("Добавлено:", response.data);
				// Очищаем поле ввода
				setNewTeacherName("");
				// Сбрасываем выбранные предметы
				setSelectedNewDisciplines([]);
				// Перезагружаем список, чтобы увидеть новичка в таблице
				retrieveTeachers();
			})
			.catch(e => console.error("Ошибка при создании:", e));
	};

	// УДАЛЕНИЕ
	const handleDelete = (id) => {
		// Предохранитель от случайного нажатия
		if (window.confirm("Удалить этого преподавателя?")) {
			// Отправляем ID в URL запроса
			http.post(`/deleteTeacher/${id}`)
				// После успеха обновляем список с сервера
				.then(() => retrieveTeachers())
				.catch(e => console.error(e));
		}
	};

	// Метод для внесения правок в уже существующую запись.
	const handleUpdate = (id) => {
		// Указываем, кого именно правим
		http.post(`/updateTeacher/${id}`, {
			// Новое имя (или старое, если не меняли)
			name: editName,
			// Новый набор ID предметов
			disciplineIds: editDisciplines
		})
			.then(() => {
				// Закрываем режим редактирования (скрываем инпуты)
				setEditingId(null);
				// Обновляем данные в интерфейсе
				retrieveTeachers();
			})
			.catch(e => console.error(e));
	};

	return (
		<div style={{ padding: "20px" }}>
			<h2>Управление преподавателями</h2>

			{/* ФОРМА ДОБАВЛЕНИЯ */}
			{/* Стандартное управляемое поле для ФИО */}
			<div style={{ marginBottom: "20px", background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
				<h4>Добавить нового преподавателя:</h4>
				<input
					type="text"
					placeholder="ФИО"
					value={newTeacherName}
					onChange={(e) => setNewTeacherName(e.target.value)}
					style={{ display: "block", marginBottom: "10px", width: "300px" }}
				/>

				<p>Выберите дисциплины:</p>
				<div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
					{disciplines.map(d => (
						<label key={d.id} style={{ border: "1px solid #ccc", padding: "5px", borderRadius: "5px", cursor: "pointer" }}>
							<input
								// Чекбокс будет активен, если ID этой дисциплины уже есть в нашем массиве выбора.
								type="checkbox"
								checked={selectedNewDisciplines.includes(d.id)}
								// Здесь реализован «переключатель» (toggle).
								// Если ID уже в массиве — мы его фильтруем (удаляем),
								// если нет — добавляем через деструктуризацию [...prev, id].
								// Это позволяет выбирать сразу несколько предметов для одного учителя.
								onChange={(e) => {
									const id = d.id;
									setSelectedNewDisciplines(prev =>
										prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
									);
								}}
							/> {d.name}
						</label>
					))}
				</div>

				<button onClick={handleCreate}>Создать запись</button>
			</div>

			{/* Глобальный фильтр*/}
			<div style={{ marginBottom: "20px" }}>
				<label>Фильтр по дисциплине: </label>
				{/* Этот селект управляет тем, какие строки отобразятся в таблице ниже.
				Если выбрана дисциплина, сработает логика filteredTeachers. */}
				<select value={selectedDisciplineId} onChange={(e) => setSelectedDisciplineId(e.target.value)}>
					<option value="">Все дисциплины</option>
					{disciplines.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
				</select>
			</div>

			{/* Таблица и режим редактирования */}
			<table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr style={{ backgroundColor: "#f4f4f4" }}>
						<th>ФИО</th>
						<th>Дисциплины</th>
						<th>Действия</th>
					</tr>
				</thead>
				<tbody>
					{filteredTeachers.map(t => (
						<tr key={t.id}>
							{/* Если строка в режиме правки — показываем инпут.
							Если нет — просто текст. */}
							<td>
								{editingId === t.id ? (
									<input
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
									/>
								) : (
									t.name
								)}
							</td>
							{/* Отображение списка дисциплин */}
							<td>
								{editingId === t.id ? (
									/* Режим редактирования: показываем чекбоксы */
									<div style={{ fontSize: "0.8em", display: "flex", flexWrap: "wrap", gap: "5px" }}>
										{disciplines.map(d => (
											<label key={d.id} style={{ background: "#eee", padding: "2px 5px", borderRadius: "3px", cursor: "pointer" }}>
												<input
													type="checkbox"
													checked={editDisciplines.includes(d.id)}
													onChange={() => {
														const id = d.id;
														setEditDisciplines(prev =>
															prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
														);
													}}
												/> {d.name}
											</label>
										))}
									</div>
								) : (
									/* Обычный режим: показываем список названий дисциплин */
									t.disciplines && t.disciplines.length > 0
										// В обычном режиме мы берем массив объектов дисциплин,
										// вытаскиваем из каждого только name и склеиваем их в одну строку.
										? t.disciplines.map(d => d.name).join(", ")
										: "—"
								)}
							</td>
							{/* Кнопки управления */}
							<td>
								{editingId === t.id ? (
									<>
										<button onClick={() => handleUpdate(t.id)} style={{ marginRight: "5px", color: "green" }}>💾</button>
										<button onClick={() => setEditingId(null)} style={{ color: "gray" }}>✖</button>
									</>
								) : (
									<>
										<button onClick={() => {
											setEditingId(t.id);
											setEditName(t.name);
											setEditDisciplines(t.disciplines ? t.disciplines.map(d => d.id) : []);
										}}>✏️</button>
										<button onClick={() => handleDelete(t.id)} style={{ marginLeft: "5px" }}>🗑️</button>
									</>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TeacherList;