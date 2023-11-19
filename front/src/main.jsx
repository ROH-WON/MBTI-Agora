import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'react-calendar/dist/Calendar.css';
import './components/MyPage/MyCalendar.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
);
