import React, { useEffect, useState } from "react";

import "./styles.css";
import api from "./services/api";

function App() {
  const [repositories, setRepositories] = useState([]);

  async function handleAddRepository() {
    try {
      const response = await api.post('repositories', {
        title: 'titulo de exemplo',
        url: 'exemplo.com.br',
        techs: ['savio', 'Ramon', 'Lorenzo']
      });

      setRepositories([...repositories, response.data]);
    } catch (error) {
      console.log(error);
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
    <div>
      <ul data-testid="repository-list">
        {repositories.map((repository) => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}> Remover </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
