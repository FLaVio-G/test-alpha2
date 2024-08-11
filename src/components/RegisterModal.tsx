import React, { useState } from "react";
import { RegisterData } from "../api/types";
import useApi from "../api/use";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const { register, loading, error } = useApi();

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    taxNumber: "",
    mail: "",
    phone: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      await register(registerData);
      onClose();
    } catch (err: any) {
      console.error("Erro ao registrar", err);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex justify-center items-center">
        <div className="card p-4 bg-base-100 w-96 shadow-xl">
          <h2 className="text-xl mb-4">Registrar Usuário</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <label className="input input-bordered flex items-center gap-2 mb-2">
              <input
                type="text"
                className="grow"
                placeholder="Nome"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-2">
              <input
                type="text"
                className="grow"
                placeholder="CPF ou CNPJ"
                value={registerData.taxNumber}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    taxNumber: e.target.value,
                  })
                }
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-2">
              <input
                type="email"
                className="grow"
                placeholder="E-mail"
                value={registerData.mail}
                onChange={(e) =>
                  setRegisterData({ ...registerData, mail: e.target.value })
                }
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-2">
              <input
                type="text"
                className="grow"
                placeholder="Telefone"
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-4">
              <input
                type="password"
                className="grow"
                placeholder="Senha"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
              />
            </label>

            <div className="card-actions mt-4 flex flex-col items-center">
              <button
                type="submit"
                className="btn btn-primary mb-2"
                disabled={loading}
              >
                {loading ? "Carregando..." : "Registrar"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          </form>
        </div>
      </div>
    )
  );
};

export default RegisterModal;
