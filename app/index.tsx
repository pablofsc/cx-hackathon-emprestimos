
import ModalConfirmacaoExclusao from '@/components/ModalConfirmacaoExclusao';
import ModalProduto from '@/components/ModalProduto';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useReducer } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import CaixaText from '../components/CaixaText';
import {
  DELETEprodutos,
  GETprodutos,
  PATCHprodutos,
  POSTprodutos,
  Produto
} from '../services/apiServiceMock';
import { COLORS } from './constants/colors';

// Tipos para o estado e ações do reducer
interface ProdutosState {
  createModalVisible: boolean;
  products: Produto[];
  selectedProduct: Produto | null;
  showDeleteConfirm: boolean;
  productToDelete: Produto | null;
}

type ProdutosAction =
  | { type: 'SHOW_CREATE_MODAL'; }
  | { type: 'SHOW_EDIT_MODAL'; payload: Produto; }
  | { type: 'HIDE_MODAL'; }
  | { type: 'SHOW_DELETE_CONFIRM'; payload: Produto; }
  | { type: 'HIDE_DELETE_CONFIRM'; }
  | { type: 'ADD_PRODUCT'; payload: Produto; }
  | { type: 'UPDATE_PRODUCT'; payload: Produto; }
  | { type: 'DELETE_PRODUCT'; payload: string; }
  | { type: 'REFRESH_PRODUCTS'; }
  | { type: 'RESET_FIELDS'; };

// Estado inicial
const initialState: ProdutosState = {
  createModalVisible: false,
  products: GETprodutos(),
  selectedProduct: null,
  showDeleteConfirm: false,
  productToDelete: null,
};

// Reducer function
const produtosReducer = (state: ProdutosState, action: ProdutosAction): ProdutosState => {
  switch (action.type) {
    case 'SHOW_CREATE_MODAL':
      return {
        ...state,
        createModalVisible: true,
        selectedProduct: null,
      };

    case 'SHOW_EDIT_MODAL':
      return {
        ...state,
        createModalVisible: true,
        selectedProduct: action.payload,
      };

    case 'HIDE_MODAL':
      return {
        ...state,
        createModalVisible: false,
        selectedProduct: null,
      };

    case 'SHOW_DELETE_CONFIRM':
      return {
        ...state,
        showDeleteConfirm: true,
        productToDelete: action.payload,
      };

    case 'HIDE_DELETE_CONFIRM':
      return {
        ...state,
        showDeleteConfirm: false,
        productToDelete: null,
      };

    case 'ADD_PRODUCT':
      POSTprodutos(action.payload);
      return {
        ...state,
        products: GETprodutos(),
        createModalVisible: false,
        selectedProduct: null,
      };

    case 'UPDATE_PRODUCT':
      PATCHprodutos(action.payload);
      return {
        ...state,
        products: GETprodutos(),
        createModalVisible: false,
        selectedProduct: null,
      };

    case 'DELETE_PRODUCT':
      DELETEprodutos(action.payload);
      return {
        ...state,
        products: GETprodutos(),
        showDeleteConfirm: false,
        productToDelete: null,
        selectedProduct: null,
      };

    case 'REFRESH_PRODUCTS':
      return {
        ...state,
        products: GETprodutos(),
      };

    case 'RESET_FIELDS':
      return {
        ...state,
        selectedProduct: null,
      };

    default:
      return state;
  }
};

const PaginaProdutos = () => {
  const [state, dispatch] = useReducer(produtosReducer, initialState);
  const { createModalVisible, products, selectedProduct, showDeleteConfirm, productToDelete } = state;

  const handleEditProduct = (product: Produto) => {
    dispatch({ type: 'SHOW_EDIT_MODAL', payload: product });
  };

  const resetFields = () => {
    dispatch({ type: 'RESET_FIELDS' });
  };

  const handleCloseModal = () => {
    dispatch({ type: 'HIDE_MODAL' });
  };

  const saveProduct = (updatedProduct: Produto) => {
    if (selectedProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: updatedProduct });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
  };

  const handleSwipeDelete = (product: Produto) => {
    dispatch({ type: 'SHOW_DELETE_CONFIRM', payload: product });
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productToDelete.id });
    }
  };

  const cancelDelete = () => {
    dispatch({ type: 'HIDE_DELETE_CONFIRM' });
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
                    onPress={() => handleSwipeDelete(item)}
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

      <TouchableOpacity style={styles.fab} onPress={() => dispatch({ type: 'SHOW_CREATE_MODAL' })}>
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

      <ModalConfirmacaoExclusao
        visible={showDeleteConfirm}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
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
