import ModalProduto from '@/components/ModalProduto';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
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
  const [products, setProducts] = useState(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setCreateModalVisible(true);
  };

  const resetFields = () => {
    setSelectedProduct(null);
  };

  const handleCloseModal = () => {
    setCreateModalVisible(false);
    resetFields();
  };

  const saveProduct = (updatedProduct: Product) => {
    if (selectedProduct) {
      setProducts(products.map((product) => (product.id === selectedProduct.id ? updatedProduct : product)));
    }
    else {
      setProducts([...products, updatedProduct]);
    }

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

      <ModalProduto
        visible={createModalVisible}
        onClose={handleCloseModal}
        onSave={saveProduct}
        onDelete={(productId) => {
          setProducts(products.filter((product) => product.id !== productId));
          setSelectedProduct(null);
        }}
        selectedProduct={selectedProduct}
      />
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
  deleteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  deleteButton: {
    backgroundColor: COLORS.vermelho,
    borderRadius: 8,
    padding: 14
  },
});

export default PaginaProdutos;
