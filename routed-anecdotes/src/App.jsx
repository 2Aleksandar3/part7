import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link,useParams } from 'react-router-dom';
import { useField } from './hooks'; 
import PropTypes from 'prop-types'; 


const Menu = () => {
  const padding = { paddingRight: 5 };
  return (
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
      <Link style={padding} to="/about">about</Link>
    </div>
  );
};

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
);

AnecdoteList.propTypes = {
  anecdotes: PropTypes.array.isRequired,  // Validate the 'anecdotes' prop as an array
};

const SingleAnecdote = ({ anecdotes }) => {
  const { id } = useParams();
  const anecdote = anecdotes.find(a => a.id === Number(id));

  if (!anecdote) {
    return <div>Anecdote not found</div>;
  }

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>{anecdote.info}</p>
      <p>Has {anecdote.votes} votes</p>
    </div>
  );
};

SingleAnecdote.propTypes = {
  anecdotes: PropTypes.array.isRequired,  // Validate the 'anecdotes' prop as an array
};

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident...</em>
    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>source code</a>.
  </div>
);

const CreateNew = ({ addNew }) => {
  // Use the custom hook for each field
  const content = useField('text');
  const author = useField('text');
  const info = useField('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });

    // Reset the fields after submitting
    content.reset();
    author.reset();
    info.reset();
  };

  const handleReset = () => {
    // Reset all fields when clicking the "Reset" button
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Content</label>
          <input {...{ value: content.value, type: content.type, onChange: content.onChange }} />
        </div>
        <div>
          <label>Author</label>
          <input {...{ value: author.value, type: author.type, onChange: author.onChange }} />
        </div>
        <div>
          <label>URL for more info</label>
          <input {...{ value: info.value, type: info.type, onChange: info.onChange }} />
        </div>
        <button type="submit">Create</button>
        <button type="button" onClick={handleReset}>Reset</button> {/* Reset button */}
      </form>
    </div>
  );
};

CreateNew.propTypes = {
  addNew: PropTypes.func.isRequired,  // Validate that 'addNew' is a function
};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ]);

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
  };

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/about" element={<About />} />
          <Route path="/anecdotes/:id" element={<SingleAnecdote anecdotes={anecdotes} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
