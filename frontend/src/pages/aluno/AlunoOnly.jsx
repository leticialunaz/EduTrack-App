import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AlunoOnly() {
  const { user, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/" replace />;

  if (user.type !== "Aluno") return <Navigate to="/acesso-negado" replace />;

  const needsConsent = !user.consentAccepted || !user.hasConsentFile;

  if (needsConsent && location.pathname !== "/consentimento") {
    return <Navigate to="/consentimento" replace />;
  }

  if (!needsConsent && location.pathname === "/consentimento") {
    return <Navigate to="/menuAluno" replace />;
  }

  return <Outlet />;
}
