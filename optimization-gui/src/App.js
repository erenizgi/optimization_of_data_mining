import './App.css';
import { useState } from 'react';

function App() {
  const fetchPagesCommits = window.api.fetchPagesCommits;
  const fetchAllCommits = window.api.fetchAllCommits;
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("")
  const [pageCount, setPageCount] = useState(1);
  const [status, setStatus] = useState("");

  const pullRepoHandler = async (owner, repo, pageCount) => {
    console.log("Pull!")
    console.log(owner, repo, pageCount);
    if (pageCount <= 0 || !owner || !repo) {
      setStatus("set proper info!");
      return
    }
    const data = await fetchPagesCommits(owner, repo, pageCount);
    console.log(data);
    setStatus("YEAAAHHH");
  }


  return (
    <div style={{ backgroundColor: "#434343", flexDirection: "column", width: "100vw", height: "100vh", color: "white", justifyContent: "center", alignItems: "center", display: "flex" }} className="App">

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", maxHeight: "1.5rem" }}>
        <h3 style={{ width: "8rem" }}>Owner:</h3>
        <input style={{ maxHeight: "2rem" }} value={owner} onChange={(e) => setOwner(e.target.value)} />

      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", maxHeight: "1.5rem" }}>
        <h3 style={{ width: "8rem" }}>Repository:</h3>
        <input style={{ maxHeight: "2rem" }} value={repo} onChange={(e) => setRepo(e.target.value)} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", maxHeight: "1.5rem" }}>
        <h3 style={{ width: "8rem" }}>Page Count:</h3>
        <input style={{ maxHeight: "2rem" }} value={pageCount} onChange={(e) => setPageCount(e.target.value)} />
      </div>
      <button style={{ width: "8rem", fontSize: "1rem", marginTop: 50 }} onClick={() => pullRepoHandler(owner, repo, pageCount)}>Pull</button>
      <p style={{ height: 40 }}>{status}</p>
    </div>
  );
}

export default App;
