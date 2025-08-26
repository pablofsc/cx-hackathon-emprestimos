// services/productService.ts
// Serviço para persistência e manipulação de produtos

export type Produto = {
  id: string;
  nome: string;
  jurosAnuais: number;
  maxMeses: number;
};

let produtos: Produto[] = [
  { id: '1', nome: 'Product 1', jurosAnuais: 5, maxMeses: 12 },
  { id: '2', nome: 'Product 2', jurosAnuais: 10, maxMeses: 24 },
  { id: '3', nome: 'Product 3', jurosAnuais: 15, maxMeses: 36 },
  { id: '4', nome: 'Product 4', jurosAnuais: 20, maxMeses: 48 },
];

export function getProdutos() {
  return produtos;
}

export function addProduto(product: Produto) {
  produtos.push(product);
}

export function updateProduto(updatedProduct: Produto) {
  const indice = produtos.findIndex(p => p.id === updatedProduct.id);

  if (indice !== -1) {
    produtos[indice] = updatedProduct;
  }
}

export function deleteProduto(productId: string) {
  produtos = produtos.filter((product) => product.id !== productId);
}

export function resetProdutos(newProducts: Produto[]) {
  produtos = newProducts;
}
