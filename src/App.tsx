import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <main className="bg-gradient min-h-svh">
        <Outlet />
      </main>
    </>
  );
}

export default App;
