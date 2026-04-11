// В этом документе реализована интерактивная среда с фильтрацией, сортировкой и «живым» редактированием прямо в строке таблицы.
// управляет данными студентов и их принадлежностью к группам. Главная особенность здесь — связанность данных:
// студент не существует в вакууме, он всегда привязан к group_id.
// Файл обеспечивает целостность этой связи при создании и обновлении записей.

import { useState, useEffect } from "react";
import http from "../http-common";

const ListStudents = () => {
	const [students, setStudents] = useState([]); // Весь список из БД
	const [groups, setGroups] = useState([]); // Список групп для выпадающих меню
	const [fio, setFio] = useState("");
	const [selectedGroup, setSelectedGroup] = useState(""); // Выбранная группа
	const [error, setError] = useState(null);
	const [editingStudent, setEditingStudent] = useState(null); // ID студента, которого редактируем
	const [editName, setEditName] = useState("");
	const [editGroupId, setEditGroupId] = useState("");
	const [selectedGroupFilter, setSelectedGroupFilter] = useState(""); // Состояние фильтра

	useEffect(() => {
		loadData();
	}, []);

	// Режим правки
	// При нажатии на «карандаш» не просто открываем форму, копируем данные студента в буфер
	// Если пользователь передумает и нажмет «отмена» (cancelEdit), оригинальные данные в таблице не пострадают
	const startEdit = (student) => { //включеня режима правки
		setEditingStudent(student.id);
		setEditName(student.name);
		setEditGroupId(student.group_id);
	};

	const cancelEdit = () => { // выключение режима правки
		setEditingStudent(null);
	};

	// Сохранение изменений
	// Отправляет обновленные данные на сервер
	// После успеха зануляем editingStudent, и строка превращается из формы ввода в обычный текст
	const handleUpdate = async (id) => { // сохранение на бекенд
		try {
			await http.post(`/UpdateStudent/${id}`, {
				name: editName,
				group_id: editGroupId
			});
			setEditingStudent(null);
			loadData(); // Обновляем таблицу
		} catch (e) {
			console.error(e);
			alert("Ошибка при обновлении");
		}
	};

	// Загрузка данных
	// загружаем два массива одновременно.
	// Группы нужны, чтобы в таблице вместо group_id: 5 показать «ИБ-31»
	const loadData = async () => {
		try {
			// Сбрасываем старую ошибку
			setError(null);
			// Асинхронный запрос
			const resStudents = await http.get("/listStudents");
			setStudents(resStudents.data);

			const resGroups = await http.get("/listStudentGroups");
			setGroups(resGroups.data);
		} catch (err) {
			console.log(err);
			setError("Не удалось загрузить данные");
		}
	};

	// Фильтрация и Сортировка
	const filteredAndSortedStudents = students
		.filter(s => {
			// Если фильтр не выбран, показываем всех. 
			// Если выбрана — оставляем только тех, чей group_id совпал.
			// Приводим к строке, так как id из селекта может быть строкой, а в объекте числом.
			return !selectedGroupFilter ? true : String(s.group_id) === String(selectedGroupFilter);
		})
		// localeCompare — лучший способ сортировать ФИО на русском языке
		// он учитывает алфавитный порядок и специфические символы.
		.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

	// превращает данные из полей ввода в запись бд.
	const handleAdd = async (e) => {
		// Отмена перезагрузки
		e.preventDefault();
		try {
			// Отправка данных на сервер
			await http.post("/addStudent", {
				name: fio,
				group_id: selectedGroup
			});
			// Очистка переменных
			setFio("");
			setSelectedGroup("");

			// Синхронизация интерфейса
			loadData();
		} catch (e) {
			// Обработка провала
			alert("Ошибка при добавлении");
		}
	};

	const handleDelete = (id) => {
		// Проверка решимости
		if (window.confirm("Вы точно хотите удалить этого студента?")) {
			// Запрос на удаление через post
			http.post(`/deleteStudent/${id}`)
				// Обновление при успехе
				.then(() => loadData())
				// Логирование ошибок
				.catch(e => console.error("Ошибка удаления:", e));
		}
	};

	return (
		<div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
			<h2 style={{ color: "#333", borderBottom: "2px solid #555", paddingBottom: "10px" }}>
				Управление студентами
			</h2>

			{/* Условный рендеринг.
			Если в состоянии error есть текст, React покажет его красным цветом.
			Если ошибки нет (null), этот блок вообще не попадет в DOM. */}
			{error && <p style={{ color: "red" }}>{error}</p>}

			{/* добавление студента */}
			<div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "30px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
				<h4 style={{ marginTop: 0 }}>Добавить нового студента</h4>
				<form onSubmit={handleAdd} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
					<input
						type="text"
						placeholder="ФИО студента"
						value={fio}
						onChange={(e) => setFio(e.target.value)}
						required
					/>

					<select
						value={selectedGroup}
						onChange={(e) => setSelectedGroup(e.target.value)}
						required
					>
						<option value="">Выберите группу</option>
						{groups.map(g => (
							<option key={g.id} value={g.id}>{g.name}</option>
						))}
					</select>

					<button type="submit">Добавить</button>
				</form>
			</div>

			{/* фильтрация */}
			<div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
				<label style={{ fontWeight: "bold" }}>Показать группу:</label>
				<select
					value={selectedGroupFilter}
					onChange={(e) => setSelectedGroupFilter(e.target.value)}
					style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
				>
					<option value="">Все группы</option>
					{groups.map(g => (
						<option key={g.id} value={g.id}>{g.name}</option>
					))}
				</select>

				{/* Кнопка сброса фильтрации: появляется только если selectedGroupFilter не пустой т.е. когда фильтр активен */}
				{selectedGroupFilter && (
					<button
						onClick={() => setSelectedGroupFilter("")}
						style={{
							border: "none",
							background: "none",
							color: "#007bff",
							cursor: "pointer",
							textDecoration: "underline",
							fontSize: "14px"
						}}
					>
						Сбросить
					</button>
				)}
			</div>

			{/* таблица данных */}
			<table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
				<thead>
					<tr style={{ backgroundColor: "#333", color: "white", textAlign: "left" }}>
						<th style={{ padding: "12px", width: "80px" }}>ID</th>
						<th style={{ padding: "12px" }}>ФИО студента</th>
						<th style={{ padding: "12px" }}>Группа</th> {/* Добавили заголовок */}
						<th style={{ padding: "12px", width: "120px", textAlign: "center" }}>Действия</th>
					</tr>
				</thead>
				<tbody style={{ verticalAlign: "middle" }}>
					{students.length > 0 ? (
						// переключение между режимами редактирования и чтения
						filteredAndSortedStudents.map((s, index) => (
							<tr key={s.id} style={{ borderBottom: "1px solid #ddd", backgroundColor: index % 2 === 0 ? "#fff" : "#fcfcfc" }}>
								{/* ID */}
								<td style={{ padding: "12px", color: "#666" }}>{s.id}</td>

								{/* ФИО студента */}
								{/* Если editingStudent совпадает с ID текущего студента, ячейка превращается в поле ввода.
								В противном случае — это просто текст.
								Это позволяет редактировать данные, не переходя на другие страницы. */}
								<td style={{ padding: "12px" }}>
									{editingStudent === s.id ? (
										<input
											value={editName}
											onChange={(e) => setEditName(e.target.value)}
											style={{ width: "90%", padding: "4px" }}
										/>
									) : (
										s.name
									)}
								</td>

								{/* Группа */}
								{/* используем тернарный оператор, чтобы вытащить имя группы из связанного объекта.
								Если связи нет, пишем «Не назначена» */}
								<td style={{ padding: "12px" }}>
									{editingStudent === s.id ? (
										<select
											value={editGroupId}
											onChange={(e) => setEditGroupId(e.target.value)}
											style={{ padding: "4px" }}
										>
											{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
										</select>
									) : (
										s.student_group ? s.student_group.name : "Не назначена"
									)}
								</td>

								{/* ДЕЙСТВИЯ (как у преподавателей) */}
								<td style={{ padding: "12px", textAlign: "center" }}>
									<div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
										{editingStudent === s.id ? (
											<>
												<button
													onClick={() => handleUpdate(s.id)}
													style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
													title="Сохранить"
												>
													💾
												</button>
												<button
													onClick={cancelEdit}
													style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
													title="Отмена"
												>
													✖
												</button>
											</>
										) : (
											<>
												<button
													onClick={() => startEdit(s)}
													style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
													title="Изменить"
												>
													✏️
												</button>
												<button
													onClick={() => handleDelete(s.id)}
													style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
													title="Удалить"
												>
													🗑️
												</button>
											</>
										)}
									</div>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "#999" }}>
								Студентов пока нет.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div >
	);
};

export default ListStudents;