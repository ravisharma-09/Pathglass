import "./App.css";
import GraphCanvas from "./GraphCanvas";

const savedQueries = [
  'v("ravi").out("founded")',
  'v("northflow").out("serves")',
  'v("ravi").out("knows").take(2)',

];
const planSteps = [
  { title: "Start", code:'v("ravi")'},
  { title: "Follow edge", code: 'out("founded")'},
  { title: "Return vertex", code: "NorthFlow"},
];

function App() {
  return (
    <main>
      <header>
        <div className="app-name">
          <strong>PathGlass</strong>
          
        </div>

      </header>
      <section className="workspace">
        <aside>
          <div className="query-head">
          <h2>Queries</h2>
          
          <button type="button" aria-label="Add Query">
            +
          </button>
          </div>
          <nav className="query-menu" aria-label="Saved queries">
            {savedQueries.map((query, index) =>(
              <button
              className={index === 0 ? "active" : undefined}
              type="button"
              key={query}
              ><span>0{index+1}</span>
              <code>{query}</code>
              </button>
            ))}
          </nav>
          <div className="data-box">
            <strong>Demo dataset</strong>
            <span>5 vertices · 4 edges</span>
          </div>
        </aside>
        <section className="graph">
          <h2>Graph canvas</h2>
          <GraphCanvas />
        </section>
        <aside>
          <h2>Query Plan</h2>
          <ol>
            {planSteps.map((step,index)=>(
              <li 
              className={index === 0 ? "current" : undefined}
              key={step.title}
              >
                <span>0{index + 1}</span>

                <div>
                  <strong>{step.title}</strong>
                  <code>{step.code}</code>
                </div>
              </li>
            ))}
          </ol>
          <div className="result">
            <small>Result</small>
            <strong>NorthFlow</strong>
          </div>
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