import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../api/use";
import { LoginData } from "../api/types";
import RegisterModal from "../components/RegisterModal";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useApi();

  const [loginData, setLoginData] = useState<LoginData>({
    taxNumber: "",
    password: "",
  });

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleNavigate = () => {
    navigate("/products");
  };

  const handleLogin = async () => {
    try {
      const response = await login(loginData);
      const token = response?.data?.token;
      if (token) {
        localStorage.setItem("authToken", token);
        handleNavigate();
      } else {
        console.error("Token não encontrado na resposta.");
      }
    } catch (err) {
      console.error("Erro ao fazer login", err);
    }
  };

  return (
    <div className="flex w-full bg-slate-700 h-screen justify-center items-center">
      <div className="card p-4 bg-slate-800 w-96 shadow-xl">
        <h2 className="text-xl mb-4">Login</h2>
        <label className="input input-bordered flex items-center gap-2 mb-2">
          <input
            type="text"
            className="grow"
            placeholder="CPF ou CNPJ"
            value={loginData.taxNumber}
            onChange={(e) =>
              setLoginData({ ...loginData, taxNumber: e.target.value })
            }
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 mb-4">
          <input
            type="password"
            className="grow"
            placeholder="Senha"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
        </label>
        <div className="card-actions mt-2 flex flex-col items-center">
          <button
            className="btn btn-primary mb-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
          {/* <button
            className="btn btn-secondary"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            Registrar
          </button> */}
        </div>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default Auth;
