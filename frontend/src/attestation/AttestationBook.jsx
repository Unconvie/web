// место, где все данные пересекаются.
// Здесь фиксируется результат обучения: какой студент, по какому предмету, у какого преподавателя и какую оценку получил.
// отвечает за выставление оценок конкретным людям

import { useState, useEffect } from "react";
import http from "../http-common";

// состояния, подготовка данных
const AttestationBook = () => {
	// Хранит все записи из таблицы аттестации.
	const [records, setRecords] = useState([]);

	// Списки для выпадающих меню
	// (чтобы мы могли выбрать существующего студента и существующий предмет).
	const [students, setStudents] = useState([]);
	const [sessions, setSessions] = useState([]);

	// Данные формы для добавления новой записи.
	const [selectedStudent, setSelectedStudent] = useState("");
	const [selectedSession, setSelectedSession] = useState("");
	const [grade, setGrade] = useState("");

	// Состояния для «режима редактирования» прямо в таблице.
	const [editingId, setEditingId] = useState(null);
	const [editMark, setEditMark] = useState("");
	const [editSessionId, setEditSessionId] = useState(""); // для хранения ID сессии при редактировании
	// Строка, по которой мы отсеиваем лишние записи в таблице
	const [filterDiscipline, setFilterDiscipline] = useState(""); // хранение выбранного фильтра

	// загрузка данных
	useEffect(() => {
		loadRecords();
		// Убираем /api, так как сервер их не ждет по этому адресу
		http.get("/ListStudents").then(res => setStudents(res.data));
		http.get("/ListSessions").then(res => setSessions(res.data));
	}, []);

	// // загрузка данных
	const loadRecords = () => {
		http.get("/ListAttestation")
			.then(response => {
				setRecords(response.data);
			})
			.catch(e => {
				console.log(e);
			});
	};

	// добавление записи
	const handleAdd = async () => {
		try {
			// async/await — более современный и «чистый» способ писать асинхронный код, чем .then()
			// отправляем ID студента, ID сессии и саму оценку.
			await http.post("/AddAttestation", {
				student_id: selectedStudent,
				student_group_session_id: selectedSession,
				mark: grade // База ждет 'mark', а значение берем из стейта 'grade'
			});

			setGrade(""); // Очистить инпут
			loadRecords(); // Обновить таблицу
		} catch (e) {
			console.error("Ошибка при отправке:", e);
			alert("Ошибка при добавлении");
		}
	};
	// удаление записи
	// Использует стандартный window.confirm
	// Если нажать «ОК», отправляется запрос DELETE на сервер.
	const handleDelete = async (id) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			try {
				await http.delete(`/DeleteAttestation/${id}`);
				loadRecords(); // Обновляем таблицу
			} catch (e) {
				console.error("Ошибка при удалении:", e);
				alert("Не удалось удалить запись");
			}
		}
	};

	// Редактирование записи
	const handleUpdate = async (id) => {
		try {
			if (!editSessionId) {
				alert("Выберите дисциплину");
				return;
			}
			// собирает новые данные (измененную оценку или предмет)
			const dataToUpdate = {
				mark: editMark,
				student_group_session_id: parseInt(editSessionId) // Преобразуем в число явно
			};

			// и отправляет их методом PUT
			console.log("Отправляем на сервер:", dataToUpdate);
			await http.put(`/UpdateAttestation/${id}`, dataToUpdate);

			// После успеха мы сбрасываем editingId в null
			// и строка таблицы снова становится обычной, а не редактируемой.
			setEditingId(null);
			loadRecords();
		} catch (e) {
			console.error("Детали ошибки:", e.response?.data || e.message);
			alert("Ошибка при сохранении");
		}
	};


	// Получаем уникальный(через new set) список всех дисциплин,
	// которые уже есть в аттестации и создает массив для фильтрации
	const uniqueDisciplines = [...new Set(records
		.map(r => r.student_group_session?.teacher_discipline?.discipline?.name)
		.filter(name => name) // Убираем пустые значения
	)];
	// отфильтрованный массив, который и будем выводить в таблице
	// Сначала фильтруем, а потом сортируем результат по алфавиту
	const filteredRecords = (filterDiscipline
		? records.filter(r => r.student_group_session?.teacher_discipline?.discipline?.name === filterDiscipline)
		: records)
		// берем имена студентов, переводим в нижний регистр, сравниваем через localeCompare
		// Так список всегда будет по алфавиту
		.sort((a, b) => {
			const nameA = a.student?.name?.toLowerCase() || "";
			const nameB = b.student?.name?.toLowerCase() || "";
			return nameA.localeCompare(nameB);
		});
	console.log("Выбранный студент:", selectedStudent);
	console.log("Данные студента:", students.find(st => st.id == selectedStudent));
	console.log("Доступные сессии:", sessions);

	// Подсветка оценок в таблице
	// анализирует оценку и возвращает объект со стилями:
	// 5 - зеленый, 4 - синий, 3 - оранжевый, 2 - красный
	const getMarkStyle = (mark) => {
		const baseStyle = {
			padding: "4px 8px",
			borderRadius: "4px",
			color: "white",
			fontWeight: "bold",
			display: "inline-block",
			minWidth: "20px",
			textAlign: "center"
		};

		switch (String(mark)) {
			case "5": return { ...baseStyle, backgroundColor: "#28a745" }; // Зеленый
			case "4": return { ...baseStyle, backgroundColor: "#007bff" }; // Синий
			case "3": return { ...baseStyle, backgroundColor: "#ffc107", color: "#000" }; // Оранжевый
			case "2": return { ...baseStyle, backgroundColor: "#dc3545" }; // Красный
			default: return { ...baseStyle, backgroundColor: "#6c757d" }; // Серый для прочих
		}
	};

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h2>Аттестационная книжка</h2>

			{/* Блок добавления новой оценки */}
			<div style={{
				marginBottom: "30px",
				padding: "20px",
				backgroundColor: "#f9f9f9",
				borderRadius: "8px",
				border: "1px solid #ddd"
			}}>
				<h3 style={{ marginTop: 0 }}>Выставить новую оценку</h3>
				<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>

					{/* Выбор студента */}
					{/* выпадающий список. Мы берем массив students, который загрузили ранее,
					и превращаем каждого студента в строку списка. value — это ID студента. */}
					<select
						value={selectedStudent}
						onChange={(e) => setSelectedStudent(e.target.value)}
						style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minWidth: "200px" }}
					>
						<option value="">Выберите студента...</option>
						{students.map(s => (
							<option key={s.id} value={s.id}>{s.name}</option>
						))}
					</select>

					{/* Выбор сессии (Предмет + Группа) */}
					<select
						value={selectedSession}
						onChange={(e) => setSelectedSession(e.target.value)}
						style={{ padding: "8px", flex: 2, borderRadius: "4px", border: "1px solid #ccc" }}
						// Пока не выберешь студента, список предметов заблокирован. исключает хаос.
						disabled={!selectedStudent}
					>
						<option value="">
							{selectedStudent ? "Выберите предмет..." : "Сначала выберите студента"}
						</option>
						{sessions
							// ищем в базе текущую группу выбранного студента и показываем в списке только те учебные сессии,
							// которые относятся к его группе. Студент из группы «А» не увидит предметов группы «Б».
							.filter(s => {
								const student = students.find(st => st.id == selectedStudent);
								if (!student) return false;
								return String(s.student_group_id) === String(student.group_id);
							})
							.map(s => {
								// Извлекаем данные для удобства
								const disciplineName = s.teacher_discipline?.discipline?.name || "Без названия";
								const reportName = s.report_type?.name || "—";
								const teacherName = s.teacher_discipline?.teacher?.name || "Преподаватель не указан";

								return (
									<option key={s.id} value={s.id}>
										{/* Формат: Дисциплина (Тип контроля) — (Преподаватель) */}
										{disciplineName} ({reportName}) — ({teacherName})
									</option>
								);
							})
						}
					</select>


					{/* Поле для оценки */}
					{/* Заменяем input на select для валидации */}
					<select
						value={grade}
						onChange={(e) => setGrade(e.target.value)}
						style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "150px" }}
					>
						<option value="">Оценка...</option>
						<option value="5">5 (Отлично)</option>
						<option value="4">4 (Хорошо)</option>
						<option value="3">3 (Удовл.)</option>
						<option value="2">2 (Неуд.)</option>
					</select>

					{/* Кнопка станет активной (и поменяет цвет с серого на зеленый) только тогда,
						когда заполнены все три поля, чтобы не отправить в базу пустую запись. */}
					<button
						onClick={handleAdd}
						disabled={!selectedStudent || !selectedSession || !grade} // Блокировка
						style={{
							padding: "8px 20px",
							backgroundColor: (!selectedStudent || !selectedSession || !grade) ? "#ccc" : "#28a745",
							color: "white",
							border: "none",
							borderRadius: "4px",
							cursor: (!selectedStudent || !selectedSession || !grade) ? "not-allowed" : "pointer",
							fontWeight: "bold",
							transition: "background-color 0.3s"
						}}
					>
						+ Добавить
					</button>
				</div>
			</div>
			<div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
				<label>Фильтр по дисциплине:</label>
				<select
					value={filterDiscipline}
					onChange={(e) => setFilterDiscipline(e.target.value)}
					style={{ padding: "5px", borderRadius: "4px" }}
				>
					<option value="">Все предметы</option>
					{/* Позволяет быстро отсеять оценки по конкретному предмету
					Если выбрана дисциплина, кнопка «Сбросить» появляется автоматически. */}
					{uniqueDisciplines.map(name => (
						<option key={name} value={name}>{name}</option>
					))}
				</select>
				{filterDiscipline && (
					<button
						onClick={() => setFilterDiscipline("")}
						style={{ border: "none", background: "none", color: "blue", cursor: "pointer", textDecoration: "underline" }}
					>
						Сбросить
					</button>
				)}
			</div>

			{/* Таблица с результатами */}
			{/* реализовано переключение между режимом просмотра и режимом редактирования. */}
			<table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
				<thead>
					<tr style={{ backgroundColor: "#333", color: "white", textAlign: "left" }}>
						<th style={{ padding: "12px", border: "1px solid #444" }}>Студент</th>
						<th style={{ padding: "12px", border: "1px solid #444" }}>Дисциплина</th>
						<th style={{ padding: "12px", border: "1px solid #444" }}>Оценка</th>
						<th style={{ padding: "12px", border: "1px solid #444" }}>Контроль</th>
						<th style={{ padding: "12px", border: "1px solid #444" }}>Действия</th>
					</tr>
				</thead>
				<tbody>
					{/* Проверка: если в массиве есть хоть одна запись, рисуем таблицу
					Если нет — сработает условие в конце (которое выводит «Записей нет»). */}
					{filteredRecords.length > 0 ? (
						// Цикл, который проходит по каждой записи (r) в отфильтрованном списке и создает для неё строку таблицы <tr>
						filteredRecords.map((r) => (
							// Обязательный для React атрибут
							// Позволяет движку понимать, какую именно строку нужно обновить при изменениях
							// не перерисовывая всю таблицу целиком.
							<tr key={r.id}>
								{/* Если мы НЕ редактируем (Просмотр): */}
								{/* Использование ? страхует от ошибки «Cannot read property 'name' of null»
								если вдруг запись в базе есть, а связи со студентом нет. */}
								<td style={{ padding: "12px" }}>{r.student?.name}</td>
								<td style={{ padding: "12px", border: "1px solid #ddd" }}>
									{/* Условие переключения между режимами, Для каждой строки проверяется */}
									{/* срабатывает, когда нажимаешь кнопку «Карандаш» и editingId становится равен ID этой строки. */}
									{editingId === r.id ? (
										<select
											// ищем в общем списке сессий ту, чей ID сейчас редактируется (editSessionId)
											// и вытаскиваем из неё название дисциплины, чтобы селект сразу показывал текущий предмет.
											value={sessions.find(s => s.id == editSessionId)?.teacher_discipline?.discipline?.name || ""}
											// Когда ты выбираешь другой предмет в списке:
											onChange={(e) => {
												// запоминаем выбранное название
												const selectedDiscName = e.target.value;
												// находим ID группы текущего студента
												const studentGroupId = r.student_group_session?.student_group_id;
												// Ищем в списке sessions ту запись, где название совпадает и группа совпадает.
												const newSession = sessions.find(s =>
													s.teacher_discipline?.discipline?.name === selectedDiscName &&
													String(s.student_group_id) === String(studentGroupId)
												);
												// Обновляем editSessionId новым ID
												// гарантирует, что не привяжешь студенту предмет от чужой группы.
												if (newSession) {
													setEditSessionId(newSession.id);
												}
											}}
										>
											{/* Генерация списка дисциплин для выбора */}
											<option value="">Выберите дисциплину...</option>
											{/* «Чистка» дубликатов
											Если один предмет ведут два преподавателя, в списке названий он появится один раз */}
											{[...new Set(sessions
												// Оставляем только те предметы, которые проводятся у группы этого студента.
												.filter(s => String(s.student_group_id) === String(r.student_group_session?.student_group_id))
												// Вытаскиваем только названия.
												.map(s => s.teacher_discipline?.discipline?.name)
											)].map(name => {
												const sess = sessions.find(s =>
													s.teacher_discipline?.discipline?.name === name &&
													String(s.student_group_id) === String(r.student_group_session?.student_group_id)
												);
												const tName = sess?.teacher_discipline?.teacher?.name;
												return (
													<option key={name} value={name}>
														{name} {tName ? `— ${tName}` : ""}
													</option>
												);
											})}
										</select>
									) : (
										// Жирным шрифтом выводит название дисциплины.
										<div>
											<div style={{ fontWeight: "500" }}>
												{r.student_group_session?.teacher_discipline?.discipline?.name || "—"}
											</div>
											{/* мелким серым шрифтом имя преподавателя. */}
											<div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
												{/* Обращаемся к teacher напрямую, как в логах терминала */}
												{r.student_group_session?.teacher_discipline?.teacher?.name || "Преподаватель не указан"}
											</div>
										</div>
									)}
								</td>

								{/* Ячейка с оценкой */}
								<td style={{ padding: "12px" }}>
									{editingId === r.id ? (
										<select
											value={editMark}
											onChange={(e) => setEditMark(e.target.value)}
											style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
										>
											<option value="5">5 (Отлично)</option>
											<option value="4">4 (Хорошо)</option>
											<option value="3">3 (Удовл.)</option>
											<option value="2">2 (Неуд.)</option>
										</select>
									) : (
										// вызывается функция, которая красит «5» в зеленый, а «2» в красный.
										<span style={getMarkStyle(r.mark)}>{r.mark || "—"}</span>
									)}
								</td>
								<td style={{ padding: "12px", border: "1px solid #ddd" }}>
									{editingId === r.id ? (
										<select
											value={editSessionId} // Здесь должен быть ID текущей сессии
											onChange={(e) => setEditSessionId(e.target.value)} // МЕНЯЕМ ID СЕССИИ ТУТ
											style={{ width: "100%" }}
										>
											{sessions
												.filter(s => {
													// Находим дисциплину, которая сейчас выбрана в первом селекте (по названию)
													const currentSess = sessions.find(sess => String(sess.id) === String(editSessionId));
													const currentDiscName = currentSess?.teacher_discipline?.discipline?.name;
													const studentGroupId = r.student_group_session?.student_group_id;

													// Оставляем только те сессии, где совпадает название дисциплины и группа студента
													return s.teacher_discipline?.discipline?.name === currentDiscName &&
														String(s.student_group_id) === String(studentGroupId);
												})
												.map(s => (
													<option key={s.id} value={s.id}>
														{/* Теперь здесь будет: "Экзамен — Валерий Владимирович" */}
														{s.report_type?.name} — {s.teacher_discipline?.teacher?.name || "Преподаватель не указан"}
													</option>
												))
											}
										</select>
									) : (
										r.student_group_session?.report_type?.name || "—"
									)}
								</td>
								{/* Ячейка с кнопками */}
								<td style={{ padding: "12px", textAlign: "center" }}>
									{editingId === r.id ? (
										<>
											<button onClick={() => handleUpdate(r.id)} style={{ marginRight: "5px", color: "green" }}>💾</button>
											<button onClick={() => setEditingId(null)} style={{ color: "gray" }}>✖</button>
										</>
									) : (
										<>
											{/* Редактирование */}
											<button
												onClick={() => {
													setEditingId(r.id);
													// Вместо оценки — выпадающий список с цифрами 2, 3, 4, 5.
													setEditMark(r.mark);
													// Вместо названия дисциплины — <select>, где можно выбрать другой предмет (только для этой же группы).
													setEditSessionId(r.student_group_session_id); // чтобы селект сразу открылся на нужном предмете
												}}
												style={{ marginRight: "10px", cursor: "pointer", border: "none", background: "none" }}
											>
												✏️
											</button>
											<button onClick={() => handleDelete(r.id)} style={{ color: "red", cursor: "pointer" }}>
												🗑️
											</button>
										</>
										// Если строка редактируется, мы видим кнопки «Сохранить» и «Отмена».
										// Если нет — кнопки «Изменить» и «Удалить»
									)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>
								{filterDiscipline ? "По выбранной дисциплине записей нет" : "Записей пока нет"}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default AttestationBook;