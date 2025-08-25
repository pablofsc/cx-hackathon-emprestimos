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
  selectedProduct?: Produto | null;
};

const ModalProduto: React.FC<ModalProdutoProps> = ({ visible, onClose, onSave, selectedProduct }) => {
  const [productName, setProductName] = useState(selectedProduct?.name || '');
  const [annualInterestRate, setAnnualInterestRate] = useState(selectedProduct?.annualInterestRate.toString() || '');
  const [maxMonths, setMaxMonths] = useState(selectedProduct?.maxMonths.toString() || '');

  const isSaveButtonDisabled = !productName || !annualInterestRate || !maxMonths;

  useEffect(() => {
    if (selectedProduct) {
      setProductName(selectedProduct.name);
      setAnnualInterestRate(selectedProduct.annualInterestRate.toString());
      setMaxMonths(selectedProduct.maxMonths.toString());
    } else {
      resetFields();
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
                  {selectedProduct ? 'Editar produto' : 'Adicionar novo produto'}
                </CaixaText>

                <View>
                  <CaixaText style={styles.inputLabel}>Nome do produto</CaixaText>

                  <TextInput
                    style={styles.input}
                    placeholder="Opção de empréstimo"
                    value={productName}
                    onChangeText={setProductName}
                  />
                </View>

                <View style={styles.row}>
                  <View style={{ height: 70, flex: 1 }}>
                    <CaixaText style={styles.inputLabel}>Taxa de juros anual</CaixaText>

                    <View style={[styles.inputWithSuffix, styles.rowItem]}>
                      <TextInput
                        style={styles.inputWithoutBorder}
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
                      />

                      <CaixaText style={styles.suffix}>%</CaixaText>
                    </View>
                  </View>

                  <View style={{ width: 10 }} />

                  <View style={{ height: 70, flex: 1 }}>
                    <CaixaText style={styles.inputLabel}>Prazo máximo (em meses)</CaixaText>

                    <View style={[styles.inputWithSuffix, styles.rowItem]}>
                      <TextInput
                        style={styles.inputWithoutBorder}
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
                      />

                      <CaixaText style={styles.suffix}>meses</CaixaText>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.saveButton, isSaveButtonDisabled && { backgroundColor: '#ccc' }]}
                  onPress={handleSave}
                  disabled={isSaveButtonDisabled}
                >
                  <CaixaText style={styles.saveButtonText}>Salvar</CaixaText>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
    fontSize: 16,
    marginBottom: 4,
    height: 20,
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
  saveButton: {
    backgroundColor: COLORS.caixaAzul,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
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
