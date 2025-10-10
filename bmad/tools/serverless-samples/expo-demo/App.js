import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [apiBase, setApiBase] = useState('http://localhost:3000');
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [variantsRaw, setVariantsRaw] = useState('');
  const [tone, setTone] = useState('professional');

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setRecording(recording);
    } catch (err) { console.error('startRecording', err); Alert.alert('Recording error'); }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      Alert.alert('Recorded', `Saved at ${uri}`);
      // Upload and transcribe sample flow: request signed URL
      const filename = uri.split('/').pop();
      const stat = await FileSystem.getInfoAsync(uri);
      const payload = { filename, contentType: 'audio/webm', length: stat.size };
      const signed = await fetch(apiBase + '/api/signed-upload', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const j = await signed.json();
      // Upload file with PUT
      const fileData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const put = await fetch(j.uploadUrl, { method: 'PUT', headers: {'Content-Type':'audio/webm'}, body: Buffer.from(fileData, 'base64') });
      if (!put.ok) throw new Error('upload failed');
      // Start transcribe
      const tResp = await fetch(apiBase + '/api/transcribe/start', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ objectKey: j.objectKey, entryId: `expo-${Date.now()}`, anonymize: false, language: 'en' }) });
      const tJson = await tResp.json();
      Alert.alert('Transcription started', JSON.stringify(tJson));
    } catch (err) { console.error('stopRecording', err); Alert.alert('Error', String(err)); }
  };

  const generate = async () => {
    try {
      const resp = await fetch(apiBase + '/api/generate-post', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ sanitizedText: transcript, tone, maxChars: 400, variants: 2 }) });
      const j = await resp.json();
      setVariantsRaw(JSON.stringify(j, null, 2));
      Alert.alert('Generated');
    } catch (err) { console.error(err); Alert.alert('Generate failed'); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Journaling AI Demo (Expo)</Text>
      <Text>API Base URL</Text>
      <TextInput style={styles.input} value={apiBase} onChangeText={setApiBase} />

      <Text style={{ marginTop: 12 }}>Transcript</Text>
      <TextInput style={[styles.input, { height: 120 }]} multiline value={transcript} onChangeText={setTranscript} />

      <View style={{ marginTop: 12 }}>
        <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRecording : startRecording} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button title="Generate Post Variants" onPress={generate} />
      </View>

      <Text style={{ marginTop: 12 }}>Variants / Raw Response</Text>
      <Text style={{ fontFamily: 'monospace' }}>{variantsRaw}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginTop: 6 }
});
