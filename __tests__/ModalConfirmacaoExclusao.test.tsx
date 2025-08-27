import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { act } from 'react-test-renderer';
import ModalConfirmacaoExclusao from '../components/ModalConfirmacaoExclusao';

describe('ModalConfirmacaoExclusao', () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    titulo: 'Excluir Produto',
    mensagem: 'Deseja realmente excluir?',
  };

  it('deve renderizar título e mensagem padrão', () => {
    const { getByText } = render(
      <ModalConfirmacaoExclusao visible={true} onCancel={jest.fn()} onConfirm={jest.fn()} />
    );
    expect(getByText('Confirmar exclusão')).toBeTruthy();
    expect(getByText('Tem certeza que deseja apagar este produto?')).toBeTruthy();
  });

  it('deve renderizar título e mensagem customizados', () => {
    const { getByText } = render(
      <ModalConfirmacaoExclusao {...defaultProps} />
    );
    expect(getByText('Excluir Produto')).toBeTruthy();
    expect(getByText('Deseja realmente excluir?')).toBeTruthy();
  });

  it('deve chamar onCancel ao clicar em Cancelar', async () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <ModalConfirmacaoExclusao {...defaultProps} onCancel={onCancel} />
    );
    await act(async () => {
      fireEvent.press(getByText('Cancelar'));
    });
    expect(onCancel).toHaveBeenCalled();
  });

  it('deve chamar onConfirm ao clicar em Apagar', async () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <ModalConfirmacaoExclusao {...defaultProps} onConfirm={onConfirm} />
    );
    await act(async () => {
      fireEvent.press(getByText('Apagar'));
    });
    expect(onConfirm).toHaveBeenCalled();
  });

  it('não deve renderizar nada quando visible for false', () => {
    const { queryByText } = render(
      <ModalConfirmacaoExclusao {...defaultProps} visible={false} />
    );
    expect(queryByText('Excluir Produto')).toBeNull();
    expect(queryByText('Cancelar')).toBeNull();
  });
});
