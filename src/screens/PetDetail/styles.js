import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  backText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },

  favoriteButton: {
    padding: 8,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // PET IMAGE
  imageContainer: {
    position: 'relative',
    height: height * 0.45,
    width: '100%',
    backgroundColor: '#FFF',
  },

  petImage: {
    width: '100%',
    height: '100%',
  },

  genderBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  genderText: {
    fontSize: 24,
    color: 'white',
  },

  // INFO CARDS
  infoCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: '#FFF',
  },

  infoCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  // SECTIONS
  section: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#FFF',
    marginTop: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionBorder: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A855F7',
    marginRight: 10,
  },

  emojiIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },

  sectionDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
  },

  // TUTOR CARD
  tutorCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#F5F0FF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8D5F7',
  },

  tutorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  tutorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tutorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  tutorInfo: {
    flex: 1,
  },

  tutorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },

  messageButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#A855F7',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  messageButtonText: {
    fontSize: 20,
  },

  // ACTION BUTTONS
  actionButtons: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },

  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A0A7BA',
    marginLeft: 8,
  },

  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A855F7',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 10,
    elevation: 4,
    shadowColor: '#A855F7',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  contactButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
