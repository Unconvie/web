// Универсальная функция для успеха. Она всегда ставит статус 200 OK
// и отправляет данные (result), которые ей передал контроллер.
function sendResult(res, result) {
	res.status(200).send(result);
}

// Универсальная функция для провала. Всегда ставит статус 500 и отправляет текст ошибки.
function sendError(res, err) {
	res.status(500).send(err);
}

// Позволяет другим файлам через require «видеть» эти функции.
module.exports = {
	sendResult: sendResult,
	sendError: sendError
};