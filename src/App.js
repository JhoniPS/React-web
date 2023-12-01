import React, { Fragment, useEffect, useState } from "react";
import api from "./services/api";
import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [newRepoData, setNewRepoData] = useState({
    title: "",
    url: "",
    techs: [],
  });

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const response = await api.get('/repositories');
        setRepositories(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRepositories();
  }, []);

  async function handleAddRepository() {
    try {
      const response = await api.post('repositories', {
        ...newRepoData,
        likes: 0,
      });

      setRepositories([...repositories, response.data]);
      setNewRepoData({
        title: "",
        url: "",
        techs: [],
      });
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
      console.log(error);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRepoData({
      ...newRepoData,
      [name]: value,
    });
  };

  const handleTechsChange = (e) => {
    const selectedTechs = Array.from(e.target.selectedOptions, option => option.value);
    setNewRepoData({
      ...newRepoData,
      techs: selectedTechs,
    });
  };

  return (
    <Fragment>
      <div className="container">
        <section className="repository-list">
          <h1>Repositórios</h1>
          <ul data-testid="repository-list">
            {repositories.map((repository) => (
              <li key={repository.id} className="repository-item">
                <h1>{repository.title}</h1>
                <h3>{repository.url}</h3>
                <p>{repository.techs.join(", ")}</p>
                <p>likes: {repository.likes}</p>
                <div className="containerButton">
                  <button onClick={() => handleRemoveRepository(repository.id)}> Remover </button>
                  <button onClick={() => handleLikeRepository(repository.id)}> Like </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section  className="containerForm">
          <h2>Adicionar Repositório</h2>
          <form className="form">
            <label htmlFor="title">Título:</label>
            <input type="text" id="title" name="title" value={newRepoData.title} onChange={handleInputChange} />

            <label htmlFor="url">URL:</label>
            <input type="text" id="url" name="url" value={newRepoData.url} onChange={handleInputChange} />

            <label htmlFor="techs">Tags:</label>
            <select id="techs" name="techs" multiple onChange={handleTechsChange} value={newRepoData.techs}>
              <option value="Java">Java</option>
              <option value="Node">Node</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="Node">Node</option>
              <option value="Go">Go</option>
              <option value="C">C</option>
            </select>

            <button type="button" onClick={handleAddRepository}>Adicionar</button>
          </form>
        </section>
      </div>
    </Fragment>
  );
}

export default App;
