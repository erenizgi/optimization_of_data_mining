import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("")
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(1);
  const [status, setStatus] = useState("");
 

  const fetchAllCommits = window.api.fetchAllCommits;

  useEffect(() => {
    const timer = setInterval(() => setStatus(''), 5000);
    return () => clearInterval(timer);


  }, [status]);
   if (!window.api) {return <div>No API</div>}
  

  const pullRepoHandler = async (owner, repo, pageStart, pageEnd) => {
    setStatus("Pulling commits...");
    if (pageStart <= 0 || !owner || !repo) {
      setStatus("Set proper info!");
      return
    }
    const data = await fetchAllCommits(owner, repo, pageStart, pageEnd, setStatus);
    
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
        <h3 style={{ width: "8rem" }}>Page Start:</h3>
        <input style={{ maxHeight: "2rem" }} value={pageStart} onChange={(e) => setPageStart(e.target.value)} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", maxHeight: "1.5rem" }}>
        <h3 style={{ width: "8rem" }}>Page End:</h3>
        <input style={{ maxHeight: "2rem" }} value={pageEnd} onChange={(e) => setPageEnd(e.target.value)} />
      </div>
      <button style={{ width: "8rem", fontSize: "1rem", marginTop: 50 }} onClick={() => pullRepoHandler(owner, repo, pageStart, pageEnd)}>Pull</button>
      <p style={{ height: 100, width: 400}}>{status}</p>
    </div>
  );
}

export default App;
