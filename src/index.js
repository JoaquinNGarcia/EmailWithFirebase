import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/app/App';
import { store } from './views/store/store';
import { Provider } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
