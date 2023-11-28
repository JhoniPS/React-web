import React, { Fragment, useEffect, useState } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);

  async function handleAddRepository() {
    try {
      const response = await api.post('repositories', {
        title: 'titulo de exemplo',
        url: 'exemplo.com.br',
        techs: ['Java ', 'Node ', 'Python '],
        likes: 0,
      });

      setRepositories([...repositories, response.data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLikeRepository(id) {
    try {
      const response = await api.post(`repositories/${id}/like`);

      setRepositories(repositories.map(item => (item.id === id ? response.data : item)));
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`/repositories/${id}`);
      const updateRepository = repositories.filter(item => item.id !== id);
      setRepositories(updateRepository);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const response = await api.get('/repositories');
        setRepositories(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRepositories()
  }, [])

  return (
    <Fragment>
      <div>
        <section>
          <h1>Repositórios</h1>
          <ul data-testid="repository-list">
            {repositories.map((repository) => (
              <li key={repository.id}>
                <h1>{repository.title}</h1>
                <h3>{repository.url}</h3>
                <p>{repository.techs}</p>
                <p>likes: {repository.likes}</p>
                <button onClick={() => handleRemoveRepository(repository.id)}> Remover </button>
                <button onClick={() => handleLikeRepository(repository.id)}> Like </button>
              </li>
            ))}
          </ul>
        </section>

        <button onClick={handleAddRepository}>Adicionar</button>
      </div>
    </Fragment>
  );
}

export default App;
