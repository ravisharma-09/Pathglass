import "./App.css";
import GraphCanvas from "./GraphCanvas";
import {useState} from "react" ;

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
  const [step,setStep] = useState(0);
  const lastStep = planSteps.length - 1 ;
  const progress =(step/lastStep)*100 ;

  function goBack(){
    setStep((current) => Math.max(current - 1, 0));
  }
  function goForward(){
    setStep((current) => Math.min(current + 1,lastStep)) ;
  }
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
            <span>3 vertices · 2 edges</span>
          </div>
        </aside>
        <section className="graph">
          <h2>Graph canvas</h2>
          <GraphCanvas activeStep={step}/>
        </section>
        <aside>
          <h2>Query Plan</h2>
          <ol>
            {planSteps.map((plan,index)=>(
              <li 
              className={index === step ? "current" : undefined}
              key={plan.title}
              >
                <span>0{index + 1}</span>

                <div>
                  <strong>{plan.title}</strong>
                  <code>{plan.code}</code>
                </div>
              </li>
            ))}
          </ol>
          <div className="result">
            <small>Result</small>
            <strong>{step === lastStep ? "Northflow":"-"}</strong>
          </div>
        </aside>
      </section>
      <footer>
        <button
        type="button"
        aria-label="Previous Step"
        disabled={step === 0}
        onClick={goBack}
        >
          ←
        </button>
        <button
        type="button"
        aria-label="Next Step"
        disabled ={step === lastStep}
        onClick={goForward}
        >
          →
        </button>
        <span>{step+1}/{planSteps.length}</span>
        <div className="progress">
          <span style={{width:`${progress}%`}}></span>
        </div>
        <span>{step === lastStep ? "1 result ":"0 results"}</span>
      </footer>
    </main>
  );
}
export default App
