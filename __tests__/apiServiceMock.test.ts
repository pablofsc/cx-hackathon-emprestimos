import {
  DELETEprodutos,
  GETprodutos,
  PATCHprodutos,
  POSTprodutos,
  POSTsimulacoes,
  Produto
} from '../services/apiServiceMock';

describe('apiServiceMock', () => {
  beforeEach(() => {
    // Reset products to initial state before each test
    while (GETprodutos().length > 4) {
      DELETEprodutos(GETprodutos()[GETprodutos().length - 1].id);
    }
    PATCHprodutos({ id: '1', nome: 'Product 1', jurosAnuais: 5, maxMeses: 12 });
    PATCHprodutos({ id: '2', nome: 'Product 2', jurosAnuais: 10, maxMeses: 24 });
    PATCHprodutos({ id: '3', nome: 'wrwerwe 3', jurosAnuais: 15, maxMeses: 36 });
    PATCHprodutos({ id: '4', nome: 'Product 4', jurosAnuais: 20, maxMeses: 48 });
  });

  it('GETprodutos should return initial products', () => {
    const produtos = GETprodutos();
    expect(produtos.length).toBe(4);
    expect(produtos[0].nome).toBe('Product 1');
  });

  it('POSTprodutos should add a new product', () => {
    const novoProduto: Produto = { id: '5', nome: 'Novo Produto', jurosAnuais: 8, maxMeses: 18 };
    POSTprodutos(novoProduto);
    const produtos = GETprodutos();
    expect(produtos.length).toBe(5);
    expect(produtos[4]).toEqual(novoProduto);
  });

  it('PATCHprodutos should update an existing product', () => {
    PATCHprodutos({ id: '2', nome: 'Produto Atualizado', jurosAnuais: 12, maxMeses: 30 });
    const produto = GETprodutos().find(p => p.id === '2');
    expect(produto).toEqual({ id: '2', nome: 'Produto Atualizado', jurosAnuais: 12, maxMeses: 30 });
  });

  it('DELETEprodutos should remove a product', () => {
    DELETEprodutos('3');
    const produtos = GETprodutos();
    expect(produtos.length).toBe(3);
    expect(produtos.find(p => p.id === '3')).toBeUndefined();
  });

  it('POSTsimulacoes should return correct amortizacao array', () => {
    const valor = 1200;
    const meses = 12;
    const taxa = 0.01;
    const parcela = 110;
    const amortizacao = POSTsimulacoes(valor, meses, taxa, parcela);
    expect(amortizacao.length).toBe(12);
    expect(amortizacao[0]).toHaveProperty('mes');
    expect(amortizacao[0]).toHaveProperty('juros');
    expect(amortizacao[0]).toHaveProperty('amortizacao');
    expect(amortizacao[0]).toHaveProperty('saldo');
  });

  it('POSTsimulacoes should return empty array for invalid input', () => {
    expect(POSTsimulacoes(0, 12, 0.01, 110)).toEqual([]);
    expect(POSTsimulacoes(1200, 0, 0.01, 110)).toEqual([]);
    expect(POSTsimulacoes(1200, 12, 0, 110)).toEqual([]);
  });
});
