import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { COLORS } from '../app/constants/colors';
import CaixaText from './CaixaText';

type ModalConfirmacaoExclusaoProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  titulo?: string;
  mensagem?: string;
};

const ModalConfirmacaoExclusao: React.FC<ModalConfirmacaoExclusaoProps> = ({
  visible,
  onCancel,
  onConfirm,
  titulo = 'Confirmar exclusão',
  mensagem = 'Tem certeza que deseja apagar este produto?'
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Ionicons name="warning" size={40} color={COLORS.vermelho} style={styles.icon} />
              <CaixaText style={styles.title}>{titulo}</CaixaText>
              <CaixaText style={styles.message}>
                {mensagem}
              </CaixaText>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                >
                  <CaixaText style={styles.cancelButtonText}>Cancelar</CaixaText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                >
                  <CaixaText style={styles.confirmButtonText}>Apagar</CaixaText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: '#eee',
  },
  confirmButton: {
    marginLeft: 8,
    backgroundColor: COLORS.vermelho,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ModalConfirmacaoExclusao;
