import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";


function App() {
const LoginForm = lazy(() => import("./pages/Login.jsx"));


  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LoginForm/>} />
      </Routes>

    </Suspense>
      
    </>
  )
}

export default App
