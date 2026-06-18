import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { styles } from './styles';
import { useAppTheme } from '../../theme/ThemeContext';

export default function PetCard({
  pet,
  onPress,
  onMenuPress,
  actionLabel,
  onActionPress,
  cardStyle,
}) {
  const { isDarkMode } = useAppTheme();
  const rawImage = pet?.foto || pet?.imagem;
  const menuIconColor = isDarkMode ? '#F5F7FF' : '#323232';

  const imageUri = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${rawImage}`
    : null;

  return (
    <TouchableOpacity
      style={[styles.card, cardStyle]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require('../../assets/default-pet.png')
          }
          style={styles.petImage}
        />

        {onMenuPress ? (
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={(event) => {
              event?.stopPropagation?.();
              onMenuPress(event);
            }}
          >
            <Text style={[styles.menuIcon, { color: menuIconColor }]}>⋮</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* 
          ADICIONADO flex: 1 aqui para garantir que esta view ocupe todo o espaço 
          disponível e empurre o botão de ação para o final do card 
      */}
      <View style={[styles.petInfo, { flex: 1 }]}>
        <Text style={styles.petName} numberOfLines={1} ellipsizeMode="tail">
          {pet.nome}
        </Text>

        {pet.info ? (
          <Text style={styles.petBreed} numberOfLines={1}>
            {pet.info}
          </Text>
        ) : null}

        {(pet.tipo || pet.cor) ? (
          <Text style={styles.petBreed} numberOfLines={1}>
            {pet.tipo || ''}
            {pet.tipo && pet.cor ? ' • ' : ''}
            {pet.cor || ''}
          </Text>
        ) : null}

        {pet.idade ? (
          <View style={styles.ageBadge}>
            <Text style={styles.ageText}>{pet.idade}</Text>
          </View>
        ) : null}

        {pet.tutor ? (
          <Text style={styles.tutorText} numberOfLines={1}>
            Tutor: {pet.tutor}
          </Text>
        ) : null}
      </View>

      {actionLabel ? (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onActionPress}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}