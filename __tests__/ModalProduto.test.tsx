import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import ModalProduto from '../components/ModalProduto';
import { Produto } from '../services/apiServiceMock';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();
const mockOnDelete = jest.fn();

const produtoExemplo: Produto = {
  id: '1',
  nome: 'Produto Teste',
  jurosAnuais: 12.5,
  maxMeses: 24,
};

describe('ModalProduto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente para novo produto', () => {
    const { getByText, getByPlaceholderText } = render(
      <ModalProduto
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(getByText('Adicionar novo produto')).toBeTruthy();
    expect(getByPlaceholderText('Opção de empréstimo')).toBeTruthy();
    expect(getByPlaceholderText('Percentual de juros')).toBeTruthy();
    expect(getByPlaceholderText('Número de meses')).toBeTruthy();
  });

  it('preenche campos e salva novo produto', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ModalProduto
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    fireEvent.changeText(getByPlaceholderText('Opção de empréstimo'), 'Novo Produto');
    fireEvent.changeText(getByPlaceholderText('Percentual de juros'), '10.5');
    fireEvent.changeText(getByPlaceholderText('Número de meses'), '36');
    fireEvent.press(getByText('Salvar'));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Novo Produto',
          jurosAnuais: 10.5,
          maxMeses: 36,
        })
      );
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renderiza corretamente para produto selecionado (view mode)', () => {
    const { getByText, getAllByText } = render(
      <ModalProduto
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        selectedProduct={produtoExemplo}
      />
    );
    expect(getByText('Visualizar produto')).toBeTruthy();
    expect(getByText(produtoExemplo.nome)).toBeTruthy();
    expect(getByText(`${produtoExemplo.jurosAnuais}%`)).toBeTruthy();
    expect(getByText(`${produtoExemplo.maxMeses} meses`)).toBeTruthy();
    expect(getByText('Editar')).toBeTruthy();
    expect(getByText('Apagar')).toBeTruthy();
  });

  it('permite editar produto existente', async () => {
    const { getByText, getByPlaceholderText } = render(
      <ModalProduto
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        selectedProduct={produtoExemplo}
      />
    );
    fireEvent.press(getByText('Editar'));
    const inputNome = getByPlaceholderText('Opção de empréstimo');
    fireEvent.changeText(inputNome, 'Produto Editado');
    fireEvent.press(getByText('Salvar'));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Produto Editado',
        })
      );
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('aciona onDelete ao confirmar exclusão', async () => {
    const { getByText, getAllByText } = render(
      <ModalProduto
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onDelete={mockOnDelete}
        selectedProduct={produtoExemplo}
      />
    );
    fireEvent.press(getByText('Apagar'));
    // Espera o botão 'Apagar' do modal de confirmação aparecer
    await waitFor(() => {
      expect(getAllByText('Apagar').length).toBeGreaterThan(1);
    });
    // O segundo 'Apagar' é o do modal de confirmação
    const botoes = getAllByText('Apagar');
    fireEvent.press(botoes[1]);
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(produtoExemplo.id);
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('fecha modal ao pressionar o botão de fechar', () => {
    const { getByTestId } = render(
      <ModalProduto
        visible={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    fireEvent.press(getByTestId('close-modal-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
