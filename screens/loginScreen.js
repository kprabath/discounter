import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import AuthContext from '../components/AuthContext';
import {BASE_URL} from '../components/config';

const Input = (props) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={props.placeHolder}
        value={props.value}
        onChangeText={props.change}
        style={styles.input}
      />
      {props.hasError && (
        <Text
          style={{
            marginLeft: 10,
            color: 'red',
            fontStyle: 'italic',
            fontSize: 12,
          }}>
          {props.errorDescription}
        </Text>
      )}
    </View>
  );
};

export default class LoginScreen extends React.Component {
  state = {
    name: '',
    psw: '',
    hasNameError: false,
    haspswError: false,
    hasError: false,
    errorDescription: '',
  };

  storeToken = (token, callback) => {
    AsyncStorage.setItem('userToken', token).then((val) => {
      callback();
    });
  };
  signIn = (callback) => {
    console.log('============');
    console.log(this.state.name, this.state.psw);
    fetch(BASE_URL + '/user/api-token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'password',
        client_id: 2,
        client_secret: 'sHxsvny4WVNrAlTyMpOAlyIaMsVF669DMnjdXJ5q',
        username: 'bcflooradmin@pointgreysolutions.com',
        password: this.state.psw,
      }),
    }).then((response) =>
      response
        .json()
        .then((data) => {
          console.log('DATA => ', data);
          if (data['status_code'])
            if (data['status_code'] != 200 || data['status_code'] != 200) {
              this.setState({
                hasError:true,
              });
            }
          if (data['access_token'])
            this.storeToken(data['access_token'], callback);
        })
        .catch((err) => {
          console.log(err);
        }),
    );
  };

  validate = (callback) => {
    console.log(this.state.name, this.state.psw);
    let objectTobeMerged = {
      hasNameError: false,
      haspswError: false,
    };
    if (!this.state.name) {
      objectTobeMerged = {
        ...objectTobeMerged,
        hasNameError: true,
      };
    }
    if (!this.state.psw) {
      objectTobeMerged = {
        ...objectTobeMerged,
        haspswError: true,
      };
    }
    console.log(objectTobeMerged);
    this.setState({
      ...objectTobeMerged,
    });
    if (objectTobeMerged.hasNameError || objectTobeMerged.haspswError) {
      return;
    }
    this.signIn(callback);
  };

  closure = (keyName) => {
    return (text) => {
      console.log('text', text);
      this.setState({
        [keyName]: text,
      });
    };
  };

  render() {
    return (
      <AuthContext.Consumer>
        {({login}) => (
          <SafeAreaView style={{flex: 1}}>
            <ScrollView
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="always">
              <View
                style={{
                  display: 'flex',
                  //  backgroundColor:'red' ,
                  padding: 20,
                  width: '100%',
                }}>
                <Input
                  placeHolder={'Enter Email'}
                  change={this.closure('name')}
                  hasError={this.state.hasNameError}
                  errorDescription="This field is required"
                />
                <Input
                  placeHolder={'Enter Password'}
                  change={this.closure('psw')}
                  hasError={this.state.haspswError}
                  errorDescription="This field is required"
                />
                <TouchableOpacity
                  onPress={() => this.validate(login)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 15,
                    borderRadius: 30,
                    backgroundColor: 'purple',
                  }}>
                  <Text>LOGIN</Text>
                </TouchableOpacity>
                {this.state.hasError && (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop:20
                    }}>
                    <Icon name="warning" size={20} color="red" />
                    <Text style={{color: 'red', marginLeft: 10}}>
                      Please check your password or email
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </AuthContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    display: 'flex',

    flexDirection: 'column',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    fontSize: 15,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});
