import axios, { AxiosResponse } from "axios";

// Tipo para o corpo da requisição de criação de produto
export type ProductCreateRequest = {
  name: string;
  description: string;
  price: number;
  stock: number;
};

// Tipo para a resposta da API ao criar um produto
export type ProductCreateResponse = {
  id: number; // Presumido que a API retorna o ID do produto criado
  name: string;
  description: string;
  price: number;
  stock: number;
};

// Dados do produto para enviar na requisição
const productData: ProductCreateRequest = {
  name: 'TV 55" 4K Full HD',
  description: "Televisão com cores vibrantes",
  price: 2999.99,
  stock: 10,
};

const options = {
  method: "POST",
  url: "https://interview.t-alpha.com.br/api/products/create-product",
  headers: { "Content-Type": "application/json" },
  data: productData,
};

try {
  // Fazendo a requisição e tipando a resposta
  const response: AxiosResponse<ProductCreateResponse> =
    await axios.request(options);
  const data = response.data;
  console.log(data);
} catch (error) {
  console.error(error);
}

export type LoginData = {
  taxNumber: string;
  password: string;
};

export type RegisterData = {
  name: string;
  taxNumber: string;
  mail: string;
  phone: string;
  password: string;
};

export type ProductData = {
  name: string;
  description: string;
  price: number;
  stock: number;
};

export type Product = ProductData & {
  id: number;
};
