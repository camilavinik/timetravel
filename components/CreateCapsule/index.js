import { useState } from 'react'
import { Text, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native'
import { Container } from '../common'
import { colors, typography } from '../../lib/theme'
import IconChooser, { suggestedIcons } from './IconChooser'
import ColorChooser, { suggestedColors } from './ColorChooser'
import { Input, Button } from '../common'
import { randomUUID } from 'expo-crypto'
import { Ionicons } from '@expo/vector-icons'

export default function CreateCapsule() {
  const [color, setColor] = useState(suggestedColors[0])
  const [icon, setIcon] = useState(suggestedIcons[0])
  const [name, setName] = useState('')
  const [messages, setMessages] = useState([])

  const addMessage = () => {
    setMessages([...messages, { id: randomUUID(), message: '' }])
  }

  const updateMessage = (id, message) => {
    setMessages(messages.map(m => m.id === id ? { ...m, message } : m))
  }

  const deleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id))
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Capsule Design */}
        <Container>
          <Text style={typography.subtitle}>Capsule Design</Text>
          <Text style={styles.description}>Choose an icon, color, and name for your capsule.</Text>
          <View style={styles.column}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
              <Text style={typography.subtitle}>{icon}</Text>
            </View>
            <IconChooser icon={icon} setIcon={setIcon} />
            <ColorChooser color={color} setColor={setColor} />
            <View style={styles.gap10}>
              <Text style={typography.subtitle}>Capsule Name</Text>
              <Input value={name} onChangeText={setName} />
            </View>
          </View>
        </Container>

        {/* Your Messages */}
        <Container>
          <View style={styles.spaceBetween}>
            <View>
              <Text style={typography.subtitle}>Your Messages</Text>
              <Text style={styles.description}>Add one or more messages.</Text>
            </View>
            <Button title={<Ionicons name="add-outline" size={24} />} onPress={addMessage} size="small" />
          </View>
          {messages.length > 0 && <View style={styles.column}>
            {messages.map((message, index) => (
              <View key={message.id} style={styles.relative}>
                <Input label={`Message ${index + 1}`} placeholder="Write your message here..." multiline value={message.message} onChangeText={text => updateMessage(message.id, text)} />
                <TouchableOpacity onPress={() => deleteMessage(message.id)} style={styles.messageDeleteIcon}>
                  <Ionicons name="close-circle-outline" size={20} color={colors.gray} />
                </TouchableOpacity>
              </View>
            ))}
          </View>}
        </Container>

        {/* Add Media */}
        <Container>
          <Text style={typography.subtitle}>Add Media</Text>
          <Text style={styles.description}>Upload photos, videos, or both.</Text>
        </Container>

        {/* Unlock Date */}
        <Container>
          <Text style={typography.subtitle}>Unlock Date</Text>
          <Text style={styles.description}>When should this capsule open?</Text>
        </Container>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: 'column',
    gap: 20,
  },
  column: {
    gap: 20,
    paddingTop: 10,
  },
  gap10: {
    gap: 10,
  },
  relative: {
    position: 'relative',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  description: {
    ...typography.description,
    color: colors.gray,
  },
  iconContainer: {
    marginHorizontal: 'auto',
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  messageDeleteIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
})