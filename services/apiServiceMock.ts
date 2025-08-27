// services/productService.ts
// Serviço para persistência e manipulação de produtos

export type Produto = {
  id: string;
  nome: string;
  jurosAnuais: number;
  maxMeses: number;
};

export type AmortizacaoItem = {
  mes: number;
  juros: number;
  amortizacao: number;
  saldo: number;
};

export type SimulacaoResponse = {
  taxaEfetivaMensal: number;
  valorTotal: number;
  valorParcela: number;
  amortizacao: AmortizacaoItem[];
};

let produtos: Produto[] = [
  { id: '1', nome: 'Product 1', jurosAnuais: 5, maxMeses: 12 },
  { id: '2', nome: 'Product 2', jurosAnuais: 10, maxMeses: 24 },
  { id: '3', nome: 'wrwerwe 3', jurosAnuais: 15, maxMeses: 36 },
  { id: '4', nome: 'Product 4', jurosAnuais: 20, maxMeses: 48 },
];

/**
 * GET /produtos
 */
export function GETprodutos() {
  return produtos;
}

/**
 * POST /produtos
 */
export function POSTprodutos(product: Produto) {
  produtos.push(product);
}

/**
 * PATCH /produtos/:id
 */
export function PATCHprodutos(updatedProduct: Produto) {
  const indice = produtos.findIndex(p => p.id === updatedProduct.id);

  if (indice !== -1) {
    produtos[indice] = updatedProduct;
  }
}

/**
 * DELETE /produtos/:id
 */
export function DELETEprodutos(productId: string) {
  produtos = produtos.filter((product) => product.id !== productId);
}

/**
 * POST /simulacoes
 */
export function POSTsimulacoes(valorNum: number, mesesNum: number, taxaEfetivaMensal: number, valorParcela: number): AmortizacaoItem[] {
  if (valorNum <= 0 || mesesNum <= 0 || taxaEfetivaMensal <= 0) {
    return [];
  }

  const amortizacaoDados = [];
  let saldoAtual = valorNum;

  for (let mes = 1; mes <= mesesNum; mes++) {
    const jurosMes = saldoAtual * taxaEfetivaMensal;
    const amortizacaoMes = valorParcela - jurosMes;
    saldoAtual = saldoAtual - amortizacaoMes;

    // Garantir que o saldo não fique negativo no último mês devido a arredondamentos
    if (mes === mesesNum && saldoAtual < 0) {
      saldoAtual = 0;
    }

    amortizacaoDados.push({
      mes,
      juros: jurosMes,
      amortizacao: amortizacaoMes,
      saldo: saldoAtual
    });
  }

  return amortizacaoDados;
}
