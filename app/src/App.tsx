import "./App.css";
import GraphCanvas from "./GraphCanvas";
import {useState} from "react" ;

const savedQueries = [
  {
    text: 'v("ravi").out("founded")',
    start: "ravi",
    edge:"founded",
    result:"northflow",
    resultName:"NorthFlow",
  },
  {
    text: 'v("ravi").out("founded")',
    start: "northflow",
    edge:"serves",
    result: "city-clinic",
    resultName: "City Clinic",
  },

];


function App() {
  const [queryIndex, setQueryIndex] = useState(0) ;
  const [step,setStep] = useState(0);
  const query = savedQueries[queryIndex];

  const planSteps =[
    { title: "Start", code: `v("${query.start}")`},
    { title: "Follow edge", code: `out("${query.edge}")` },
    {title: "Return vertex", code: query.resultName},
  ];
  const lastStep = planSteps.length - 1 ;
  const progress =(step/lastStep)*100 ;

  function goBack(){
    setStep((current) => Math.max(current - 1, 0));
  }
  function goForward(){
    setStep((current) => Math.min(current + 1,lastStep)) ;
  }
  function chooseQuery(index: number){
    setQueryIndex(index);
    setStep(0);
  }
  return (
    <main>
      <header>
        <div className="app-name">
          <strong>Pathglass</strong>
          
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
            {savedQueries.map((savedQuery, index) =>(
              <button
              className={index === queryIndex ? "active" : undefined}
              type="button"
              key={savedQuery.text}
              onClick={() => chooseQuery(index)}
              ><span>0{index+1}</span>
              <code>{savedQuery.text}</code>
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
          <GraphCanvas 
          activeStep={step}
          startNode={query.start}
          activeEdge={query.edge}
          resultNode={query.result}
          />
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
            <strong>{step === lastStep ? query.resultName:"-"}</strong>
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
