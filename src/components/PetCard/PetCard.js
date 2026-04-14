import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { styles } from './styles';

export default function PetCard({ pet, onPress, onMenuPress, actionLabel, onActionPress, cardStyle }) {
  return (
    <TouchableOpacity style={[styles.card, cardStyle]} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: pet.foto || pet.imagem }} style={styles.petImage} />
        {onMenuPress ? (
          <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress}>
            <Text style={styles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.nome}</Text>
        {pet.info ? <Text style={styles.petBreed}>{pet.info}</Text> : null}
        {pet.tipo || pet.cor ? (
          <Text style={styles.petBreed}>{pet.tipo || ''}{pet.tipo && pet.cor ? ' • ' : ''}{pet.cor || ''}</Text>
        ) : null}
        {pet.idade ? (
          <View style={styles.ageBadge}>
            <Text style={styles.ageText}>{pet.idade}</Text>
          </View>
        ) : null}
        {pet.tutor ? (
          <Text style={styles.tutorText}>Tutor: {pet.tutor}</Text>
        ) : null}
      </View>
      {actionLabel ? (
        <TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}
