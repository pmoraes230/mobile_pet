import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 12,

    // --- AJUSTADO ---
    // Reduzi de 340 para 290 para o card ficar menor
    height: 290, 
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    // Reduzi um pouco a proporção da imagem para sobrar mais espaço para o texto
    aspectRatio: 16 / 9, 
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  menuBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
    color: '#323232',
  },
  petInfo: {
    // Reduzi o padding de 18 para 12 para o texto não ficar tão "espalhado"
    padding: 12, 
    flex: 1, 
  },
  petName: {
    fontSize: 16, // Reduzi um pouco a fonte
    fontWeight: '700',
    color: '#0D214F',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  ageBadge: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  ageText: {
    fontSize: 11,
    color: '#4B5563',
  },
  tutorText: {
    fontSize: 12,
    color: '#374151',
  },
  actionButton: {
    // Reduzi as margens e o padding do botão
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#9127E1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 'auto', 
  },
  actionLabel: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
});