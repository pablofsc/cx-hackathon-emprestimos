import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import CaixaText from '../components/CaixaText';
import { COLORS } from './constants/colors';

const mockProducts = [
  { id: '1', name: 'Product 1', annualInterestRate: 5, maxMonths: 12 },
  { id: '2', name: 'Product 2', annualInterestRate: 10, maxMonths: 24 },
  { id: '3', name: 'Product 3', annualInterestRate: 15, maxMonths: 36 },
  { id: '4', name: 'Product 4', annualInterestRate: 20, maxMonths: 48 },
];

type Product = {
  id: string;
  name: string;
  annualInterestRate: number;
  maxMonths: number;
};

const PaginaProdutos = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [annualInterestRate, setAnnualInterestRate] = useState('');
  const [maxMonths, setMaxMonths] = useState('');
  const [products, setProducts] = useState(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const isSaveButtonDisabled = !productName || !annualInterestRate || !maxMonths;

  const handleEditProduct = (product: Product) => {
    setProductName(product.name);
    setAnnualInterestRate(product.annualInterestRate.toString());
    setMaxMonths(product.maxMonths.toString());
    setSelectedProduct(product);
    setCreateModalVisible(true);
  };

  const resetFields = () => {
    setProductName('');
    setAnnualInterestRate('');
    setMaxMonths('');
    setSelectedProduct(null);
  };

  return (
    <View style={styles.container}>
      <CaixaText style={styles.description}>
        Apague um produto deslizando para a esquerda e adicione novos produtos usando o botão abaixo.
      </CaixaText>

      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEditProduct(item)}>
              <Swipeable
                renderRightActions={() => (
                  <TouchableOpacity
                    style={styles.deleteButtonContainer}
                    onPress={() => setProducts(products.filter((product) => product.id !== item.id))}
                  >
                    <View style={{ width: 14 }} />
                    <Ionicons name="trash" size={24} color="white" style={styles.deleteButton} />
                  </TouchableOpacity>
                )}
              >
                <View style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <CaixaText style={styles.listItemText}>{item.name}</CaixaText>
                    <View style={styles.listItemDetails}>
                      <CaixaText style={styles.listItemDetailText}>{item.annualInterestRate}%</CaixaText>
                      <CaixaText style={styles.listItemDetailText}>{item.maxMonths} meses</CaixaText>
                    </View>
                  </View>
                </View>
              </Swipeable>
            </TouchableOpacity>
          )}
        />
      </GestureHandlerRootView>

      <TouchableOpacity style={styles.fab} onPress={() => setCreateModalVisible(true)}>
        <LinearGradient
          colors={[COLORS.caixaTurquesa, COLORS.caixaAzul]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fabGradient, { borderRadius: 28 }]}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal para criação e edição de produtos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setCreateModalVisible(false);
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
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setCreateModalVisible(false);
                    }}
                  >
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
                    onPress={() => {
                      if (!isSaveButtonDisabled) {
                        const updatedProduct = {
                          id: selectedProduct ? selectedProduct.id : (products.length + 1).toString(),
                          name: productName,
                          annualInterestRate: parseFloat(annualInterestRate),
                          maxMonths: parseInt(maxMonths, 10),
                        };

                        if (selectedProduct) {
                          setProducts(products.map((product) => (product.id === selectedProduct.id ? updatedProduct : product)));
                        } else {
                          setProducts([...products, updatedProduct]);
                        }

                        setProductName('');
                        setAnnualInterestRate('');
                        setMaxMonths('');
                        setSelectedProduct(null);
                        setCreateModalVisible(false);
                      }
                    }}
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  listContainer: {
    paddingHorizontal: 8,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginVertical: 4,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
  },
  listItemDetails: {
    alignItems: 'flex-end',
  },
  listItemDetailText: {
    fontSize: 12,
    color: '#555',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    backgroundColor: COLORS.caixaAzul
  },
  fabGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBody: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 100px rgba(0, 0, 0, 0.3)',
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
  modalTopLine: {
    height: 3,
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
    zIndex: 10, // Garante que o botão fique acima de outros elementos
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    borderRadius: 8,
    padding: 14
  },
  createModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  createModalBody: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 100px rgba(0, 0, 0, 0.3)',
  },
});

export default PaginaProdutos;
