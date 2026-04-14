import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  container: {
    flex: 1,
  },
  // Header com botão de voltar
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  voltarBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  voltarIcon: {
    fontSize: 22,
    color: '#0D214F',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  subtitle: {
    fontSize: 15,
    color: '#7E869E',
    marginTop: 4,
  },
  // BOTÃO ADICIONAR (IGUAL AO PRINT)
  btnAddPet: {
    backgroundColor: '#E8D5F7', // Lilás clarinho do seu print
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  btnAddText: {
    color: '#9127E1', // Roxo escuro
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // CARD DO PET
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    padding: 10, // Espaço interno para a imagem não colar na borda se quiser
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
    paddingBottom: 25,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  menuBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  // INFO DO PET
  petInfo: {
    alignItems: 'center',
    marginTop: 15,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  petBreed: {
    fontSize: 12,
    color: '#A0A7BA',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 1,
  },
  ageBadge: {
    backgroundColor: '#F5E6FF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  ageText: {
    color: '#9127E1',
    fontSize: 12,
    fontWeight: 'bold',
  },
});