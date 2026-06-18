import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'https://place-picker-react-beta.vercel.app' }));
app.use(express.static('images'));
app.use(bodyParser.json());

app.get('/places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/places.json');
    const placesData = JSON.parse(fileContent);
    res.status(200).json({ places: placesData });
  } catch (err) {
    console.error('Error reading places.json:', err);
    res.status(500).json({ message: err.message });
  }
});

app.get('/user-places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/user-places.json');
    const places = JSON.parse(fileContent);
    res.status(200).json({ places });
  } catch (err) {
    console.error('Error reading user-places.json:', err);
    res.status(500).json({ message: err.message });
  }
});

app.put('/user-places', async (req, res) => {
  const places = req.body.places;
  await fs.writeFile('./data/user-places.json', JSON.stringify(places));
  res.status(200).json({ message: 'User places updated!' });
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));