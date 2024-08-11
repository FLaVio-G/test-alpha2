import { useState } from "react";
import axios, { AxiosError } from "axios";
import { RegisterData, ProductData } from "./types";

interface AxiosErrorResponse {
  success: boolean;
  message: string;
  data: any;
}

const API_URL = "https://interview.t-alpha.com.br/api";

const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const request = async (
    url: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    data?: any,
    authRequired = false
  ) => {
    setLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (authRequired) {
        const token = localStorage.getItem("token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        } else {
          console.error("Token não encontrado no localStorage.");
          throw new Error("Token não encontrado.");
        }
      }

      const response = await axios({
        url: `${API_URL}${url}`,
        method,
        data,
        headers,
      });

      return response.data;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<AxiosErrorResponse>;
      if (axiosError.response) {
        console.error(
          `Erro na requisição: ${axiosError.response.status} - ${
            axiosError.response.data.message || axiosError.message
          }`
        );
        setError(
          `Erro: ${
            axiosError.response.data.message ||
            axiosError.message ||
            "Erro desconhecido"
          }`
        );
      } else {
        console.error("Erro ao fazer a requisição", axiosError.message);
        setError(axiosError.message || "Erro desconhecido");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData: { taxNumber: string; password: string }) => {
    try {
      const response = await request("/auth/login", "POST", loginData);
      console.log("Resposta da API:", response);

      const token = response?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.error("Token não retornado pela API.");
        throw new Error("Token não retornado.");
      }

      return response;
    } catch (err) {
      console.error("Erro ao fazer a requisição de login", err);
      throw err;
    }
  };

  const register = async (registerData: RegisterData) => {
    return request("/auth/register", "POST", registerData);
  };

  const createProduct = async (productData: ProductData) => {
    return request("/products/create-product", "POST", productData, true);
  };

  const getAllProducts = async () => {
    try {
      const data = await request(
        "/products/get-all-products",
        "GET",
        undefined,
        true
      );
      console.log("Dados recebidos:", data);
      return data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  };

  const getProduct = async (id: number) => {
    try {
      console.log(`Buscando produto com ID: ${id}`);
      const response = await request(
        `/products/get-one-product/${id}`,
        "GET",
        undefined,
        true
      );

      if (response?.product) {
        console.log("Produto encontrado:", response.product);
        return response.product;
      } else {
        console.log(`Nenhum produto encontrado para o ID: ${id}`);
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error;
    }
  };

  const updateProduct = async (id: number, productData: ProductData) => {
    return request(
      `/products/update-product/${id}`,
      "PATCH",
      productData,
      true
    );
  };

  const deleteProduct = async (id: number) => {
    return request(`/products/delete-product/${id}`, "DELETE", undefined, true);
  };

  return {
    loading,
    error,
    login,
    register,
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useApi;
