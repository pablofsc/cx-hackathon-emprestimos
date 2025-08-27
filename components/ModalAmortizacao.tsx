import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { COLORS } from '../app/constants/colors';
import CaixaText from './CaixaText';

type AmortizacaoItem = {
  mes: number;
  juros: number;
  amortizacao: number;
  saldo: number;
};

type ModalAmortizacaoProps = {
  visible: boolean;
  onClose: () => void;
  dados: AmortizacaoItem[];
  valorParcela: number;
};

const ModalAmortizacao: React.FC<ModalAmortizacaoProps> = ({ visible, onClose, dados, valorParcela }) => {

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.createModalBody}>
        <LinearGradient
          colors={[COLORS.caixaTurquesa, COLORS.caixaAzul]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.modalTopLine}
        />

        <View style={styles.scrollContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <CaixaText style={styles.modalTitle}>Memória de Cálculo Mensal</CaixaText>

          {dados.length > 0 ? (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <CaixaText style={styles.tableHeaderCell}>Mês</CaixaText>
                <CaixaText style={styles.tableHeaderCell}>Juros</CaixaText>
                <CaixaText style={styles.tableHeaderCell}>Amortização</CaixaText>
                <CaixaText style={styles.tableHeaderCell}>Saldo</CaixaText>
              </View>

              {/* Make only the rows scrollable so header stays fixed - use FlatList for reliable nested scrolling */}
              <FlatList
                data={dados}
                keyExtractor={(item) => item.mes.toString()}
                style={styles.tableBody}
                contentContainerStyle={styles.tableBodyContent}
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                renderItem={({ item, index }) => {
                  // Calcular o mês/ano a partir do mês atual
                  const now = new Date();
                  // Começa do próximo mês
                  const startMonth = now.getMonth() + 1; // 0-based
                  const startYear = now.getFullYear();
                  const totalMonths = startMonth + index;
                  const displayMonth = (totalMonths % 12) === 0 ? 12 : (totalMonths % 12);
                  const displayYear = startYear + Math.floor((startMonth + index - 1) / 12);
                  const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
                  const mesFormatado = `${monthNames[displayMonth - 1]}/${displayYear.toString().slice(-2)}`;
                  return (
                    <View style={styles.tableRow}>
                      <CaixaText style={styles.tableCell}>{item.mes} ({mesFormatado})</CaixaText>
                      <CaixaText style={styles.tableCell}>R$ {item.juros.toFixed(2)}</CaixaText>
                      <CaixaText style={styles.tableCell}>R$ {item.amortizacao.toFixed(2)}</CaixaText>
                      <CaixaText style={styles.tableCell}>R$ {item.saldo.toFixed(2)}</CaixaText>
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <CaixaText style={styles.emptyText}>Nenhum dado de amortização disponível</CaixaText>
              <CaixaText style={styles.emptySubtext}>Preencha os dados do empréstimo primeiro</CaixaText>
            </View>
          )}
        </View>
      </View>
    </Modal >
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  createModalBody: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 100px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    height: '80%',
    maxHeight: 600,
    minHeight: 400,
  },
  modalTopLine: {
    height: 5,
  },
  scrollContent: {
    flex: 1,
    paddingTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.caixaAzul,
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  tableContainer: {
    flex: 1,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0', // cor sutil
    backgroundColor: '#fff',
  },
  tableBody: {
    flex: 1,
  },
  tableBodyContent: {
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.caixaAzul,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default ModalAmortizacao;
