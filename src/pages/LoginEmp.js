import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Image, TextInput, Text, TouchableOpacity, Platform, Alert } from 'react-native'
import Logo from '../assets/logoGet.png'
import api from '../services/api'
import AsyncStorage from '@react-native-community/async-storage'

export default function Login({ navigation }) {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('userEmp').then(user => {
            if (user) {
                navigation.navigate('Vagas', { user: user })
            }
        })
    }, [])

    async function erroLogin() {
        Alert.alert(
            'Algo deu Errado', 
            'Revise seu Usuario e Senha',
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

    async function handleLogin() {

        const response = await api.post('/emps', {
            username: user,
            senha: password,
            type: true
        });
        if (response) {
            let {message} = response.data
            if (message) {
                erroLogin()
                setUser('')
                setPassword('')
            } else {
                const { _id, user: username } = response.data;
                await AsyncStorage.setItem('userEmp', _id)
                await AsyncStorage.setItem('usernameEmp', username)
                await AsyncStorage.setItem('senhaEmp', password)
                navigation.navigate('Vagas', { user: _id })
            }
        } else {
            navigation.navigate()
        }

    }

    return (

        <KeyboardAvoidingView style={styles.container} enabled={Platform.OS == 'ios'}>
            <Image source={Logo} />
            <TextInput value={user} onChangeText={setUser} placeholder="Digite o nome da Empresa" autoCapitalize='none' autoCorrect={false} placeholderTextColor="#999" style={styles.input} />
            <TextInput value={password} secureTextEntry={true} onChangeText={setPassword} placeholder="Digite sua senha" autoCapitalize='none' autoCorrect={false} placeholderTextColor="#999" style={styles.input} />
            <TouchableOpacity onPress={handleLogin} style={styles.button}><Text style={styles.buttonText}>Entrar</Text></TouchableOpacity>
        </KeyboardAvoidingView>

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    input: {
        height: 46,
        marginTop: 5,
        alignSelf: 'stretch',
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 4,
        paddingHorizontal: 15,
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: "#df4723",
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    TextInput: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    buttonText: {
        color: '#fff'
    }

});