import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Мы явно указываем на твой JSX файл

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);