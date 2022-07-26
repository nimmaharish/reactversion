import Axios from 'axios';

export async function fetchVersion() {
  const { data } = await Axios.get('/meta.json');
  return data;
}

const App = {
  fetchVersion,
};

export default App;
