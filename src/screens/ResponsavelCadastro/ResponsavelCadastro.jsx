import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { styles } from './styles';
import { register } from '../../services/auth';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ResponsavelCadastro() {
  const navigation = useNavigation();
  const { t } = useLanguage();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // --- FUNÇÕES DE MÁSCARA (Visual) ---
  const maskCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  };

  const maskData = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 10);
  };

  const maskPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  // Validações de senha
  const temMinimo8 = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temSimbolo = /[@#$%!&*]/.test(senha);
  
  const podeRegistrar = temMinimo8 && temMaiuscula && temNumero && temSimbolo && 
                        nome.length > 3 && email.includes('@') && 
                        cpfCnpj.length >= 14 && dataNascimento.length === 10;

  const handleCadastro = async () => {
    if (!podeRegistrar) {
      setErro(t('Verifique todos os campos e requisitos de senha.'));
      return;
    }

    setErro('');
    setLoading(true);

    try {
      await register(
        nome, 
        email, 
        senha, 
        cpfCnpj, 
        dataNascimento, 
        endereco, 
        telefone
      );
      
      Alert.alert(
        t('Sucesso!'),
        t('Cadastro realizado com sucesso!'),
        [
          { 
            text: 'OK', 
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }
          }
        ]
      );
    } catch (err) {
      const mensagemErro = err.message || t('Erro ao cadastrar.');
      setErro(mensagemErro);
      Alert.alert(t('Erro'), mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.screenContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color="#0D214F" strokeWidth={2.5} />
          </TouchableOpacity>

          <Image
            source={require('../../assets/pet.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.titulo}>{t('Crie sua conta')}</Text>
          <Text style={styles.subtitulo}>
            {t('Complete os dados abaixo para começar a cuidar do seu pet.')}
          </Text>

          <Text style={styles.labelInput}>{t('NOME COMPLETO')}</Text>
          <TextInput
            placeholder={t('Seu nome completo')}
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.labelInput}>{t('EMAIL')}</Text>
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.labelInput}>{t('SENHA')}</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          
          <Text style={styles.senhaLabel}>{t('A senha deve conter:')}</Text>
          <Text style={[styles.senhaRequisito, temMinimo8 && styles.requisitoAtivo]}>
            ✓ {t('Mínimo 8 caracteres')}
          </Text>
          <Text style={[styles.senhaRequisito, temMaiuscula && styles.requisitoAtivo]}>
            ✓ {t('Uma letra maiúscula')}
          </Text>
          <Text style={[styles.senhaRequisito, temNumero && styles.requisitoAtivo]}>
            ✓ {t('Um número')}
          </Text>
          <Text style={[styles.senhaRequisito, temSimbolo && styles.requisitoAtivo]}>
            ✓ {t('Um símbolo (@$%)')}
          </Text>

          <Text style={styles.labelInput}>{t('CPF')}</Text>
          <TextInput
            placeholder="000.000.000-00"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={cpfCnpj}
            onChangeText={(t) => setCpfCnpj(maskCPF(t))}
            keyboardType="numeric"
          />

          <Text style={styles.labelInput}>{t('DATA DE NASCIMENTO')}</Text>
          <TextInput
            placeholder="dd/mm/aaaa"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={dataNascimento}
            onChangeText={(t) => setDataNascimento(maskData(t))}
            keyboardType="numeric"
          />

          <Text style={styles.labelInput}>{t('ENDEREÇO')}</Text>
          <TextInput
            placeholder={t('Ex: Rua das Flores, 123 - Bairro - Cidade')}
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
          />

          <Text style={styles.labelInput}>{t('TELEFONE (OPCIONAL)')}</Text>
          <TextInput
            placeholder="(11) 99999-9999"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={telefone}
            onChangeText={(t) => setTelefone(maskPhone(t))}
            keyboardType="phone-pad"
          />

          {erro ? (
            <Text style={{ color: '#FF6B6B', marginTop: 10, marginBottom: 10, textAlign: 'center', fontSize: 14 }}>
              {erro}
            </Text>
          ) : null}

          <TouchableOpacity 
            style={[styles.botao, (!podeRegistrar || loading) && { opacity: 0.6 }]} 
            onPress={handleCadastro}
            disabled={!podeRegistrar || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.textoBotao}>{t('Cadastrar')}</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            {t('Já tem uma conta?')}{' '}
            <Text 
              style={styles.footerLink} 
              onPress={() => navigation.goBack()}
            >
              {t('Fazer login')}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}