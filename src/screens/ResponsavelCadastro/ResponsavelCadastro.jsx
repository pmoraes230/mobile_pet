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

export default function ResponsavelCadastro() {
  const navigation = useNavigation();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Validações de senha
  const temMinimo8 = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temSimbolo = /[@$%]/.test(senha);
  
  const podeRegistrar = temMinimo8 && temMaiuscula && temNumero && temSimbolo && nome && email && cpfCnpj && dataNascimento && endereco;

  const handleCadastro = async () => {
    if (!podeRegistrar) {
      setErro('Verifique todos os campos e requisitos de senha.');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      const resposta = await register(nome, email, senha, cpfCnpj, dataNascimento, endereco, telefone);
      
      Alert.alert(
        'Sucesso!',
        'Cadastro realizado com sucesso!',
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
      const mensagemErro = err.message || 'Erro ao cadastrar. Tente novamente.';
      setErro(mensagemErro);
      Alert.alert('Erro', mensagemErro);
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

          <Text style={styles.titulo}>Crie sua conta</Text>
          <Text style={styles.subtitulo}>
            Complete os dados abaixo para começar a cuidar do seu pet.
          </Text>

          <Text style={styles.labelInput}>NOME COMPLETO</Text>
          <TextInput
            placeholder="Seu nome completo"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.labelInput}>EMAIL</Text>
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.labelInput}>SENHA</Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          
          <Text style={styles.senhaLabel}>A senha deve conter:</Text>
          <Text style={[styles.senhaRequisito, temMinimo8 && styles.requisitoAtivo]}>
            ✓ Mínimo 8 caracteres
          </Text>
          <Text style={[styles.senhaRequisito, temMaiuscula && styles.requisitoAtivo]}>
            ✓ Uma letra maiúscula
          </Text>
          <Text style={[styles.senhaRequisito, temNumero && styles.requisitoAtivo]}>
            ✓ Um número
          </Text>
          <Text style={[styles.senhaRequisito, temSimbolo && styles.requisitoAtivo]}>
            ✓ Um símbolo (@$%)
          </Text>

          <Text style={styles.labelInput}>CPF OU CNPJ</Text>
          <TextInput
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={cpfCnpj}
            onChangeText={setCpfCnpj}
            keyboardType="numeric"
          />

          <Text style={styles.labelInput}>DATA DE NASCIMENTO</Text>
          <TextInput
            placeholder="dd/mm/aaaa"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={dataNascimento}
            onChangeText={setDataNascimento}
            keyboardType="numeric"
          />

          <Text style={styles.labelInput}>ENDEREÇO</Text>
          <TextInput
            placeholder="Ex: Rua das Flores, 123 - Bairro - Cidade"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
          />

          <Text style={styles.labelInput}>TELEFONE (OPCIONAL)</Text>
          <TextInput
            placeholder="(11) 99999-9999"
            placeholderTextColor="#A0A7E6"
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
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
              <Text style={styles.textoBotao}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Já tem uma conta?{' '}
            <Text 
              style={styles.footerLink} 
              onPress={() => navigation.goBack()}
            >
              Fazer login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}