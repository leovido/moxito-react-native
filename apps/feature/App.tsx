import { Provider } from 'react-redux';
import { store } from './index';

export default function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}