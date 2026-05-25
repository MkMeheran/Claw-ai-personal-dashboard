import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './src/lib/supabase';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();

function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const performOAuth = async () => {
    setLoading(true);
    const redirectUrl = Linking.createURL('/');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (res.type === 'success') {
          const { url } = res;
          
          // Extract Google Drive provider_token from the URL hash
          const match = url.match(/provider_token=([^&]+)/);
          if (match && match[1]) {
            await AsyncStorage.setItem('google_provider_token', match[1]);
          }
          
          await supabase.auth.getSessionFromUrl(url);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEXUS</Text>
      <Text style={styles.subtitle}>Mobile Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Sign in with Google" onPress={performOAuth} />
      )}
    </View>
  );
}



function DashboardScreen() {
  const [providerToken, setProviderToken] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('google_provider_token').then(t => {
      if (t) setProviderToken(t);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const webAppUrl = process.env.EXPO_PUBLIC_WEB_URL || 'http://10.0.2.2:3000';

  const injectedJs = providerToken 
    ? `window.localStorage.setItem('google_provider_token', '${providerToken}'); true;` 
    : 'true;';

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>NEXUS</Text>
        <Button title="Sign Out" onPress={handleLogout} color="#1c1917" />
      </View>
      <WebView 
        source={{ uri: webAppUrl }} 
        style={{ flex: 1 }}
        originWhitelist={['*']}
        allowsInlineMediaPlayback={true}
        injectedJavaScript={injectedJs}
      />
    </View>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && session.user ? (
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f4', // stone-100
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1c1917', // stone-900
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#57534e', // stone-600
    marginBottom: 32,
  },
  headerBar: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fbbf24', // amber-400
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#1c1917',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1c1917',
    letterSpacing: 2,
  }
});
