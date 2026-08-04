import "./App.css";
import GraphCanvas , {type ReplayStage} from "./GraphCanvas";
import {useEffect ,useState , type FormEvent } from "react" ;
import { demoEdges, demoNodes, type GraphEdge, type GraphNode } from "./graphData";
import {Graph} from "../../src/graph" ;

type QueryDirection = "out" | "in" ;

type SavedQuery ={
 text: string ;
 start: string ;
 edge: string ;
 direction?: QueryDirection ;
 take?:number;
};
type SavedWorkspace = {
  nodes: GraphNode[] ;
  edges: GraphEdge[] ;
  queries: SavedQuery[];
};

type PlanStep = {
  kind: ReplayStage ;
  title: string ;
  code: string ;

};
type SelectedGraphItem =
   | {
    kind: "node" ;
    id: string ;
   }
    | {
    kind: "edge" ;
    key: string ;
   }
   | null ;
const startingQueries: SavedQuery[] = [
  {
    text: 'v("ravi").out("founded")',
    start: "ravi",
    edge:"founded",

  },
  {
    text: 'v("northflow").out("serves")',
    start: "northflow",
    edge:"serves",


  },
  {
    text:'v("ravi").out("knows").take(2)',
    start:"ravi",
    edge:"knows",
    take:2,

  }

];
function readWorkspace(): SavedWorkspace | null {
  const saved = localStorage.getItem("pathglass-workspace") ;
  if(!saved){
    return null ;
  }
  try{
    return JSON.parse(saved) as SavedWorkspace ;
  }catch{
    return null ;
  }
}
function getNodePosition(index: number){
  const column = index%4 ;
  const row = Math.floor(index/4);
  return {
    x: 100 + column * 200,
    y:120 + row * 180 ,
  };
}
function runSavedQuery(
  nodes: GraphNode[],
  edges: GraphEdge[],
  query: SavedQuery | undefined,
){
  if (!query){
    return [];
  }

  const  graph = new Graph() ;

  for (const node of nodes){
    graph.addVertex(node.id,{
      name: node.name,
      type: node.type,
    }) ;
}

  for (const edge of edges){
    graph.addEdge(edge.from, edge.to, edge.label);
  }
  const execution = graph.v(query.start) ;
  const direction = query.direction ?? "out" ;
  if (direction === "in"){
    execution.in(query.edge) ;
  }else{
    execution.out(query.edge) ;
  }
  return Array.from(execution.iterate());
}



function App() {
  const [savedWorkspace] = useState(readWorkspace) ;
  const [selectedItem, setSelectedItem] = useState<SelectedGraphItem>(null) ;

  const [showEdgeForm ,setShowEdgeForm] = useState(false);
  const [edgeDraft, setEdgeDraft] = useState({
    from:"",
    to:"",
    label: "",

  });
  const [edgeError, setEdgeError] = useState("") ;
 const [savedQueries, setSavedQueries] = useState(
  savedWorkspace?.queries ?? startingQueries,

 ) ;
  const [queryIndex, setQueryIndex] = useState(0) ;
  const [step, setStep] = useState(0) ;
  const [showQueryForm, setShowQueryForm] = useState(false) ;
  const [queryDraft, setQueryDraft] = useState({
    start:"",
    edge:"",
    take:"",
  });
  const [queryDirection, setQueryDirection] = useState<QueryDirection>("out") ;
  const [queryError, setQueryError] = useState("") ;
  const query = savedQueries[queryIndex] ;

  const [nodes, setNodes] = useState<GraphNode[]>(
      savedWorkspace?.nodes ?? demoNodes,
  ) ;
  const [edges, setEdges] = useState<GraphEdge[]>(
      savedWorkspace?.edges ?? demoEdges,
  ) ;
  useEffect(() => {
    localStorage.setItem(
      "pathglass-workspace",
      JSON.stringify({
        nodes,
        edges,
        queries: savedQueries,
      }),
    );
  }, [nodes, edges, savedQueries]) ;
  const resultVertices = runSavedQuery(nodes, edges, query) ;
  const resultIds = resultVertices.map((vertex) => vertex.id) ;

  const resultNames = resultVertices.map((vertex) =>{
    const name = vertex.properties.name ;
    return typeof name === "string" ? name : vertex.id ;
  });

  const planSteps: PlanStep[] = query
  ?[
    {
      kind : "start",
      title: "Start",
      code: `v("${query.start}")`,
    },
    {
      kind:"edge",
      title:"Follow edge",
      code: `${query.direction ?? "out"}("${query.edge}")`,

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
        title: resultIds.length === 1? "Return vertex":"Return vertices",
        code: resultNames.join(", ") || "NO RESULTS",

      },
  ]
  :[];
  const activeStage = planSteps[step]?.kind ?? "start" ;
  const lastStep =Math.max(planSteps.length - 1, 0) ;
  const progress = planSteps.length > 0 ? (step / lastStep) * 100 : 0 ;

  const [showVertexform, setShowVertexForm] = useState(false) ;

  const [vertexDraft, setVertexDraft] = useState({
    id: "",
    name: "",
    type: "",
  });
  const [vertexError, setVertexError] = useState("") ;

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

  function addQuery(event: FormEvent<HTMLFormElement>){
    event.preventDefault();

    const start = queryDraft.start ;
    const edge = queryDraft.edge
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") ;

    if(!start || !edge){
      setQueryError("Choose a start vertex and enter an edge label");
      return ;
    }

    const takeText = queryDraft.take.trim() ;
    const take = takeText === "" ? undefined : Number(takeText) ;

    if(take !== undefined && (!Number.isInteger(take) || take <= 0)){
      setQueryError("Limit must be zero or a positve whole number");
      return ;
    }

    let text = `v("${start}").${queryDirection}("${edge}")` ;

    if(take !== undefined){
      text += `.take(${take})` ;
    }
    if(savedQueries.some((query) => query.text === text)){
      setQueryError("That query already exists");
      return ;
    }
    const newQuery: SavedQuery = {
      text,
      start,
      edge,
      direction: queryDirection,
    };

    if(take !== undefined){
      newQuery.take = take ;
    }

    setSavedQueries((current) => [...current, newQuery]) ;
    setQueryIndex(savedQueries.length) ;
    setStep(0) ;
    setShowQueryForm(false) ;
    setQueryDirection("out") ;
    setQueryDraft({
      start:"",
      edge:"",
      take:"",
    });
    setQueryError("") ;
  }
  function deleteSelectedItem(){
  if(!selectedItem){
    return ;
  }
  if(selectedItem.kind === "node"){
    setNodes((current) =>
      current.filter((node) => node.id !== selectedItem.id)
    );
    setEdges((current) =>
      current.filter(
        (edge) =>
          edge.from !== selectedItem.id && edge.to !== selectedItem.id
      ),
    );
  }
  if(selectedItem.kind === "edge"){
    setEdges((current) =>
      current.filter((edge)=>{
        const edgeKey = `${edge.from}|${edge.label}|${edge.to}`;
        return edgeKey !== selectedItem.key ;
      }),
    );
  }
  setSelectedItem(null);
  setEdgeDraft({
    from:"",
    to:"",
    label:"",
  });
  setEdgeError("");
  setStep(0);

}
  function startNewGraph(){
    setNodes([]) ;
    setEdges([]);
    setStep(0) ;
    setSelectedItem(null) ;

    setShowVertexForm(true) ;
    setShowEdgeForm(false);

    setVertexDraft({
      id:"",
      name:"",
      type:"",
    });
    setVertexError("");
    setEdgeDraft({
      from:"",
      to:"",
      label:"",
    });
    setEdgeError("");
    setSavedQueries([]) ;
    setQueryIndex(0) ;
    setShowQueryForm(false) ;
    setQueryDraft({
      start:"",
      edge:"",
      take:"",
    });
    setQueryError("") ;
  }
  function loadDemoGraph() {
    setNodes(demoNodes.map((node)=> ({...node})));
    setEdges(demoEdges.map((edge) => ({...edge})));
    setQueryIndex(0) ;
    setStep(0);
    setSelectedItem(null);
    setSavedQueries(startingQueries.map((query) => ({...query})));
    setShowVertexForm(false);
    setShowEdgeForm(false);

    setVertexDraft({
      id:"",
      name:"",
      type:"",
    });
    setVertexError("");
    setEdgeDraft({
      from:"",
      to:"",
      label:"",
    });
    setEdgeError("");

  }
  function toggleVertexForm(){
    setShowVertexForm((current) =>!current);
    setShowEdgeForm(false);
    setVertexError("");

  }
  function toggleEdgeForm(){
    if(nodes.length < 2){
      return ;}
    setShowEdgeForm((current) => !current);
    setShowVertexForm(false);
    setEdgeError("");
  }
  function addEdge(event: FormEvent<HTMLFormElement>){
    event.preventDefault() ;
    const from = edgeDraft.from ;
    const to = edgeDraft.to ;
    const label = edgeDraft.label
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

    if(!from || !to || !label){
      setEdgeError("Complete all three fields");
      return ;
    }
    const alreadyExists = edges.some(
    (edge)=>
    edge.from === from &&
  edge.to === to &&
edge.label === label ,
);
  if (alreadyExists){
    setEdgeError("That edge already exists");
    return ;
  }
  setEdges((current) => [
    ...current,
    {
      from,
      to,
      label,
    },
  ]);
  setEdgeDraft({
    from:"",
    to:"",
    label:"",
  });
  setEdgeError("");
  setStep(0);
  }

  function addVertex(event: FormEvent<HTMLFormElement>){
    event.preventDefault() ;
    const id = vertexDraft.id
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
    const name = vertexDraft.name.trim();
    const type = vertexDraft.type.trim()

    if(!id || !name || !type){
      setVertexError("Complete all three fields");
      return ;
    }
    if(nodes.some((node) => node.id ===id)){
      setVertexError("That vertex ID already exists");
      return ;

    }
    const position = getNodePosition(nodes.length);

    setNodes((current)=>[
      ...current,
      {
        id,
        name,
        type,
        ...position ,
      },
    ]);

    setVertexDraft({
      id: "",
      name:"",
      type: "",
    });
    setVertexError("");
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

          <button type="button" aria-label="Add Query" disabled={nodes.length === 0} onClick={() => {
            setShowQueryForm((current) => !current);
            setQueryError("");
          }}>
            {showQueryForm ? "x" : "+"}
          </button>
          </div>
          {showQueryForm && (
            <form className="new-query" onSubmit={addQuery}>
              <label>
                Start vertex
                <select
                  value={queryDraft.start}
                  onChange={(event) =>
                    setQueryDraft({
                      ...queryDraft,
                      start: event.target.value,
                    })
                  }
                >
                  <option value="">Choose vertex</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Direction
                <select
                  value={queryDirection}
                  onChange={(event) =>
                    setQueryDirection(event.target.value as QueryDirection)
                  }
                  >
                    <option value="out">Outgoing</option>
                    <option value="in">Incoming</option>
                  </select>
              </label>
              <label>
                Edge label
                <input
                  value={queryDraft.edge}
                  onChange={(event) =>
                    setQueryDraft({
                      ...queryDraft,
                      edge: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Limit (optional)
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={queryDraft.take}
                  onChange={(event) =>
                    setQueryDraft({
                      ...queryDraft,
                      take: event.target.value,
                    })
                  }
                />
              </label>
              {queryError && (
                <small className="form-error">{queryError}</small>
              )}
              <button type="submit">Add query</button>
            </form>
          )}
          <nav className="query-menu" aria-label="Saved queries">
            {savedQueries.map((savedQuery, index) =>(
              <button
              className={index === queryIndex ? "active" : undefined}
              type="button"
              key={`${savedQuery.text}-${index}`}
              onClick={() => chooseQuery(index)}
              ><span>0{index+1}</span>
              <code>{savedQuery.text}</code>
              </button>
            ))}
          </nav>
          <div className="data-box">
            <strong> {nodes.length === 0 ? "Empty graph" :"Current graph"}</strong>
            <span>{nodes.length} vertices | {edges.length} edges</span>
            <div className="data-action">
              <button
              className="add-node"
              type="button"
              onClick={toggleVertexForm}
              >
                {showVertexform ? "Close vertex" :"+ vertex"}
              </button>
              <button
              className="add-edge"
              type="button"
              disabled={nodes.length < 2}
              title={
                    nodes.length < 2
                    ? "Add at least two vertices "
                    : undefined
              }
              onClick={toggleEdgeForm}>
                {showEdgeForm ? "Close edge" : "+ edge"}
              </button>
                <button type="button" onClick={startNewGraph}>
                  New graph
                </button>
                <button type="button" onClick={loadDemoGraph}>
                  Load demo
                 </button>
          </div>
          <button
          className = "delete-item"
          type="button"
          disabled={!selectedItem}
          onClick={deleteSelectedItem}
          >
            {!selectedItem ? "Select a vertex or edge": selectedItem.kind === "node" ? "Delete vertex" : "Delete edge"}
          </button>
          {showVertexform && (
            <form className="vertex-form" onSubmit={addVertex}>
              <label>
                Vertex ID
                <input
                value={vertexDraft.id}
                onChange={(event) =>
                  setVertexDraft({
                    ...vertexDraft,
                    id:event.target.value,
                  })
                }
                placeholder="payment-api"
                />

              </label>
              <label>
              Name
              <input
              value={vertexDraft.name}
              onChange={(event) =>
                setVertexDraft({
                  ...vertexDraft,
                  name: event.target.value ,
                })
              }
              placeholder="Payment API"
              />
              </label>
              <label>
                Type
                <input
                value={vertexDraft.type}
                onChange={(event) =>
                  setVertexDraft({
                    ...vertexDraft,
                    type : event.target.value ,
                  })
                }
                placeholder="service"
                />
              </label>

              {vertexError && (
                <small className="form-error">{vertexError}</small>
              )}
              <button type="submit" > Add to graph</button>
            </form>
          )}
          {showEdgeForm && (
            <form className="edge-form" onSubmit={addEdge}>
              <label>
                Source<select
                value={edgeDraft.from}
                onChange={(event) =>
                  setEdgeDraft({
                    ...edgeDraft,
                    from:event.target.value,
                  })
                }
                >
                  <option value="">Choose source</option>
                  {nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                  Label
                  <input
                  value={edgeDraft.label}
                  onChange={(event) =>
                    setEdgeDraft({
                      ...edgeDraft,
                      label:event.target.value,
                    })
                  }
                  placeholder="depends-on"

                  />
                  </label>
                  <label>
                    Target
                    <select
                    value={edgeDraft.to}
                    onChange={(event) =>
                      setEdgeDraft({
                        ...edgeDraft,
                        to:event.target.value,
                      })
                    }
                    >
                      <option value="">Choose target</option>
                      {nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {edgeError &&(
                    <small className="form-error">{edgeError}</small>
                  )}
                  <button type="submit">Add edge</button>
                  </form>
          )}
          </div>

        </aside>
        <section className="graph">
          <h2>Graph canvas</h2>
          <GraphCanvas
          nodes={nodes}
          edges={edges}
          activeStage={activeStage}
          startNode={query?.start ?? ""}
          activeEdge={query?.edge ?? ""}
          direction={query?.direction ?? "out"}
          resultNodes={resultIds}
          selectedNode ={
            selectedItem?.kind === "node" ? selectedItem.id : null
          }
          selectedEdge = {
            selectedItem?.kind === "edge" ? selectedItem.key : null
          }
          onSelectNode = {(id) => setSelectedItem({kind:"node", id})}
          onSelectEdge = {(key) => setSelectedItem({kind:"edge", key}) }
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
            <strong>
              {query && step === lastStep
                ? resultNames.join(", ") || "NO RESULTS"
                : "-"}
              </strong>
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

        <span>
          {query ? `${step + 1} of ${planSteps.length}` : "0/0"}
        </span>

        <div className="progress">
          <span style={{width:`${progress}%`}}></span>
        </div>
        <span>{step === lastStep ? `${resultIds.length} ${resultIds.length === 1 ? "result": "results"}`:"0 results"}</span>
      </footer>
    </main>

  );
}
export default App