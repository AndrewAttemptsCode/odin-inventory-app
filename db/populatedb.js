require('dotenv').config();
const { Client } = require('pg');

const SQL = `
  CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT,
  release_date DATE,
  rating FLOAT,
  summary TEXT,
  );

  CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  movie_id INTEGER REFERENCES movies(id),
  category TEXT
  );

  CREATE TABLE IF NOT EXISTS directors_info (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name TEXT,
  last_name TEXT,
  bio TEXT
  );
  
  CREATE TABLE IF NOT EXISTS directors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  movie_id INTEGER REFERENCES movies(id),
  director_id INTEGER REFERENCES directors_info(id) 
  );

  INSERT INTO movies (title, release_date, rating, summary)
  VALUES
    ('Dunkirk', '2017-07-21', 7.8, 'A gripping World War II drama depicting the desperate evacuation of Allied soldiers from Dunkirk, told through three interwoven perspectives: land, sea, and air.'),
    ('Interstellar', '2014-11-07', 8.7, 'A team of astronauts travels through a wormhole in search of a new home for humanity as Earth faces ecological collapse.'),
    ('The Prestige', '2006-11-10', 8.5, 'Two rival magicians in 19th-century London engage in an escalating battle of deception, obsession, and sacrifice to create the ultimate illusion.'),
    ('Whiplash', '2014-10-10', 8.5, 'A young jazz drummer enrolls in a prestigious music conservatory, where he faces intense psychological and physical challenges under a ruthless instructor.');

  INSERT INTO genres (movie_id, category)
  VALUES
    (1, 'Action'),
    (1, 'Drama'),
    (1, 'History'),
    (2, 'Sci-Fi'),
    (2, 'Drama'),
    (3, 'History'),
    (3, 'Drama'),
    (3, 'Mystery'),
    (4, 'Drama'),
    (4, 'Music');

  INSERT INTO directors_info (first_name, last_name, bio)
  VALUES
    ('Christopher', 'Nolan', 'info about director to fill in later'),
    ('Damien', 'Chazelle', 'info about director fill in later');

  INSERT INTO directors (movie_id, director_id)
  VALUES
    (1, 1),
    (2, 1),
    (3, 1),
    (4, 2);
`;

const main = async () => {
  const env = process.argv[2] || 'dev';
  const dbURL =
    env === 'dev'
    ? process.env.DEV_DATABASE_URL
    : process.env.PROD_DATABASE_URL

  console.log('Seeding...');
  
  const client = new Client({
    connectionString: dbURL
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('Finished');
};

main();