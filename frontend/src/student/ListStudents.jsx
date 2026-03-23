import React, { useState, useEffect } from "react";
import http from "../http-common";

const ListStudents = () => {
	const [students, setStudents] = useState([]);
	const [groups, setGroups] = useState([]); // Состояние для списка групп
	const [fio, setFio] = useState("");
	const [selectedGroup, setSelectedGroup] = useState(""); // Выбранная группа
	const [error, setError] = useState(null); // <-- ДОБАВИТЬ ЭТО
	const [editingStudent, setEditingStudent] = useState(null); // ID студента, которого редактируем
	const [editName, setEditName] = useState("");
	const [editGroupId, setEditGroupId] = useState("");

	useEffect(() => {
		loadData();
	}, []);

	const startEdit = (student) => { //включеня режима правки
		setEditingStudent(student.id);
		setEditName(student.name);
		setEditGroupId(student.group_id);
	};

	const cancelEdit = () => { // выключение режима правки
		setEditingStudent(null);
	};

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

	const loadData = async () => {
		try {
			setError(null); // Сбрасываем старую ошибку
			const resStudents = await http.get("/listStudents");
			setStudents(resStudents.data);

			const resGroups = await http.get("/listStudentGroups");
			setGroups(resGroups.data);
		} catch (err) {
			console.log(err);
			setError("Не удалось загрузить данные"); // <-- УСТАНАВЛИВАЕМ ТЕКСТ
		}
	};
	const handleAdd = async (e) => {
		e.preventDefault();
		try {
			await http.post("/addStudent", {
				name: fio,
				group_id: selectedGroup
			});
			setFio("");
			setSelectedGroup("");
			loadData();
		} catch (e) {
			alert("Ошибка при добавлении");
		}
	};

	const handleDelete = (id) => {
		if (window.confirm("Вы точно хотите удалить этого студента?")) {
			http.post(`/deleteStudent/${id}`)
				.then(() => loadData())
				.catch(e => console.error("Ошибка удаления:", e));
		}
	};

	return (
		<div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
			<h2 style={{ color: "#333", borderBottom: "2px solid #555", paddingBottom: "10px" }}>
				Управление студентами
			</h2>

			{error && <p style={{ color: "red" }}>{error}</p>}

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
						students.map((s, index) => (
							<tr key={s.id} style={{ borderBottom: "1px solid #ddd", backgroundColor: index % 2 === 0 ? "#fff" : "#fcfcfc" }}>
								<td style={{ padding: "12px", color: "#666" }}>{s.id}</td> {/* id */}
								<td style={{ padding: "12px" }}>{/* name */}
									{editingStudent === s.id ? (
										<input value={editName} onChange={(e) => setEditName(e.target.value)} />
									) : (
										s.name
									)}
								</td>
								<td style={{ padding: "12px" }}> {/* group */}
									{editingStudent === s.id ? (
										<select value={editGroupId} onChange={(e) => setEditGroupId(e.target.value)}>
											{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
										</select>
									) : (
										s.student_group ? s.student_group.name : "Не назначена"
									)}
								</td>
								<td style={{ padding: "12px", textAlign: "center", display: "flex", gap: "5px", justifyContent: "center" }}>
									{editingStudent === s.id ? (
										<>
											<button onClick={() => handleUpdate(s.id)} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>ОК</button>
											<button onClick={cancelEdit} style={{ backgroundColor: "#6c757d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Отмена</button>
										</>
									) : (
										<>
											<button onClick={() => startEdit(s)} style={{ backgroundColor: "#ffc107", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Изменить</button>
											<button onClick={() => handleDelete(s.id)} style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Удалить</button>
										</>
									)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "#999" }}>
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