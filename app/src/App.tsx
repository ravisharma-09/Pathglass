import "./App.css";
import GraphCanvas , {type ReplayStage} from "./GraphCanvas";
import {useState} from "react" ;

type SavedQuery ={
  text: string ;
  start: string;
  edge:string;
  take?:number ;
  results: string[];
  resultNames: string[];
};
type PlanStep = {
  kind: ReplayStage ;
  title: string ;
  code: string ;

};

const savedQueries: SavedQuery[] = [
  {
    text: 'v("ravi").out("founded")',
    start: "ravi",
    edge:"founded",
    results:["northflow"],
    resultNames :["NorthFlow"],
  },
  {
    text: 'v("northflow").out("serves")',
    start: "northflow",
    edge:"serves",
    results: ["city-clinic"],
    resultNames:["City Clinic"],

  },
  {
    text:'v("ravi").out("knows").take(2)',
    start:"ravi",
    edge:"knows",
    take:2,
    results:["garvit","meera"],
    resultNames:["Garvit","Meera"],
  }

];


function App() {
  const [queryIndex, setQueryIndex] = useState(0) ;
  const [step,setStep] = useState(0);
  const query = savedQueries[queryIndex];

  const planSteps: PlanStep[] =[
    {
      kind : "start",
      title: "Start",
      code: `v("${query.start}")`,
    },
    {
      kind:"edge",
      title:"Follow edge",
      code:`out("${query.edge}")`,

    },
    ...(query.take === undefined
      ? []
      : [
        {
          kind: "take" as const ,
          title: "Limit results",
          code: `take(${query.take})`,
        },
      ]),
      {
        kind: "result",
        title: query.results.length === 1? "Return vertex":"Return vertices",
        code: query.resultNames.join(", ")
          
      }
  ];
  const activeStage = planSteps[step]?.kind ?? "start" ;
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
            <span>5 vertices · 4 edges</span>
          </div>
        </aside>
        <section className="graph">
          <h2>Graph canvas</h2>
          <GraphCanvas 
          activeStage={activeStage}
          startNode={query.start}
          activeEdge={query.edge}
          resultNodes={query.results}
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
            <strong>{step === lastStep ? query.resultNames.join(", ") : "-" }</strong>
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
        <span>{step === lastStep ? `${query.results.length} ${query.results.length === 1 ? "result": "results"}`:"0 results"}</span>
      </footer>
    </main>

  );
} 
export default App