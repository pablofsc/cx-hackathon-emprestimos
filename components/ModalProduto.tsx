import { Produto } from '@/services/produtosService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useReducer } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { COLORS } from '../app/constants/colors';
import CaixaText from './CaixaText';

type ModalProdutoProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (product: Produto) => void;
  onDelete?: (productId: string) => void;
  selectedProduct?: Produto | null;
};

// State type for the reducer
interface ModalState {
  productName: string;
  annualInterestRate: string;
  maxMonths: string;
  isViewMode: boolean;
  showDeleteConfirm: boolean;
}

// Action types
type ModalAction =
  | { type: 'SET_PRODUCT_NAME'; payload: string; }
  | { type: 'SET_ANNUAL_INTEREST_RATE'; payload: string; }
  | { type: 'SET_MAX_MONTHS'; payload: string; }
  | { type: 'SET_VIEW_MODE'; payload: boolean; }
  | { type: 'SET_SHOW_DELETE_CONFIRM'; payload: boolean; }
  | { type: 'LOAD_PRODUCT'; payload: Produto; }
  | { type: 'RESET_FIELDS'; };

// Initial state
const initialState: ModalState = {
  productName: '',
  annualInterestRate: '',
  maxMonths: '',
  isViewMode: false,
  showDeleteConfirm: false,
};

// Reducer function
function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'SET_PRODUCT_NAME':
      return { ...state, productName: action.payload };

    case 'SET_ANNUAL_INTEREST_RATE':
      return { ...state, annualInterestRate: action.payload };

    case 'SET_MAX_MONTHS':
      return { ...state, maxMonths: action.payload };

    case 'SET_VIEW_MODE':
      return { ...state, isViewMode: action.payload };

    case 'SET_SHOW_DELETE_CONFIRM':
      return { ...state, showDeleteConfirm: action.payload };

    case 'LOAD_PRODUCT':
      return {
        ...state,
        productName: action.payload.nome,
        annualInterestRate: action.payload.jurosAnuais.toString(),
        maxMonths: action.payload.maxMeses.toString(),
        isViewMode: true,
      };

    case 'RESET_FIELDS':
      return {
        ...state,
        productName: '',
        annualInterestRate: '',
        maxMonths: '',
        isViewMode: false,
        showDeleteConfirm: false,
      };

    default:
      return state;
  }
}

const ModalProduto: React.FC<ModalProdutoProps> = ({
  visible,
  onClose,
  onSave,
  onDelete,
  selectedProduct
}) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const isSaveButtonDisabled =
    !state.productName ||
    !state.annualInterestRate ||
    !state.maxMonths ||
    (
      !!selectedProduct &&
      state.productName === selectedProduct.nome &&
      state.annualInterestRate === selectedProduct.jurosAnuais.toString() &&
      state.maxMonths === selectedProduct.maxMeses.toString()
    );

  useEffect(() => {
    if (selectedProduct) {
      dispatch({ type: 'LOAD_PRODUCT', payload: selectedProduct });
    } else {
      dispatch({ type: 'RESET_FIELDS' });
    }
  }, [selectedProduct]);

  const handleSave = () => {
    if (!isSaveButtonDisabled) {
      const updatedProduct = {
        id: selectedProduct ? selectedProduct.id : Date.now().toString(),
        nome: state.productName,
        jurosAnuais: parseFloat(state.annualInterestRate),
        maxMeses: parseInt(state.maxMonths, 10),
      };
      onSave(updatedProduct);
      dispatch({ type: 'RESET_FIELDS' });
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    dispatch({ type: 'RESET_FIELDS' });
  };

  const handleInterestRateChange = (text: string) => {
    let sanitized = text.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    if (sanitized.includes('.')) {
      const [intPart, decPart] = sanitized.split('.');
      sanitized = intPart + '.' + decPart.slice(0, 2);
    }
    dispatch({ type: 'SET_ANNUAL_INTEREST_RATE', payload: sanitized });
  };

  const handleMaxMonthsChange = (text: string) => {
    let sanitized = text.replace(/[^0-9]/g, '');
    const months = Math.min(Math.max(parseInt(sanitized, 10), 1), 60);
    dispatch({ type: 'SET_MAX_MONTHS', payload: months.toString() });
  };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.createModalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.createModalBody}
              >
                <LinearGradient
                  colors={[COLORS.caixaTurquesa, COLORS.caixaAzul]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.modalTopLine}
                />

                <View style={styles.modalContent}>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>

                  <CaixaText style={styles.modalTitle}>
                    {selectedProduct ? (state.isViewMode ? 'Visualizar produto' : 'Editar produto') : 'Adicionar novo produto'}
                  </CaixaText>

                  <View>
                    <CaixaText style={styles.inputLabel}>Nome do produto</CaixaText>

                    {state.isViewMode ? (
                      <CaixaText style={[styles.input, styles.inputViewMode, { height: 40, textAlignVertical: 'center' }]}>
                        {state.productName}
                      </CaixaText>
                    ) : (
                        <TextInput
                          style={styles.input}
                          placeholder="Opção de empréstimo"
                          value={state.productName}
                          onChangeText={(text) => dispatch({ type: 'SET_PRODUCT_NAME', payload: text })}
                          editable={true}
                        />
                    )}
                  </View>

                  <View style={styles.row}>
                    <View style={{ height: 70, flex: 1 }}>
                      <CaixaText style={styles.inputLabel}>Taxa de juros anual</CaixaText>

                      <View style={[styles.inputWithSuffix, styles.rowItem, state.isViewMode && styles.inputViewMode]}>
                        {state.isViewMode ? (
                          <CaixaText style={[styles.inputWithoutBorder, styles.inputViewMode, { height: 40, textAlignVertical: 'center' }]}>
                            {state.annualInterestRate}%
                          </CaixaText>
                        ) : (
                          <>
                            <TextInput
                                style={[styles.inputWithoutBorder, { flex: 1 }]}
                                placeholder="Percentual de juros"
                                value={state.annualInterestRate}
                                onChangeText={handleInterestRateChange}
                                keyboardType="decimal-pad"
                                inputMode="decimal"
                                autoComplete="off"
                                importantForAutofill="no"
                                textContentType="none"
                                editable={true}
                              />
                            <CaixaText style={[styles.suffix, { marginLeft: 8 }]}>%</CaixaText>
                          </>
                        )}
                      </View>
                    </View>

                    <View style={{ width: 10 }} />

                    <View style={{ height: 70, flex: 1 }}>
                      <CaixaText style={styles.inputLabel}>Prazo máximo (em meses)</CaixaText>

                      <View style={[styles.inputWithSuffix, styles.rowItem, state.isViewMode && styles.inputViewMode]}>
                        {state.isViewMode ? (
                          <CaixaText style={[styles.inputWithoutBorder, styles.inputViewMode, { height: 40, textAlignVertical: 'center' }]}>
                            {state.maxMonths} meses
                          </CaixaText>
                        ) : (
                          <>
                            <TextInput
                                style={[styles.inputWithoutBorder, { flex: 1 }]}
                                placeholder="Número de meses"
                                value={state.maxMonths}
                                onChangeText={handleMaxMonthsChange}
                                keyboardType="numeric"
                                inputMode="numeric"
                                autoComplete="off"
                                importantForAutofill="no"
                                textContentType="none"
                                editable={true}
                              />
                            <CaixaText style={[styles.suffix, { marginLeft: 8 }]}>meses</CaixaText>
                          </>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={styles.buttonRow}>
                    {state.isViewMode ? (
                      <>
                        <TouchableOpacity
                          style={{ flex: 1, marginRight: 8, backgroundColor: styles.deleteButton.backgroundColor, borderRadius: 8, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                          onPress={() => dispatch({ type: 'SET_SHOW_DELETE_CONFIRM', payload: true })}
                        >
                          <Ionicons name="trash" size={20} color="#fff" style={{ marginRight: 8 }} />
                          <CaixaText style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Apagar</CaixaText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1, marginLeft: 8, backgroundColor: styles.editButton.backgroundColor, borderRadius: 8, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                          onPress={() => dispatch({ type: 'SET_VIEW_MODE', payload: false })}
                        >
                          <Ionicons name="pencil" size={20} color="#fff" style={{ marginRight: 8 }} />
                          <CaixaText style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Editar</CaixaText>
                        </TouchableOpacity>
                      </>
                    ) : (
                        <TouchableOpacity
                          style={{ flex: 1, backgroundColor: isSaveButtonDisabled ? '#ccc' : styles.saveButton.backgroundColor, borderRadius: 8, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                          onPress={handleSave}
                          disabled={isSaveButtonDisabled}
                        >
                          <Ionicons name="save" size={20} color="#fff" style={{ marginRight: 8 }} />
                          <CaixaText style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Salvar</CaixaText>
                        </TouchableOpacity>
                    )}
                  </View>
                </View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={state.showDeleteConfirm}
        onRequestClose={() => dispatch({ type: 'SET_SHOW_DELETE_CONFIRM', payload: false })}
      >
        <TouchableWithoutFeedback onPress={() => dispatch({ type: 'SET_SHOW_DELETE_CONFIRM', payload: false })}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 300, alignItems: 'center' }}>
                <Ionicons name="warning" size={40} color={COLORS.vermelho} style={{ marginBottom: 12 }} />
                <CaixaText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Confirmar exclusão</CaixaText>
                <CaixaText style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
                  Tem certeza que deseja apagar este produto?
                </CaixaText>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                  <TouchableOpacity
                    style={{ flex: 1, marginRight: 8, backgroundColor: '#eee', borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}
                    onPress={() => dispatch({ type: 'SET_SHOW_DELETE_CONFIRM', payload: false })}
                  >
                    <CaixaText style={{ color: '#333', fontSize: 16 }}>Cancelar</CaixaText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, marginLeft: 8, backgroundColor: COLORS.vermelho, borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}
                    onPress={() => {
                      if (selectedProduct && onDelete) {
                        onDelete(selectedProduct.id);
                      }
                      dispatch({ type: 'SET_SHOW_DELETE_CONFIRM', payload: false });
                      onClose();
                    }}
                  >
                    <CaixaText style={{ color: '#fff', fontSize: 16 }}>Apagar</CaixaText>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  createModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  createModalBody: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 100px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
  },
  modalTopLine: {
    height: 5,
  },
  modalContent: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  inputLabel: {
    fontSize: 13,
    marginBottom: 4,
    height: 20,
    color: '#888',
  },
  inputWithSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 40,
  },
  inputWithoutBorder: {
    flex: 1,
    height: 40,
  },
  inputViewMode: {
    borderWidth: 0, // No border for view mode
  },
  suffix: {
    fontSize: 16,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  rowItem: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: COLORS.caixaTurquesa,
  },
  saveButtonRight: {
    marginLeft: 'auto',
  },
  saveButton: {
    backgroundColor: COLORS.caixaAzul,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButton: {
    backgroundColor: COLORS.vermelho,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
});

export default ModalProduto;
