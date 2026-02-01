import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AlunoOnly() {
  const { user, loadingAuth } = useAuth();

  console.log("DEBUG user:", user);
  console.log("DEBUG user.type:", user?.type);
  console.log("DEBUG req.user.type:", user?.user?.type); // se você estiver guardando profile dentro de user

  if (loadingAuth) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/" replace />;

  // aqui usamos o campo type do seu user do banco
  if (user.type !== "Aluno") {
    return <Navigate to="/acesso-negado" replace />;
  }

  return <Outlet />;
}
