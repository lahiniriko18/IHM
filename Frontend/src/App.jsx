import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  return (
    <div>
      <div className="container-fluid">
        <div className="container">
          <div className="row d-flex flex-row align-items-center">
            <div className="col">
              <a href="https://vite.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
            </div>
            <div className="col">
              <h3 className="text-nowrap text-4xl font-semibold font-sans">React-vite template Lahiniriko</h3>
            </div>
            <div className="col">
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
