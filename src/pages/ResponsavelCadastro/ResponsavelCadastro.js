import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

export default function ResponsavelCadastro() {
  const navigation = useNavigation();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');

  const temMinimo8 = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temSimbolo = /[@$%]/.test(senha);

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* BOTÃO VOLTAR */}
      <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 18 }}>←</Text>
      </TouchableOpacity>

      {/* LOGO */}
      <Image
        source={require('../../assets/pet.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>Crie sua conta</Text>

      <Text style={styles.subtitulo}>
        É rápido, fácil e gratuito.
      </Text>

      {/* NOME COMPLETO */}
      <Text style={styles.labelInput}>NOME COMPLETO</Text>
      <TextInput
        placeholder="Seu nome completo"
        placeholderTextColor="#999"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      {/* EMAIL */}
      <Text style={styles.labelInput}>EMAIL</Text>
      <TextInput
        placeholder="seu@email.com"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* SENHA */}
      <Text style={styles.labelInput}>SENHA</Text>
      <TextInput
        placeholder="••••••••"
        placeholderTextColor="#999"
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Text style={styles.senhaLabel}>A SENHA DEVE CONTER:</Text>
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

      {/* CPF OU CNPJ */}
      <Text style={styles.labelInput}>CPF OU CNPJ</Text>
      <TextInput
        placeholder="000.000.000-00 ou 00.000.000/0000-00"
        placeholderTextColor="#999"
        style={styles.input}
        value={cpfCnpj}
        onChangeText={setCpfCnpj}
        keyboardType="numeric"
      />

      {/* DATA DE NASCIMENTO */}
      <Text style={styles.labelInput}>DATA DE NASCIMENTO</Text>
      <TextInput
        placeholder="dd/mm/aaaa"
        placeholderTextColor="#999"
        style={styles.input}
        value={dataNascimento}
        onChangeText={setDataNascimento}
        keyboardType="numeric"
      />

      {/* ENDEREÇO */}
      <Text style={styles.labelInput}>ENDEREÇO</Text>
      <TextInput
        placeholder="Ex: Rua das Flores, 123 - Bairro - Cidade"
        placeholderTextColor="#999"
        style={styles.input}
        value={endereco}
        onChangeText={setEndereco}
      />

      {/* BOTÃO CADASTRAR */}
      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>

      {/* FOOTER */}
      <Text style={styles.footer}>
        Já tem uma conta? <Text 
          style={styles.linkFooter}
          onPress={() => navigation.goBack()}
        >
          Fazer Login
        </Text>
      </Text>
    </ScrollView>
  );
}
