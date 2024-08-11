import { useState, useRef, useEffect } from "react";
import useApi from "../api/use";
import { ProductData } from "../api/types";
import RegisterModal from "../components/RegisterModal";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

const ProductManagement = () => {
  const {
    loading,
    error,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    // getProduct,
  } = useApi();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.data.products);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const openModal = (product?: Product) => {
    setCurrentProduct(
      product || { id: 0, name: "", description: "", price: 0, stock: 0 }
    );
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
    setCurrentProduct(null);
  };

  const handleSave = async (product: ProductData) => {
    try {
      if (currentProduct && currentProduct.id) {
        await updateProduct(currentProduct.id, product);
      } else {
        await createProduct(product);
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      setFormError("Erro ao salvar produto");
    }
  };
  // const handleSearchClick = async () => {
  //   if (searchTerm === "") {
  //     fetchProducts();
  //   } else {
  //     const id = Number(searchTerm);

  //     if (!isNaN(id)) {
  //       try {
  //         const response = await getProduct(id);

  //         if (response && response.data && response.data.product) {
  //           setProducts([response.data.product]);
  //         } else {
  //           setProducts([]);
  //         }
  //       } catch (error) {
  //         setProducts([]);
  //       }
  //     } else {
  //       console.error("ID do produto deve ser um número");
  //       setProducts([]);
  //     }
  //   }
  // };

  const filterProducts = () => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const id = Number(searchTerm);

      if (!isNaN(id)) {
        const filtered = products.filter((product) => product.id === id);
        setFilteredProducts(filtered);
      } else {
        console.error("ID do produto deve ser um número");
        setFilteredProducts([]);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const ProductForm = ({
    product,
    onSave,
    onCancel,
  }: {
    product: Product;
    onSave: (product: ProductData) => void;
    onCancel: () => void;
  }) => {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price.toString());
    const [stock, setStock] = useState(product.stock.toString());

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      onSave({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
      });
    };

    return (
      <form onSubmit={handleSubmit} className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {product.id ? "Editar Produto" : "Novo Produto"}
        </h3>
        <input
          type="text"
          placeholder="Nome do Produto"
          className="input input-bordered w-full mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Descrição do Produto"
          className="textarea textarea-bordered w-full mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preço do Produto"
          className="input input-bordered w-full mb-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantidade em Estoque"
          className="input input-bordered w-full mb-2"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        </div>
        {formError && <p className="text-red-500 mt-2">{formError}</p>}
      </form>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
      <div className="w-full max-w-4xl bg-slate-700 rounded-lg shadow-lg p-4">
        <div className=" flex flex-row mb-4 gap-4 ">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Digite o ID do produto"
            className="input input-bordered w-full max-w-xs"
          />
          {/* <button className="btn btn-primary" onClick={handleSearchClick}>
            Pesquisar
          </button> */}
        </div>
        <div className="mb-4">
          <button className="btn btn-primary" onClick={fetchProducts}>
            Carregar Produtos
          </button>
        </div>
        <ul className="space-y-2">
          {loading && <p>Carregando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {filteredProducts.length === 0 && !loading && !error && (
            <p>Nenhum produto encontrado.</p>
          )}
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="flex flex-col sm:flex-row justify-between items-center bg-slate-800 p-4 rounded-md shadow-sm"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <span className="font-semibold">{product.name}</span>
                <span>{product.description}</span>
                <span>${product.price.toFixed(2)}</span>
                <span>Qtd: {product.stock}</span>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="btn btn-xs btn-primary"
                  onClick={() => openModal(product)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() =>
                    deleteProduct(product.id).then(() => {
                      fetchProducts();
                    })
                  }
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 flex-col sm:flex-row justify-between mt-4">
          <button
            className="btn bg-slate-200"
            onClick={() => window.history.back()}
          >
            Voltar
          </button>
          <button
            className="btn btn-primary mt-4 sm:mt-0"
            onClick={() => openModal()}
          >
            Adicionar Produto
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            Registrar
          </button>
        </div>
        {currentProduct && (
          <dialog
            ref={dialogRef}
            className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="modal-content bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
              <ProductForm
                product={currentProduct}
                onSave={handleSave}
                onCancel={closeModal}
              />
            </div>
          </dialog>
        )}
      </div>
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default ProductManagement;
