import { BrowserRouter, Route, Routes } from "react-router-dom";

import CadastroAdmin from "./pages/admin/CadastroAdmin.jsx";
import FeedbackAdmin from "./pages/admin/FeedbackAdmin.jsx";
import CadastroAluno from "./pages/aluno/CadastroAluno.jsx";
import FeedbackAluno from "./pages/aluno/Feedback.jsx";
import Login from "./pages/Login.jsx";
import MenuAluno from "./pages/aluno/MenuAluno.jsx";
import Questionario from "./pages/aluno/Questionario.jsx";
import Simulacao from "./pages/aluno/Simulacao.jsx";
import Sidebar from "./components/SidebarAluno.jsx";




function App() {

    return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/cadastroAluno" element={<CadastroAluno />} />
        <Route path="/cadastroAdmin" element={<CadastroAdmin />} />

        <Route element={<Sidebar/>}>
          <Route path="/feedbackAdmin" element={<FeedbackAdmin />} />
          <Route path="/feedbackAluno" element={<FeedbackAluno />} />
          <Route path="/menuAluno" element={<MenuAluno />} />
          <Route path="/questionario" element={<Questionario />} />
          <Route path="/simulacao" element={<Simulacao />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
