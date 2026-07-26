import "./App.css";

function App() {
  return (
    <main>
      <header>
        <div className="brand">
          <span>p</span>
          <div>
            <strong>Pathglass</strong>
            <small>Graph execution explorer</small>
          </div>
        </div>
        <div className="engine">
          <span />Engine ready to explore
           </div>

      </header>
      <section className="workspace">
        <aside>
          <h2>Queries</h2>
        </aside>
        <section className="graph">
          <h2>Graph canvas</h2>
        </section>
        <aside>
          <h2>Query Plan</h2>
        </aside>
      </section>
      <footer>
        <button aria-label="Play">▶</button>
        <div className="progress" />
        <span>0 results</span>
      </footer>
    </main>
  );
}
export default App
