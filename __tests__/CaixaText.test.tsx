import { render } from '@testing-library/react-native';
import React from 'react';
import CaixaText from '../components/CaixaText';

// Teste básico de renderização
it('deve renderizar o texto corretamente', () => {
  const { getByText } = render(<CaixaText>Olá Caixa</CaixaText>);
  expect(getByText('Olá Caixa')).toBeTruthy();
});

// Teste de aplicação de estilo customizado
it('deve aplicar estilos customizados junto ao estilo padrão', () => {
  const { getByText } = render(
    <CaixaText style={{ color: 'red', fontSize: 20 }}>Teste</CaixaText>
  );
  const text = getByText('Teste');
  expect(text.props.style).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ fontFamily: 'CAIXASTD' }),
      expect.objectContaining({ color: 'red', fontSize: 20 })
    ])
  );
});
