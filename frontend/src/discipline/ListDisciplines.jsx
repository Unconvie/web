import React, { useState, useEffect } from 'react';
import http from "../http-common";

const ListDisciplines = () => {
	const [disciplines, setDisciplines] = useState([]);
	const [name, setName] = useState(""); // Для ввода новой дисциплины
	const [error, setError] = useState("");

	// 1. Загрузка списка при открытии страницы
	useEffect(() => {
		loadDisciplines();
	}, []);

	// 2. Функция получения данных (вынесли отдельно, чтобы вызывать часто)
	const loadDisciplines = () => {
		http.get("/listDisciplines")
			.then(response => {
				setDisciplines(response.data);
				setError("");
			})
			.catch(e => {
				console.error("Ошибка загрузки:", e);
				setError("Не удалось загрузить список");
			});
	};

	// 3. Функция добавления
	const handleAdd = (e) => {
		e.preventDefault(); // Чтобы страница не перезагружалась при нажатии кнопки
		if (!name) return;
		if (!name.trim()) return; // Проверка на пустые пробелы

		// Проверяем, нет ли уже такой дисциплины в списке
		const exists = disciplines.find(d => d.name.toLowerCase() === name.toLowerCase());
		if (exists) {
			alert("Такая дисциплина уже есть в списке!");
			return;
		}

		http.post("/addDiscipline", { name: name })
			.then(() => {
				setName(""); // Очищаем поле ввода
				loadDisciplines(); // Сразу обновляем таблицу
			})
			.catch(e => {
				console.error("Ошибка добавления:", e);
				alert("Не удалось добавить дисциплину");
			});
	};

	// 4. Функция удаления
	const handleDelete = (id) => {
		if (window.confirm("Вы точно хотите удалить эту дисциплину?")) {
			// В твоих роутах прописан POST для удаления
			http.post(`/deleteDiscipline/${id}`)
				.then(() => {
					loadDisciplines(); // Сразу обновляем таблицу
				})
				.catch(e => {
					console.error("Ошибка удаления:", e);
					alert("Ошибка при удалении");
				});
		}
	};

	return (
		<div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
			<h2 style={{ color: "#333", borderBottom: "2px solid #555", paddingBottom: "10px" }}>
				Управление учебными дисциплинами
			</h2>

			{/* Секция добавления */}
			<div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "30px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
				<h4 style={{ marginTop: 0 }}>Добавить новую дисциплину</h4>
				<form onSubmit={handleAdd} style={{ display: "flex", gap: "10px" }}>
					<input
						type="text"
						placeholder="Введите название (например, Дискретная математика)"
						value={name}
						onChange={(e) => setName(e.target.value)}
						style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
					/>
					<button type="submit" style={{
						backgroundColor: "#4CAF50",
						color: "white",
						padding: "10px 20px",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
						fontWeight: "bold"
					}}>
						+ Добавить
					</button>
				</form>
			</div>

			{/* Таблица */}
			<div style={{ overflowX: "auto" }}>
				<table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
					<thead>
						<tr style={{ backgroundColor: "#333", color: "white", textAlign: "left" }}>
							<th style={{ padding: "12px", width: "80px" }}>ID</th>
							<th style={{ padding: "12px" }}>Название дисциплины</th>
							<th style={{ padding: "12px", width: "120px", textAlign: "center" }}>Действия</th>
						</tr>
					</thead>
					<tbody>
						{disciplines.length > 0 ? (
							disciplines.map((d, index) => (
								<tr key={d.id} style={{ borderBottom: "1px solid #ddd", backgroundColor: index % 2 === 0 ? "#fff" : "#fcfcfc" }}>
									<td style={{ padding: "12px", color: "#666" }}>{d.id}</td>
									<td style={{ padding: "12px", fontWeight: "500" }}>{d.name}</td>
									<td style={{ padding: "12px", textAlign: "center" }}>
										<button
											onClick={() => handleDelete(d.id)}
											style={{
												backgroundColor: "#ff4d4d",
												color: "white",
												border: "none",
												padding: "6px 12px",
												borderRadius: "4px",
												cursor: "pointer",
												fontSize: "13px"
											}}
										>
											Удалить
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="3" style={{ padding: "20px", textAlign: "center", color: "#999" }}>
									Список дисциплин пуст. Добавьте первую запись выше.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ListDisciplines;