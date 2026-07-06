import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@app_language';

const translations = {
  pt: {},
  en: {
    'Home': 'Home',
    'Pets': 'Pets',
    'Agenda': 'Schedule',
    'Chat': 'Chat',
    'Menu': 'Menu',
    'Meu Perfil': 'My Profile',
    'Configurações': 'Settings',
    'Sair': 'Log out',
    'Versão 1.0.0': 'Version 1.0.0',
    'Deseja realmente sair?': 'Do you really want to log out?',
    'Você precisará fazer login novamente para acessar o app.': 'You will need to log in again to access the app.',
    'Cancelar': 'Cancel',
    'Bem-vindo!': 'Welcome!',
    'Olá': 'Hello',
    'Que você tenha um excelente atendimento!': 'Hope you have a great appointment!',
    'Notificações': 'Notifications',
    'Carregando notificações...': 'Loading notifications...',
    'Nenhuma notificação por enquanto.': 'No notifications yet.',
    'Ver Todas as Notificações →': 'See All Notifications →',
    'Novo match': 'New match',
    'Adoção': 'Adoption',
    'Vacina': 'Vaccine',
    'Medicamento': 'Medication',
    'Agendamento': 'Appointment',
    'Notificação': 'Notification',
    'Agora': 'Now',
    'Você tem uma nova notificação.': 'You have a new notification.',
    'Próximo Compromisso': 'Next Appointment',
    'Sem agendamentos': 'No appointments',
    'Tudo tranquilo por enquanto.': 'Everything is quiet for now.',
    'Carregando agenda...': 'Loading schedule...',
    'Buscando seus proximos compromissos.': 'Looking for your next appointments.',
    'Data não informada': 'Date not provided',
    'Consulta': 'Appointment',
    'Acesse o Agendamento de Consultas.': 'Open appointment scheduling.',
    'Prontuário': 'Medical Records',
    'Acesse o prontuário de seus pets.': 'Open your pets medical records.',
    'Diário emocional': 'Emotional Diary',
    'Registre o diário.': 'Record the diary.',
    'Meus pets': 'My pets',
    'Acesse seus pets.': 'Open your pets.',
    'cupidopet': 'Cupidopet',
    'Faça o seu pet encontrar um novo parceiro.': 'Help your pet find a new friend.',
    'Adote um pet e dê uma nova chance.': 'Adopt a pet and give them a new chance.',
    'Configurações da Conta': 'Account Settings',
    'Ajuste seu app do jeito que você prefere.': 'Adjust the app the way you prefer.',
    'Aparência': 'Appearance',
    'Ative o modo escuro quando quiser. O app continua claro por padrão.': 'Turn on dark mode whenever you want. The app stays light by default.',
    'Modo escuro': 'Dark mode',
    'Essa escolha fica salva para as próximas vezes.': 'This choice is saved for next time.',
    'Idioma': 'Language',
    'Escolha o idioma da plataforma.': 'Choose the platform language.',
    'Português (Brasil)': 'Portuguese (Brazil)',
    'Inglês': 'English',
    'Selecionado': 'Selected',
    'Notificações no celular': 'Phone notifications',
    'Gerencie alertas e lembretes.': 'Manage alerts and reminders.',
    'Receba avisos do app direto na aba de notificações do celular.': 'Receive app alerts directly in your phone notifications.',
    'Lembretes de vacinas': 'Vaccine reminders',
    'Receba lembretes para as vacinas do seu pet.': 'Receive reminders for your pet vaccines.',
    'Dicas semanais de cuidados': 'Weekly care tips',
    'Receba dicas para cuidar melhor do seu pet.': 'Receive tips to take better care of your pet.',
    'Privacidade': 'Privacy',
    'Controle quem vê seus dados.': 'Control who sees your data.',
    'Redefinir minha senha': 'Reset my password',
    'Autenticação em 2 fatores em breve': 'Two-factor authentication coming soon',
    'Desativar conta': 'Deactivate account',
    'Ao desativar sua conta, você perderá acesso permanente a todos os seus pets, registros e histórico. Essa ação é irreversível.': 'If you deactivate your account, you will permanently lose access to all your pets, records and history. This action cannot be undone.',
    'DESATIVAR MINHA CONTA': 'DEACTIVATE MY ACCOUNT',
    'Não foi possível salvar as preferências de notificação.': 'Could not save notification preferences.',
    'Erro': 'Error',
    'Em breve': 'Coming soon',
    'A área de consultas ainda não foi implementada.': 'The appointments area has not been implemented yet.',
    'Gerencie as informações de todos os seus amigos.': 'Manage all your friends information.',
    'Adicionar pet': 'Add pet',
    'Carregando pets...': 'Loading pets...',
    'Você ainda não cadastrou nenhum pet.': 'You have not registered any pets yet.',
    'Nenhum pet encontrado com essa busca ou filtro.': 'No pet found with this search or filter.',
    'Buscar nos meus pets': 'Search my pets',
    'Todos': 'All',
    'Cachorros': 'Dogs',
    'Gatos': 'Cats',
    'Outros': 'Others',
    'Mostrar todos os pets': 'Show all pets',
    'Apenas pets caninos': 'Only dog pets',
    'Apenas pets felinos': 'Only cat pets',
    'Outras especies cadastradas': 'Other registered species',
    'Excluir pet?': 'Delete pet?',
    'Tem certeza que deseja excluir {{name}}? Essa ação não pode ser desfeita.': 'Are you sure you want to delete {{name}}? This action cannot be undone.',
    'este pet': 'this pet',
    'Excluir pet': 'Delete pet',
    'Pet excluído': 'Pet deleted',
    '{{name}} foi removido com sucesso.': '{{name}} was removed successfully.',
    'Não foi possível excluir este pet.': 'Could not delete this pet.',
    'Tutor': 'Owner',
    'Entrar': 'Sign in',
    'Login': 'Login',
    'Cadastro': 'Sign up',
    'Criar conta': 'Create account',
    'E-mail': 'Email',
    'Senha': 'Password',
    'Nome': 'Name',
    'Telefone': 'Phone',
    'CPF': 'CPF',
    'Data de nascimento': 'Birth date',
    'Esqueci minha senha': 'I forgot my password',
    'Não tem conta?': 'Do not have an account?',
    'Já tem conta?': 'Already have an account?',
    'Cadastrar': 'Register',
    'Continuar': 'Continue',
    'Confirmar': 'Confirm',
    'Salvar': 'Save',
    'Voltar': 'Back',
    'Avançar': 'Next',
    'Próximo': 'Next',
    'Concluir': 'Finish',
    'Buscar': 'Search',
    'Pesquisar': 'Search',
    'Limpar': 'Clear',
    'Filtrar': 'Filter',
    'Fechar': 'Close',
    'Editar': 'Edit',
    'Excluir': 'Delete',
    'Compartilhar': 'Share',
    'Contato': 'Contact',
    'Perfil': 'Profile',
    'Meu perfil': 'My profile',
    'Perfil atualizado!': 'Profile updated!',
    'Foto de perfil atualizada!': 'Profile photo updated!',
    'Permissão necessária': 'Permission required',
    'Permita acesso à galeria para alterar a foto.': 'Allow gallery access to change the photo.',
    'Não foi possível identificar seu usuário.': 'Could not identify your user.',
    'Não foi possível alterar a foto.': 'Could not change the photo.',
    'Preencha os campos': 'Fill in the fields',
    'Informe seu nome.': 'Enter your name.',
    'Telefone inválido': 'Invalid phone',
    'Informe telefones válidos com DDD.': 'Enter valid phone numbers with area code.',
    'Telefone repetido': 'Repeated phone',
    'Os telefones precisam ser diferentes.': 'Phone numbers must be different.',
    'Limite atingido': 'Limit reached',
    'Você pode cadastrar no máximo 2 telefones.': 'You can register up to 2 phone numbers.',
    'Não foi possível atualizar o perfil.': 'Could not update profile.',
    'Sucesso': 'Success',
    'Pet cadastrado!': 'Pet registered!',
    'Pet atualizado com sucesso!': 'Pet updated successfully!',
    'Foto do pet atualizada!': 'Pet photo updated!',
    'Não foi possível alterar a foto do pet.': 'Could not change pet photo.',
    'Permita acesso à galeria para alterar a foto do pet.': 'Allow gallery access to change the pet photo.',
    'Permissão para galeria é necessária.': 'Gallery permission is required.',
    'Preencha nome, espécie e foto.': 'Fill in name, species and photo.',
    'Erro no Servidor': 'Server Error',
    'Erro de Rede': 'Network Error',
    'Não foi possível conectar ao servidor. Verifique sua conexão.': 'Could not connect to the server. Check your connection.',
    'Nome do pet': 'Pet name',
    'Espécie': 'Species',
    'Raça': 'Breed',
    'Cor': 'Color',
    'Peso': 'Weight',
    'Sexo': 'Sex',
    'Macho': 'Male',
    'Fêmea': 'Female',
    'Cachorro': 'Dog',
    'Gato': 'Cat',
    'Vira-lata': 'Mixed breed',
    'SRD': 'Mixed breed',
    'Não informado': 'Not provided',
    'Não informada': 'Not provided',
    'Prontuários': 'Medical Records',
    'Prontuário eletrônico': 'Electronic medical record',
    'Histórico Clínico': 'Clinical History',
    'Nenhum prontuário encontrado.': 'No medical record found.',
    'Nenhum registro encontrado.': 'No record found.',
    'Registro clínico': 'Clinical record',
    'Arquivo anexado': 'Attached file',
    'Baixar arquivo': 'Download file',
    'Abrir arquivo': 'Open file',
    'Diário': 'Diary',
    'Diário Emocional': 'Emotional Diary',
    'Como foi o dia dele?': 'How was their day?',
    'Como foi o dia?': 'How was the day?',
    'Selecione um pet': 'Select a pet',
    'Digite um relato': 'Write a report',
    'Registro salvo!': 'Record saved!',
    'Humor': 'Mood',
    'Relato': 'Report',
    'Salvar registro': 'Save record',
    'Registros recentes': 'Recent records',
    'Agendamentos': 'Appointments',
    'Novo Agendamento': 'New Appointment',
    'Novo agendamento': 'New appointment',
    'Meus Agendamentos': 'My Appointments',
    'Consultas': 'Appointments',
    'Consulta Geral': 'General Appointment',
    'Veterinário': 'Veterinarian',
    'Veterinários': 'Veterinarians',
    'Serviço': 'Service',
    'Tipo de serviço': 'Service type',
    'Data': 'Date',
    'Horário': 'Time',
    'Horários': 'Times',
    'Observações': 'Notes',
    'Selecione pet, veterinário e tipo de serviço.': 'Select pet, veterinarian and service type.',
    'Selecione data e horário': 'Select date and time',
    'Escolha uma data e um horário disponíveis.': 'Choose an available date and time.',
    'Agendamento criado': 'Appointment created',
    'Escolha um horário disponível antes de agendar.': 'Choose an available time before scheduling.',
    'Buscando horários...': 'Loading times...',
    'Não foi possível carregar os horários.': 'Could not load times.',
    'Mensagens': 'Messages',
    'Conversas': 'Conversations',
    'Digite uma mensagem': 'Type a message',
    'Enviar': 'Send',
    'Nenhuma conversa encontrada.': 'No conversation found.',
    'CupidoPet': 'Cupidopet',
    'Pet ativo': 'Active pet',
    'Trocar pet': 'Change pet',
    'Amigos recentes': 'Recent friends',
    'Cheiradas': 'Sniffs',
    'Petchs': 'Petches',
    'Nenhum pet disponível no momento.': 'No pet available right now.',
    'Adotar': 'Adopt',
    'Anunciar pet': 'Post pet',
    'Quero adotar': 'I want to adopt',
    'Pet adicionado para adoção.': 'Pet added for adoption.',
    'Pet removido dos anúncios de adoção.': 'Pet removed from adoption posts.',
    'Não foi possível identificar este pet.': 'Could not identify this pet.',
    'Notificações Gerais': 'General Notifications',
    'Marcar todas como lidas': 'Mark all as read',
    'Nenhuma notificação encontrada.': 'No notification found.',
    'Código': 'Code',
    'Código enviado': 'Code sent',
    'Código incompleto': 'Incomplete code',
    'Código não encontrado': 'Code not found',
    'Digite os 5 números enviados para o seu e-mail.': 'Enter the 5 numbers sent to your email.',
    'E-mail obrigatório': 'Email required',
    'Informe seu e-mail para receber o código.': 'Enter your email to receive the code.',
    'E-mail inválido': 'Invalid email',
    'Digite um e-mail válido para continuar.': 'Enter a valid email to continue.',
    'E-mail não encontrado': 'Email not found',
    'Volte e informe o e-mail novamente.': 'Go back and enter the email again.',
    'Senha muito curta': 'Password too short',
    'A nova senha precisa ter pelo menos 8 caracteres.': 'The new password must have at least 8 characters.',
    'Senhas diferentes': 'Passwords do not match',
    'Confirme a senha exatamente igual a nova senha.': 'Confirm the password exactly like the new password.',
    'Senha alterada': 'Password changed',
    'Sua senha foi atualizada com sucesso.': 'Your password has been updated successfully.',
    'Bem vindo!': 'Welcome!',
    'Acesse sua conta': 'Access your account',
    'Preencha seus dados para continuar.': 'Fill in your details to continue.',
    'Acesse sua conta e gerencie seus pets com facilidade.': 'Access your account and manage your pets easily.',
    'Por favor, preencha todos os campos.': 'Please fill in all fields.',
    'Falha no login': 'Login failed',
    'Entrando...': 'Signing in...',
    'Ainda não tem uma conta?': 'Do not have an account yet?',
    'Sou Responsável': 'I am an Owner',
    'Crie sua conta': 'Create your account',
    'Complete os dados abaixo para começar a cuidar do seu pet.': 'Complete the information below to start caring for your pet.',
    'Verifique todos os campos e requisitos de senha.': 'Check all fields and password requirements.',
    'Sucesso!': 'Success!',
    'Cadastro realizado com sucesso!': 'Registration completed successfully!',
    'Erro ao cadastrar. Tente novamente.': 'Error registering. Please try again.',
    'NOME COMPLETO': 'FULL NAME',
    'EMAIL': 'EMAIL',
    'SENHA': 'PASSWORD',
    'CPF OU CNPJ': 'CPF OR CNPJ',
    'DATA DE NASCIMENTO': 'BIRTH DATE',
    'ENDEREÇO': 'ADDRESS',
    'TELEFONE (OPCIONAL)': 'PHONE (OPTIONAL)',
    'Seu nome completo': 'Your full name',
    'Ex: Rua das Flores, 123 - Bairro - Cidade': 'Ex: 123 Flower Street - District - City',
    'A senha deve conter:': 'The password must contain:',
    'Mínimo de 8 caracteres': 'At least 8 characters',
    'Uma letra maiúscula': 'One uppercase letter',
    'Um número': 'One number',
    'Um símbolo (@, $, %)': 'One symbol (@, $, %)',
    'Alterar senha': 'Change password',
    'Recuperar senha': 'Recover password',
    'Insira o código': 'Enter the code',
    'NOVA SENHA': 'NEW PASSWORD',
    'CONFIRMAR SENHA': 'CONFIRM PASSWORD',
    'Digite sua nova senha': 'Enter your new password',
    'Confirme sua nova senha': 'Confirm your new password',
    'Editar meu perfil': 'Edit my profile',
    'Mantenha seus dados e contatos atualizados': 'Keep your data and contacts updated',
    'FOTO DE PERFIL': 'PROFILE PHOTO',
    'Clique para alterar a imagem': 'Tap to change the image',
    'Dados Pessoais': 'Personal Data',
    'Nome Completo': 'Full Name',
    'CPF (não editável)': 'CPF (not editable)',
    'Endereço Residencial': 'Home Address',
    'Meus Telefones': 'My Phones',
    'NOVO CONTATO': 'NEW CONTACT',
    'CANCELAR': 'CANCEL',
    'SALVAR ALTERAÇÕES': 'SAVE CHANGES',
    'Carregando dados...': 'Loading data...',
    'Seu nome': 'Your name',
    'Seu endereço': 'Your address',
    'Número': 'Number',
    'PETS:': 'PETS:',
    'Historico de Prontuarios': 'Medical Record History',
    'Histórico de Prontuários': 'Medical Record History',
    'Carregando prontuarios...': 'Loading medical records...',
    'Nenhum registro disponivel': 'No records available',
    'Nenhum pet cadastrado.': 'No pet registered.',
    'Pet sem nome': 'Unnamed pet',
    'Selecione um Pet': 'Select a Pet',
    'Arquivo indisponível': 'File unavailable',
    'Este prontuário não possui arquivo anexado.': 'This medical record has no attached file.',
    'Permissão cancelada': 'Permission canceled',
    'Nenhuma pasta foi selecionada para salvar o arquivo.': 'No folder was selected to save the file.',
    'Arquivo salvo': 'File saved',
    'Arquivo salvo na pasta escolhida: {{name}}': 'File saved in the selected folder: {{name}}',
    'Arquivo salvo no armazenamento do app: {{name}}': 'File saved in the app storage: {{name}}',
    'Erro ao salvar arquivo': 'Error saving file',
    'Verifique sua conexão e tente novamente.': 'Check your connection and try again.',
    'Visualize o histórico de atendimento e evolução clínica dos pets. Os registros são gerados automaticamente pelo veterinário.': 'View your pets appointment history and clinical progress. Records are generated automatically by the veterinarian.',
    'Selecione um pet...': 'Select a pet...',
    'Selecione outro pet ou aguarde registros futuros.': 'Select another pet or wait for future records.',
    'Arquivo do prontuario': 'Medical record file',
    'Veterinário': 'Veterinarian',
    'Medicamentos': 'Medications',
    'Com arquivo': 'With file',
    'Sem arquivo': 'No file',
    'Ver detalhes': 'View details',
    'Baixar': 'Download',
    'Fale com nossos profissionais': 'Talk to our professionals',
    'Digite sua mensagem...': 'Type your message...',
    'Olá! Como posso ajudar você e seu pet hoje?': 'Hello! How can I help you and your pet today?',
    'Enviar mensagem': 'Send message',
    'Veterinário - Online': 'Veterinarian - Online',
    'Assistência Coração': 'Heart Support',
    'Suporte 24h': '24h Support',
    'Escolha uma data no mes ou navegue por ano.': 'Choose a date in the month or browse by year.',
    'Hoje': 'Today',
    'Informações do agendamento': 'Appointment information',
    'Paciente': 'Patient',
    'Status': 'Status',
    'Observações / Sintomas': 'Notes / Symptoms',
    'Nenhuma observação informada.': 'No notes provided.',
    'Confirmar exclusão': 'Confirm deletion',
    'Sim, excluir': 'Yes, delete',
    'feito': 'done',
    'Próximos compromissos e histórico': 'Upcoming appointments and history',
    'proximos': 'upcoming',
    'histórico': 'history',
    'historico': 'history',
    'Nenhum agendamento para esta data.': 'No appointment for this date.',
    'Nenhum agendamento futuro.': 'No upcoming appointment.',
    'Nenhum histórico encontrado.': 'No history found.',
    'Saúde e cuidados': 'Health and care',
    'Nascimento': 'Birth',
    'Vacinas': 'Vaccines',
    'Conheça o': 'Meet',
    'Personalidade': 'Personality',
    'Quero entrar em contato': 'I want to get in touch',
    'TUTOR RESPONSÁVEL': 'RESPONSIBLE OWNER',
    'IDADE': 'AGE',
    'PESO': 'WEIGHT',
    'CASTRADO': 'NEUTERED',
    'Erro interno': 'Internal error',
    'Usuário': 'User',
    'Você': 'You',
    'pet': 'pet',
    'Adicionar Pet': 'Add Pet',
    'Complete as informações para cadastrar seu pet.': 'Complete the information to register your pet.',
    'FOTO DO PET': 'PET PHOTO',
    'Clique para enviar uma foto': 'Tap to upload a photo',
    'NOME DO PET': 'PET NAME',
    'ESPÉCIE': 'SPECIES',
    'RAÇA': 'BREED',
    'DATA DE NASCIMENTO': 'BIRTH DATE',
    'SEXO': 'SEX',
    'PESO (KG)': 'WEIGHT (KG)',
    'DESCRIÇÃO E CUIDADOS': 'DESCRIPTION AND CARE',
    'Conte um pouco...': 'Tell us a little...',
    'Ex: Paçoca': 'Ex: Buddy',
    'Ex: Vira-lata': 'Ex: Mixed breed',
    'dd/mm/aaaa': 'mm/dd/yyyy',
    'Ex: 5.5': 'Ex: 5.5',
    'Salvar Pet': 'Save Pet',
    'Selecione': 'Select',
    'Selecione uma Espécie': 'Select a Species',
    'Selecione o Sexo': 'Select Sex',
    'Coelho': 'Rabbit',
    'Hamster': 'Hamster',
    'Pássaro': 'Bird',
    'Adoção Responsável': 'Responsible Adoption',
    'Gerencie seus anúncios e encontre novos amigos.': 'Manage your posts and find new friends.',
    'Anunciar pet meu': 'Post my pet',
    'Seus Pets em Anúncio': 'Your Posted Pets',
    'Você não tem nenhum pet anunciado no momento.': 'You do not have any posted pets right now.',
    'Removendo...': 'Removing...',
    'Tirar da adoção': 'Remove from adoption',
    'Pesquisar por nome ou raça...': 'Search by name or breed...',
    'Estado': 'State',
    'Cidade': 'City',
    'Pets esperando por um lar': 'Pets waiting for a home',
    'FEED GLOBAL': 'GLOBAL FEED',
    'Quero Adotar': 'I Want to Adopt',
    'Selecione um Estado': 'Select a State',
    'Selecione uma Cidade': 'Select a City',
    'Nenhum pet cadastrado': 'No pet registered',
    'Cadastre um pet antes de anunciá-lo para adoção.': 'Register a pet before posting it for adoption.',
    'Adicionar para adoção': 'Add for adoption',
    'Deseja anunciar {{name}} para adoção?': 'Do you want to post {{name}} for adoption?',
    'Anunciar': 'Post',
    'Não foi possível adicionar o pet para adoção.': 'Could not add the pet for adoption.',
    'Deseja remover {{name}} dos anúncios de adoção?': 'Do you want to remove {{name}} from adoption posts?',
    'Não foi possível remover o pet da adoção.': 'Could not remove the pet from adoption.',
    'Tenho interesse em adotar este pet.': 'I am interested in adopting this pet.',
    'Interesse enviado com sucesso!': 'Interest sent successfully!',
    'Não foi possível enviar interesse.': 'Could not send interest.',
    'Todos os seus pets já estão anunciados para adoção.': 'All your pets are already posted for adoption.',
    'Sem raça': 'No breed',
    'Adicionar': 'Add',
    'Olá! Vamos ser amigos?': 'Hi! Let us be friends?',
    'Nenhum pet encontrado.': 'No pet found.',
    'Seu Pet': 'Your Pet',
    'No Tinder': 'On Tinder',
    'Nenhum amigo recente.': 'No recent friend.',
    'Seus Pets': 'Your Pets',
    'Escolha o Dia': 'Choose the Day',
    'Nenhuma data disponível para este veterinário no momento.': 'No date available for this veterinarian right now.',
    'Tente selecionar outro veterinário.': 'Try selecting another veterinarian.',
    'Horários Disponíveis': 'Available Times',
    'Nenhum horário disponível para esta data.': 'No time available for this date.',
    'Erro ao carregar dados.': 'Error loading data.',
    'Erro ao buscar datas disponíveis.': 'Error loading available dates.',
    'Erro ao buscar horários.': 'Error loading times.',
    'ID de pet ou vaga não encontrado.': 'Pet or slot ID not found.',
    'Erro ao criar agendamento.': 'Error creating appointment.',
    'Carregando...': 'Loading...',
    'Escolha o veterinário, dia e horário': 'Choose the veterinarian, day and time',
    'Qual Pet?': 'Which Pet?',
    'Selecione seu pet...': 'Select your pet...',
    'Escolha o médico...': 'Choose the doctor...',
    'Data Selecionada': 'Selected Date',
    'Trocar': 'Change',
    'Selecione o serviço...': 'Select the service...',
    'Descreva brevemente...': 'Describe briefly...',
    'Agendar Agora': 'Schedule Now',
    'Selecione um Veterinário': 'Select a Veterinarian',
    'Selecione um Serviço': 'Select a Service',
    'Vacinação': 'Vaccination',
    'Check-up': 'Check-up',
    'Retorno': 'Follow-up',
    'Escolha uma data no mês ou navegue por ano.': 'Choose a date in the month or browse by year.',
    '- ano': '- year',
    '+ ano': '+ year',
    'Informações do agendamento': 'Appointment information',
    'Paciente': 'Patient',
    'Status': 'Status',
    'Observações / Sintomas': 'Notes / Symptoms',
    'Nenhuma observação informada.': 'No notes provided.',
    'Confirmar exclusão': 'Confirm deletion',
    'Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.': 'Are you sure you want to delete this appointment? This action cannot be undone.',
    'Sim, excluir': 'Yes, delete',
    'feito': 'done',
    'Vet': 'Vet',
    'Aguardando confirmação do veterinário': 'Waiting for veterinarian confirmation',
    'Clínica Veterinária': 'Veterinary Clinic',
    'Lembre-se de trazer a carteirinha.': 'Remember to bring the vaccination card.',
    'próximos': 'upcoming',
    'histórico': 'history',
    'Dia selecionado': 'Selected day',
    'Toque em um compromisso para ver detalhes.': 'Tap an appointment to see details.',
    'Nenhum compromisso neste dia.': 'No appointment on this day.',
    'Próximos': 'Upcoming',
    'Consultas e vacinas em aberto.': 'Open appointments and vaccines.',
    'Nenhum compromisso futuro.': 'No upcoming appointment.',
    'Histórico': 'History',
    'Consultas e vacinas anteriores.': 'Past appointments and vaccines.',
    'Nenhum histórico encontrado.': 'No history found.',
    'Humor emocional': 'Emotional Mood',
    'Tendência dos últimos dias': 'Trend over the last days',
    'Triste': 'Sad',
    'Neutro': 'Neutral',
    'Feliz': 'Happy',
    'Nenhum registro de humor ainda': 'No mood record yet',
    'Comece a registrar o humor do {{name}}': 'Start recording {{name}} mood',
    'ESCOLHER PET': 'CHOOSE PET',
    'RELATO DO DIA': 'DAILY REPORT',
    'SALVAR REGISTRO': 'SAVE RECORD',
    'SAIR DA COMPARAÇÃO': 'EXIT COMPARISON',
    'COMPARAR PERÍODOS': 'COMPARE PERIODS',
    'Comparando Períodos': 'Comparing Periods',
    'ESTA SEMANA': 'THIS WEEK',
    'Últimos 7 dias': 'Last 7 days',
    'SEMANA PASSADA': 'LAST WEEK',
    '7-14 dias atrás': '7-14 days ago',
    'Registros recentes': 'Recent records',
    'Nenhum registro ainda.': 'No record yet.',
    'Carregando informações...': 'Loading information...',
    'TUTOR RESPONSÁVEL': 'RESPONSIBLE OWNER',
    'IDADE': 'AGE',
    'PESO': 'WEIGHT',
    'CASTRADO': 'NEUTERED',
    'Nascimento': 'Birth',
    'Vacinas': 'Vaccines',
    'Saúde e cuidados': 'Health and care',
    'Conheça o {{name}}': 'Meet {{name}}',
    'Personalidade': 'Personality',
    'Quero entrar em contato': 'I want to get in touch',
    'Enviando mensagem para entrar em contato com o tutor...': 'Sending a message to contact the owner...',
    'Adotando...': 'Adopting...',
    'Adoção concluída': 'Adoption completed',
    '{{name}} agora está em Meus pets.': '{{name}} is now in My pets.',
    'Não foi possível concluir a adoção.': 'Could not complete the adoption.',
    'Compartilhando perfil do {{name}}': 'Sharing {{name}} profile',
    'Nenhuma vacina informada': 'No vaccine provided',
    'O tutor ainda não escreveu uma descrição detalhada para este pet.': 'The owner has not written a detailed description for this pet yet.',
    'Nenhuma característica informada.': 'No trait provided.',
    'Tutor não informado': 'Owner not provided',
    'Todas as Notificações': 'All Notifications',
    'Adoção': 'Adoption',
    'Notificação': 'Notification',
    'Você tem uma nova notificação.': 'You have a new notification.',
    'Não informado': 'Not provided',
    'Não informada': 'Not provided',
    'Macho': 'Male',
    'Fêmea': 'Female',
    '{{count}} não lida{{plural}}': '{{count}} unread',
    'Tudo em dia': 'All caught up',
    'Mostrar menos': 'Show less',
    'Ver tudo': 'See all',
    'Nenhuma notificação disponível.': 'No notification available.',
    'Sem detalhe': 'No detail',
    'Não foi possível carregar os dados do perfil': 'Could not load profile data',
    'Sair da conta': 'Log out',
    'Tem certeza que deseja sair da conta?': 'Are you sure you want to log out?',
    'Nome não encontrado': 'Name not found',
    'Endereço não informado': 'Address not provided',
    'Responsável': 'Owner',
    'Membro Ativo': 'Active Member',
    'EDITAR PERFIL': 'EDIT PROFILE',
    'Documento CPF': 'CPF Document',
    'Endereço registrado': 'Registered address',
    'VER TODOS OS PETS': 'SEE ALL PETS',
    'Privacidade e Acesso': 'Privacy and Access',
    'ALTERAR SENHA': 'CHANGE PASSWORD',
    'SAIR DA CONTA': 'LOG OUT',
    'Erro ao carregar dados para edição.': 'Error loading data for editing.',
    'Carregando dados...': 'Loading data...',
    'Mantenha seus dados e contatos atualizados': 'Keep your data and contacts updated',
    'Alterar foto de perfil': 'Change profile photo',
    'FOTO DE PERFIL': 'PROFILE PHOTO',
    'Clique para alterar a imagem': 'Tap to change the image',
    'CPF (não editável)': 'CPF (not editable)',
    'Endereço Residencial': 'Home Address',
    'Seu nome': 'Your name',
    'Seu endereço': 'Your address',
    'NOVO CONTATO': 'NEW CONTACT',
    '{{count}}/2 telefones cadastrados': '{{count}}/2 phones registered',
    'Número': 'Number',
    'CANCELAR': 'CANCEL',
    'SALVAR ALTERAÇÕES': 'SAVE CHANGES',
    'Selecionar': 'Select',
    'Fechar calendário': 'Close calendar',
    'Ano anterior': 'Previous year',
    'Mês anterior': 'Previous month',
    'Ir para hoje': 'Go to today',
    'Próximo mês': 'Next month',
    'Próximo ano': 'Next year',
    'Selecionar dia {{day}}': 'Select day {{day}}',
    'Abrir calendário completo': 'Open full calendar',
    'Semana anterior': 'Previous week',
    'Próxima semana': 'Next week',
    'Selecionar {{day}} {{number}}': 'Select {{day}} {{number}}',
    'Nenhum agendamento para esta semana.': 'No appointment for this week.',
    'Usuário não autenticado.': 'User not authenticated.',
    'Veterinário': 'Veterinarian',
    'Confirmado': 'Confirmed',
    'Pendente': 'Pending',
    'Cancelado': 'Canceled',
    'Concluido': 'Completed',
    'Concluído': 'Completed',
    'Agendada': 'Scheduled',
    'Consulta': 'Appointment',
    'Consultas': 'Appointments',
    'Vacina': 'Vaccine',
    'Medicamento': 'Medication',
    'Sim': 'Yes',
    'Não': 'No',
  },
};

let currentLanguage = 'pt';
let translationPatchInstalled = false;

function translateRawText(value) {
  if (currentLanguage !== 'en' || typeof value !== 'string') return value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return value;

  const translated = translations.en[trimmedValue];
  if (!translated) return value;

  return value.replace(trimmedValue, translated);
}

function translateNode(node) {
  if (typeof node === 'string') return translateRawText(node);
  if (Array.isArray(node)) return node.map(translateNode);
  return node;
}

function translateProps(type, props) {
  if (!props) return props;

  const shouldTranslateTextChildren = type === Text;
  const shouldTranslateTextInputProps = type === TextInput;

  if (!shouldTranslateTextChildren && !shouldTranslateTextInputProps) {
    return props;
  }

  const nextProps = { ...props };

  if (shouldTranslateTextChildren && 'children' in nextProps) {
    nextProps.children = translateNode(nextProps.children);
  }

  if (shouldTranslateTextInputProps) {
    if (typeof nextProps.placeholder === 'string') {
      nextProps.placeholder = translateRawText(nextProps.placeholder);
    }
    if (typeof nextProps.accessibilityLabel === 'string') {
      nextProps.accessibilityLabel = translateRawText(nextProps.accessibilityLabel);
    }
  }

  return nextProps;
}

function installGlobalTranslationPatch() {
  if (translationPatchInstalled) return;

  const originalCreateElement = React.createElement;
  const originalAlert = Alert.alert;
  let jsxRuntime = null;

  try {
    jsxRuntime = require('react/jsx-runtime');
  } catch {
    jsxRuntime = null;
  }

  React.createElement = function patchedCreateElement(type, props, ...children) {
    const translatedProps = translateProps(type, props);
    const translatedChildren = type === Text ? children.map(translateNode) : children;
    return originalCreateElement(type, translatedProps, ...translatedChildren);
  };

  if (jsxRuntime?.jsx) {
    const originalJsx = jsxRuntime.jsx;
    jsxRuntime.jsx = function patchedJsx(type, props, key) {
      return originalJsx(type, translateProps(type, props), key);
    };
  }

  if (jsxRuntime?.jsxs) {
    const originalJsxs = jsxRuntime.jsxs;
    jsxRuntime.jsxs = function patchedJsxs(type, props, key) {
      return originalJsxs(type, translateProps(type, props), key);
    };
  }

  Alert.alert = function translatedAlert(title, message, buttons, options) {
    const translatedButtons = Array.isArray(buttons)
      ? buttons.map((button) => ({
          ...button,
          text: typeof button?.text === 'string' ? translateRawText(button.text) : button?.text,
        }))
      : buttons;

    return originalAlert(
      translateRawText(title),
      translateRawText(message),
      translatedButtons,
      options
    );
  };

  translationPatchInstalled = true;
}

const LanguageContext = createContext({
  language: 'pt',
  setLanguage: () => {},
  t: (key, params) => key,
});

function interpolate(text, params = {}) {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.split(`{{${key}}}`).join(String(value)),
    text
  );
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('pt');

  installGlobalTranslationPatch();

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((storedLanguage) => {
      if (storedLanguage === 'en' || storedLanguage === 'pt') {
        currentLanguage = storedLanguage;
        setLanguageState(storedLanguage);
      }
    });
  }, []);

  const setLanguage = async (nextLanguage) => {
    const normalizedLanguage = nextLanguage === 'en' ? 'en' : 'pt';
    currentLanguage = normalizedLanguage;
    setLanguageState(normalizedLanguage);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  };

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key, params) => {
      const translated = translations[language]?.[key] || key;
      return interpolate(translated, params);
    },
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
