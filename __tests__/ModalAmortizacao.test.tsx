import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import ModalAmortizacao from '../components/ModalAmortizacao';

describe('ModalAmortizacao', () => {
  const dadosMock = [
    { mes: 1, juros: 100.5, amortizacao: 200.25, saldo: 5000.75 },
    { mes: 2, juros: 90.0, amortizacao: 210.0, saldo: 4790.75 },
  ];
  const valorParcelaMock = 300.75;
  const onCloseMock = jest.fn();

  it('should render modal when visible is true', () => {
    const { getByText } = render(
      <ModalAmortizacao
        visible={true}
        onClose={onCloseMock}
        dados={dadosMock}
        valorParcela={valorParcelaMock}
      />
    );
    expect(getByText('Memória de Cálculo Mensal')).toBeTruthy();
  });

  it('should not render modal content when visible is false', () => {
    const { queryByText } = render(
      <ModalAmortizacao
        visible={false}
        onClose={onCloseMock}
        dados={dadosMock}
        valorParcela={valorParcelaMock}
      />
    );
    expect(queryByText('Memória de Cálculo Mensal')).toBeNull();
  });

  it('should call onClose when close button is pressed', () => {
    const { getByRole } = render(
      <ModalAmortizacao
        visible={true}
        onClose={onCloseMock}
        dados={dadosMock}
        valorParcela={valorParcelaMock}
      />
    );
    const closeButton = getByRole('button');
    fireEvent.press(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should render table headers', () => {
    const { getByText } = render(
      <ModalAmortizacao
        visible={true}
        onClose={onCloseMock}
        dados={dadosMock}
        valorParcela={valorParcelaMock}
      />
    );
    expect(getByText('Mês')).toBeTruthy();
    expect(getByText('Juros')).toBeTruthy();
    expect(getByText('Amortização')).toBeTruthy();
    expect(getByText('Saldo')).toBeTruthy();
  });

  it('should render amortizacao data rows', () => {
    const { getByText } = render(
      <ModalAmortizacao
        visible={true}
        onClose={onCloseMock}
        dados={dadosMock}
        valorParcela={valorParcelaMock}
      />
    );
    expect(getByText(/1 \(.*\)/)).toBeTruthy();
    expect(getByText('R$ 100.50')).toBeTruthy();
    expect(getByText('R$ 200.25')).toBeTruthy();
    expect(getByText('R$ 5000.75')).toBeTruthy();
    expect(getByText(/2 \(.*\)/)).toBeTruthy();
    expect(getByText('R$ 90.00')).toBeTruthy();
    expect(getByText('R$ 210.00')).toBeTruthy();
    expect(getByText('R$ 4790.75')).toBeTruthy();
  });

  it('should show empty state when dados is empty', () => {
    const { getByText } = render(
      <ModalAmortizacao
        visible={true}
        onClose={onCloseMock}
        dados={[]}
        valorParcela={valorParcelaMock}
      />
    );
    expect(getByText('Nenhum dado de amortização disponível')).toBeTruthy();
    expect(getByText('Preencha os dados do empréstimo primeiro')).toBeTruthy();
  });
});
