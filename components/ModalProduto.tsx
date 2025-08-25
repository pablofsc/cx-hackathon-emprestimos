import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { COLORS } from '../app/constants/colors';
import CaixaText from './CaixaText';

type Produto = {
  id: string;
  name: string;
  annualInterestRate: number;
  maxMonths: number;
};

type ModalProdutoProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (product: Produto) => void;
  onDelete?: (productId: string) => void;
  selectedProduct?: Produto | null;
};

const ModalProduto: React.FC<ModalProdutoProps> = ({ visible, onClose, onSave, onDelete, selectedProduct }) => {
  const [productName, setProductName] = useState(selectedProduct?.name || '');
  const [annualInterestRate, setAnnualInterestRate] = useState(selectedProduct?.annualInterestRate.toString() || '');
  const [maxMonths, setMaxMonths] = useState(selectedProduct?.maxMonths.toString() || '');
  const [isViewMode, setIsViewMode] = useState(!!selectedProduct);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isSaveButtonDisabled =
    !productName ||
    !annualInterestRate ||
    !maxMonths ||
    (
      !!selectedProduct &&
      productName === selectedProduct.name &&
      annualInterestRate === selectedProduct.annualInterestRate.toString() &&
      maxMonths === selectedProduct.maxMonths.toString()
    );

  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.name);
      setAnnualInterestRate(selectedProduct.annualInterestRate.toString());
      setMaxMonths(selectedProduct.maxMonths.toString());
      setIsViewMode(true);
    } else {
      resetFields();
      setIsViewMode(false);
    }
  }, [selectedProduct]);

  const resetFields = () => {
    setProductName('');
    setAnnualInterestRate('');
    setMaxMonths('');
  };

  const handleSave = () => {
    if (!isSaveButtonDisabled) {
      const updatedProduct = {
        id: selectedProduct ? selectedProduct.id : Date.now().toString(),
        name: productName,
        annualInterestRate: parseFloat(annualInterestRate),
        maxMonths: parseInt(maxMonths, 10),
      };
      onSave(updatedProduct);
      resetFields();
      onClose();
    }
  };

  return (
    <>
    <Modal animationType="slide" transparent={true} visible={visible}>
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
          resetFields();
        }}
      >
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
                    {selectedProduct ? (isViewMode ? 'Visualizar produto' : 'Editar produto') : 'Adicionar novo produto'}
                </CaixaText>

                <View>
                  <CaixaText style={styles.inputLabel}>Nome do produto</CaixaText>

                    {isViewMode ? (
                      <CaixaText style={[styles.input, styles.inputViewMode, { height: 40, textAlignVertical: 'center' }]}>{productName}</CaixaText>
                    ) : (
                        <TextInput
                          style={styles.input}
                          placeholder="Opção de empréstimo"
                          value={productName}
                          onChangeText={setProductName}
                          editable={true}
                        />
                    )}
                </View>

                <View style={styles.row}>
                  <View style={{ height: 70, flex: 1 }}>
                    <CaixaText style={styles.inputLabel}>Taxa de juros anual</CaixaText>

                      <View style={[styles.inputWithSuffix, styles.rowItem, isViewMode && styles.inputViewMode]}>
                        {isViewMode ? (
                          <CaixaText style={[styles.inputWithoutBorder, styles.inputViewMode, { height: 40, textAlignVertical: 'center' }]}>{annualInterestRate}%</CaixaText>
                        ) : (
                          <>
                            <TextInput
                                style={[styles.inputWithoutBorder, { flex: 1 }]}
                                placeholder="Percentual de juros"
                                value={annualInterestRate}
                                onChangeText={(text) => {
                                  let sanitized = text.replace(/[^0-9.]/g, '');
                                  const parts = sanitized.split('.');
                                  if (parts.length > 2) {
                                    sanitized = parts[0] + '.' + parts.slice(1).join('');
                                  }
                                  if (sanitized.includes('.')) {
                                    const [intPart, decPart] = sanitized.split('.');
                                    sanitized = intPart + '.' + decPart.slice(0, 2);
                                  }
                                  setAnnualInterestRate(sanitized);
                                }}
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

                      <View style={[styles.inputWithSuffix, styles.rowItem, isViewMode && styles.inputViewMode]}>
                        {isViewMode ? (
                          <CaixaText style={[styles.inputWithoutBorder, styles.inputViewMode, { height: 40, textAlignVertical: 'center' }]}>{maxMonths} meses</CaixaText>
                        ) : (
                          <>
                            <TextInput
                                style={[styles.inputWithoutBorder, { flex: 1 }]}
                                placeholder="Número de meses"
                                value={maxMonths}
                                onChangeText={(text) => {
                                  let sanitized = text.replace(/[^0-9]/g, '');
                                  const months = Math.min(Math.max(parseInt(sanitized, 10), 1), 60);
                                  setMaxMonths(months.toString());
                                }}
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
                    {isViewMode ? (
                      <>
                        <TouchableOpacity
                          style={{ flex: 1, marginRight: 8, backgroundColor: styles.deleteButton.backgroundColor, borderRadius: 8, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                          onPress={() => setShowDeleteConfirm(true)}
                        >
                          <Ionicons name="trash" size={20} color="#fff" style={{ marginRight: 8 }} />
                          <CaixaText style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Apagar</CaixaText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1, marginLeft: 8, backgroundColor: styles.editButton.backgroundColor, borderRadius: 8, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                          onPress={() => setIsViewMode(false)}
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
        visible={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDeleteConfirm(false)}>
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
                    onPress={() => setShowDeleteConfirm(false)}
                  >
                    <CaixaText style={{ color: '#333', fontSize: 16 }}>Cancelar</CaixaText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, marginLeft: 8, backgroundColor: COLORS.vermelho, borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}
                    onPress={() => {
                      if (selectedProduct && onDelete) {
                        onDelete(selectedProduct.id);
                      }
                      setShowDeleteConfirm(false);
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
