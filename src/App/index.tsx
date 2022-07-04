import { Provider } from 'react-redux';
import { store } from '../services/store';
import AppRouter from '../layouts/AppRouter';
import './app.scss';

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
