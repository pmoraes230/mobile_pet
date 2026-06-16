import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { useAppTheme } from '../../theme/ThemeContext';

const AppAlertContext = createContext(null);

const DEFAULT_BUTTON = { text: 'Entendi' };

const inferType = (title = '', buttons = []) => {
  const normalizedTitle = String(title).toLowerCase();
  const hasDestructive = buttons.some((button) => button?.style === 'destructive');

  if (hasDestructive || normalizedTitle.includes('excluir')) return 'danger';
  if (normalizedTitle.includes('erro') || normalizedTitle.includes('falha')) return 'error';
  if (
    normalizedTitle.includes('sucesso') ||
    normalizedTitle.includes('criado') ||
    normalizedTitle.includes('cadastrado') ||
    normalizedTitle.includes('excluido') ||
    normalizedTitle.includes('removido')
  ) {
    return 'success';
  }
  if (
    normalizedTitle.includes('preencha') ||
    normalizedTitle.includes('selecione') ||
    normalizedTitle.includes('aten')
  ) {
    return 'warning';
  }

  return 'info';
};

const getTypeConfig = (type, palette) => {
  const configs = {
    success: { icon: 'OK', color: palette.success, soft: palette.successSoft },
    error: { icon: '!', color: palette.error, soft: palette.errorSoft },
    warning: { icon: '!', color: palette.warning, soft: palette.warningSoft },
    danger: { icon: '!', color: palette.danger, soft: palette.dangerSoft },
    info: { icon: 'i', color: palette.accent, soft: palette.accentSoft },
  };

  return configs[type] || configs.info;
};

export function AppAlertProvider({ children }) {
  const { isDarkMode } = useAppTheme();
  const nativeAlertRef = useRef(Alert.alert);
  const [alertConfig, setAlertConfig] = useState(null);

  const palette = useMemo(() => (
    isDarkMode
      ? {
          overlay: 'rgba(5, 7, 18, 0.74)',
          surface: '#17182B',
          card: '#202238',
          border: '#30334F',
          text: '#F5F7FF',
          subtitle: '#AEB6CC',
          accent: '#B77CFF',
          accentSoft: '#2A1D42',
          success: '#4ADE80',
          successSoft: '#193322',
          error: '#FB7185',
          errorSoft: '#3A1C2A',
          warning: '#FBBF24',
          warningSoft: '#3A2F13',
          danger: '#FB7185',
          dangerSoft: '#3A1C2A',
        }
      : {
          overlay: 'rgba(13, 33, 79, 0.36)',
          surface: '#FFFFFF',
          card: '#F8F9FA',
          border: '#E8E8E8',
          text: '#0D214F',
          subtitle: '#7E869E',
          accent: '#9127E1',
          accentSoft: '#F5E6FF',
          success: '#16A34A',
          successSoft: '#DCFCE7',
          error: '#E11D48',
          errorSoft: '#FFE4EC',
          warning: '#D97706',
          warningSoft: '#FEF3C7',
          danger: '#E11D48',
          dangerSoft: '#FFE4EC',
        }
  ), [isDarkMode]);

  const showAlert = (title, message, buttons, options) => {
    const normalizedButtons = Array.isArray(buttons) && buttons.length > 0
      ? buttons
      : [DEFAULT_BUTTON];

    setAlertConfig({
      title: String(title || ''),
      message: message ? String(message) : '',
      buttons: normalizedButtons,
      options: options || {},
      type: inferType(title, normalizedButtons),
    });
  };

  useEffect(() => {
    Alert.alert = showAlert;

    return () => {
      Alert.alert = nativeAlertRef.current;
    };
  }, []);

  const closeAlert = (button) => {
    const action = button?.onPress;
    setAlertConfig(null);

    if (typeof action === 'function') {
      setTimeout(() => action(), 120);
    }
  };

  const value = useMemo(() => ({ showAlert }), []);
  const typeConfig = alertConfig ? getTypeConfig(alertConfig.type, palette) : null;
  const buttons = alertConfig?.buttons || [];
  const stackedButtons = buttons.length > 2;

  return (
    <AppAlertContext.Provider value={value}>
      {children}

      <Modal
        visible={!!alertConfig}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (alertConfig?.options?.cancelable !== false) {
            closeAlert(buttons.find((button) => button?.style === 'cancel'));
          }
        }}
      >
        {alertConfig ? (
          <View style={[styles.overlay, { backgroundColor: palette.overlay }]}>
            <View style={[styles.content, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <View style={[styles.icon, { backgroundColor: typeConfig.soft }]}>
                <Text style={[styles.iconText, { color: typeConfig.color }]}>{typeConfig.icon}</Text>
              </View>

              <Text style={[styles.title, { color: palette.text }]}>{alertConfig.title}</Text>

              {alertConfig.message ? (
                <Text style={[styles.message, { color: palette.subtitle }]}>
                  {alertConfig.message}
                </Text>
              ) : null}

              <View style={[styles.actions, stackedButtons && styles.actionsStacked]}>
                {buttons.map((button, index) => {
                  const isCancel = button?.style === 'cancel';
                  const isDestructive = button?.style === 'destructive';
                  const buttonColor = isDestructive ? palette.danger : palette.accent;

                  return (
                    <TouchableOpacity
                      key={`${button?.text || 'button'}-${index}`}
                      style={[
                        styles.button,
                        stackedButtons && styles.buttonStacked,
                        isCancel
                          ? { backgroundColor: palette.card, borderColor: palette.border, borderWidth: 1 }
                          : { backgroundColor: buttonColor },
                      ]}
                      onPress={() => closeAlert(button)}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { color: isCancel ? palette.text : '#FFFFFF' },
                        ]}
                        numberOfLines={1}
                      >
                        {button?.text || 'Entendi'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        ) : null}
      </Modal>
    </AppAlertContext.Provider>
  );
}

export const useAppAlert = () => useContext(AppAlertContext);
