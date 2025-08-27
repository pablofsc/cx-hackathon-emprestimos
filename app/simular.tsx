import { Ionicons } from '@expo/vector-icons';
import React, { useReducer } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import CaixaText from '../components/CaixaText';
import ModalAmortizacao from '../components/ModalAmortizacao';
import { getProdutos, Produto } from '../services/produtosService';
import { COLORS } from './constants/colors';

// State type for the reducer
interface SimulationState {
  produtos: Produto[];
  produtoSelecionado: Produto | null;
  meses: string;
  valor: number;
  modalAmortizacaoVisible: boolean;
}

// Action types
type SimulationAction =
  | { type: 'LOAD_PRODUTOS'; }
  | { type: 'SELECT_PRODUTO'; payload: string; }
  | { type: 'SET_MESES'; payload: string; }
  | { type: 'SET_VALOR'; payload: number; }
  | { type: 'TOGGLE_MODAL_AMORTIZACAO'; payload?: boolean; }
  | { type: 'VALIDATE_MESES_FOR_PRODUCT'; };

// Initial state
const createInitialState = (): SimulationState => {
  const produtos = getProdutos();
  return {
    produtos,
    produtoSelecionado: produtos[0] || null,
    meses: '',
    valor: 0,
    modalAmortizacaoVisible: false,
  };
};

// Reducer function
function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'LOAD_PRODUTOS': {
      const produtos = getProdutos();
      return {
        ...state,
        produtos,
        produtoSelecionado: produtos[0] || null,
      };
    }

    case 'SELECT_PRODUTO': {
      const produto = state.produtos.find(p => p.id === action.payload) || null;
      let newMeses = state.meses;

      // Validate and adjust meses if it exceeds the new product's limit
      if (produto && produto.maxMeses) {
        const currentMesesNum = parseInt(state.meses) || 0;
        if (currentMesesNum > produto.maxMeses) {
          newMeses = produto.maxMeses.toString();
        }
      }

      return {
        ...state,
        produtoSelecionado: produto,
        meses: newMeses,
      };
    }

    case 'SET_MESES': {
      const num = parseInt(action.payload) || 0;
      const max = state.produtoSelecionado?.maxMeses || 0;

      const validatedMeses = num > max ? max.toString() : action.payload;

      return {
        ...state,
        meses: validatedMeses,
      };
    }

    case 'SET_VALOR':
      return {
        ...state,
        valor: action.payload,
      };

    case 'TOGGLE_MODAL_AMORTIZACAO':
      return {
        ...state,
        modalAmortizacaoVisible: action.payload !== undefined ? action.payload : !state.modalAmortizacaoVisible,
      };

    case 'VALIDATE_MESES_FOR_PRODUCT': {
      const currentMesesNum = parseInt(state.meses) || 0;
      const max = state.produtoSelecionado?.maxMeses || 0;

      if (currentMesesNum > max) {
        return {
          ...state,
          meses: max.toString(),
        };
      }
      return state;
    }

    default:
      return state;
  }
}

const PaginaSimular = () => {
  const [state, dispatch] = useReducer(simulationReducer, null, createInitialState);

  const handleSelectProduto = (produtoId: string) => {
    dispatch({ type: 'SELECT_PRODUTO', payload: produtoId });
  };

  const handleChangeMeses = (text: string) => {
    dispatch({ type: 'SET_MESES', payload: text });
  };

  // Cálculos (derived state)
  const jurosAnuais = state.produtoSelecionado?.jurosAnuais || 0;
  const mesesNum = parseInt(state.meses) || 0;
  const valorNum = state.valor;

  // Taxa efetiva mensal (juros compostos)
  const taxaEfetivaMensal = jurosAnuais > 0 ? (Math.pow(1 + jurosAnuais / 100, 1 / 12) - 1) : 0;

  // Valor total e parcela
  let valorTotal = 0;
  let valorParcela = 0;
  if (valorNum > 0 && mesesNum > 0 && taxaEfetivaMensal > 0) {
    valorParcela = valorNum * (taxaEfetivaMensal * Math.pow(1 + taxaEfetivaMensal, mesesNum)) / (Math.pow(1 + taxaEfetivaMensal, mesesNum) - 1);
    valorTotal = valorParcela * mesesNum;
  }

  const isDisabled = state.valor === 0 || state.meses === '' || parseInt(state.meses) === 0;

  // Função para calcular a amortização mês a mês
  const calcularAmortizacao = () => {
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
  };

  const dadosAmortizacao = calcularAmortizacao();

  return (
    <View style={styles.container}>
      <CaixaText style={styles.description}>
        Selecione o produto, informe o valor desejado e a quantidade de meses para simular o empréstimo.
      </CaixaText>

      {/* Cards de resultado em grade 2x2 */}
      <View style={styles.cardsGrid}>
        <View style={styles.cardRow}>
          {/* Dados do produto */}
          {state.produtoSelecionado && (
            <View style={styles.card}>
              <CaixaText style={styles.cardTitle}>Informações do Produto</CaixaText>
              <CaixaText style={styles.cardText}>
                {state.produtoSelecionado.jurosAnuais}% a.a. em até {state.produtoSelecionado.maxMeses} m.
              </CaixaText>
            </View>
          )}
          {/* Taxa efetiva mensal */}
          <View style={styles.card}>
            <CaixaText style={styles.cardTitle}>Taxa efetiva mensal</CaixaText>
            <CaixaText style={styles.cardText}>{(taxaEfetivaMensal * 100).toFixed(3)}%</CaixaText>
          </View>
        </View>
        <View style={styles.cardRow}>
          {/* Valor total com juros */}
          <View style={[styles.card, isDisabled && styles.disabledCard]}>
            <CaixaText style={styles.cardTitle}>Valor total com juros</CaixaText>
            <CaixaText style={styles.cardText}>
              {valorTotal > 0 ? `R$ ${valorTotal.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}` : '--'}
            </CaixaText>
          </View>
          {/* Valor da parcela mensal */}
          <View style={[styles.card, isDisabled && styles.disabledCard]}>
            <CaixaText style={styles.cardTitle}>Valor da parcela mensal</CaixaText>
            <CaixaText style={styles.cardText}>
              {valorParcela > 0 ? `R$ ${valorParcela.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}` : '--'}
            </CaixaText>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={{ ...styles.amortizacaoButton, backgroundColor: isDisabled ? '#ccc' : styles.amortizacaoButton.backgroundColor }}
        onPress={() => dispatch({ type: 'TOGGLE_MODAL_AMORTIZACAO', payload: true })}
        disabled={isDisabled}
      >
        <Ionicons name="calculator" size={20} color="#fff" />
        <CaixaText style={styles.amortizacaoButtonText}>Ver memória de cálculo</CaixaText>
      </TouchableOpacity>

      <View style={styles.separator} />

      <View style={styles.rowInputs}>
        <View style={styles.inputCol}>
          <CaixaText style={styles.label}>Valor do empréstimo</CaixaText>
          <View style={styles.inputContainer}>
            <CurrencyInput
              value={state.valor}
              onChangeValue={(value) => dispatch({ type: 'SET_VALOR', payload: value || 0 })}
              prefix="R$ "
              delimiter="."
              separator=","
              precision={2}
              style={styles.input}
              placeholder="Digite o valor"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputCol}>
          <CaixaText style={styles.label}>Meses</CaixaText>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Meses"
              keyboardType="numeric"
              value={state.meses}
              onChangeText={handleChangeMeses}
              maxLength={state.produtoSelecionado ? state.produtoSelecionado.maxMeses.toString().length : 3}
            />
            <CaixaText style={styles.maxText}>até {state.produtoSelecionado?.maxMeses}</CaixaText>
          </View>
        </View>
      </View>

      {/* Seletor de Produto - Wheel Picker Expo */}
      <View style={styles.pickerContainer}>
        <WheelPickerExpo
          width={'100%'}
          initialSelectedIndex={state.produtoSelecionado ? state.produtos.findIndex(p => p.id === state.produtoSelecionado!.id) : 0}
          items={state.produtos.map((produto) => ({ label: produto.nome, value: produto.id }))}
          onChange={({ item }) => handleSelectProduto(item.value)}
          backgroundColor="#f9f9f9"
          selectedStyle={{ borderColor: COLORS.caixaAzul, borderWidth: 1 }}
        />
      </View>

      {/* Modal de Amortização */}
      <ModalAmortizacao
        visible={state.modalAmortizacaoVisible}
        onClose={() => dispatch({ type: 'TOGGLE_MODAL_AMORTIZACAO', payload: false })}
        dados={dadosAmortizacao}
        valorParcela={valorParcela}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rowInputs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
    gap: 12,
  },
  inputCol: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    margin: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.caixaAzul,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: COLORS.caixaAzul,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    paddingLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  inputPrefix: {
    fontSize: 16,
    color: '#888',
    marginRight: 4,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  cardsGrid: {
    gap: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 0,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: COLORS.caixaAzul,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  maxText: {
    fontSize: 12,
    color: '#888',
    margin: 8,
  },
  disabledCard: {
    opacity: 0.5,
  },
  amortizacaoButton: {
    backgroundColor: COLORS.caixaAzul,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 16,
    gap: 8,
  },
  amortizacaoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaginaSimular;
