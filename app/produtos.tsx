
import ModalProduto from '@/components/ModalProduto';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import CaixaText from '../components/CaixaText';
import {
  addProduto,
  deleteProduto,
  getProdutos,
  Produto,
  updateProduto
} from '../services/produtosService';
import { COLORS } from './constants/colors';

const PaginaProdutos = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [products, setProducts] = useState<Produto[]>(getProdutos());
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  const handleEditProduct = (product: Produto) => {
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

  const saveProduct = (updatedProduct: Produto) => {
    if (selectedProduct) {
      updateProduto(updatedProduct);
    } else {
      addProduto(updatedProduct);
    }
    setProducts(getProdutos());
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduto(productId);
    setProducts(getProdutos());
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
                    onPress={() => handleDeleteProduct(item.id)}
                  >
                    <View style={{ width: 14 }} />
                    <Ionicons name="trash" size={24} color="white" style={styles.deleteButton} />
                  </TouchableOpacity>
                )}
              >
                <View style={styles.listItem}>
                  <View style={styles.listItemContent}>
                    <CaixaText style={styles.listItemText}>{item.nome}</CaixaText>
                    <View style={styles.listItemDetails}>
                      <CaixaText style={styles.listItemDetailText}>{item.jurosAnuais}%</CaixaText>
                      <CaixaText style={styles.listItemDetailText}>{item.maxMeses} meses</CaixaText>
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
        onDelete={handleDeleteProduct}
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
