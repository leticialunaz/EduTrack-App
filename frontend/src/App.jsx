import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cadastro from "./components/Cadastro.jsx";
import FeedbackAdmin from "./pages/admin/FeedbackAdmin.jsx";
import FeedbackAluno from "./pages/aluno/Feedback.jsx";
import MenuAluno from "./pages/aluno/MenuAluno.jsx";
import Questionario from "./pages/aluno/Questionario.jsx";
import Simulacao from "./pages/aluno/Simulacao.jsx";
import Sidebar from "./components/SidebarAluno.jsx";
import Consentimento from "./pages/aluno/Consentimento.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import AlunoOnly from "./pages/aluno/AlunoOnly.jsx";
import AcessoNegado from "./components/AcessoNegado.jsx";





function App() {

    return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Cadastro />} />

          <Route path="/acesso-negado" element={<AcessoNegado />} />
            <Route element={<AlunoOnly />}>
              <Route path="/consentimento" element={<Consentimento />} />
              <Route element={<Sidebar/>}>
                <Route path="/feedbackAdmin" element={<FeedbackAdmin />} />
                <Route path="/feedbackAluno" element={<FeedbackAluno />} />
                <Route path="/menuAluno" element={<MenuAluno />} />
                <Route path="/questionario" element={<Questionario />} />
                <Route path="/simulacao" element={<Simulacao />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
