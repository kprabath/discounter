import React from 'react';
import { Platform, Text, View, TouchableOpacity, StyleSheet, FlatList , SafeAreaView} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {BASE_URL} from '../components/config';
import Modal from '../components/Modal';

const Circle = (props) => {
  return (
    <View style = {{display:'flex' ,alignItems:'center'}}>
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 50,
        borderRadius: 50,
        backgroundColor: props.color,
      }}>
      <Text>{props.text}</Text>
    </View>
    <Text style = {{fontWeight:'bold'}}>{props.title}</Text>
    </View>  
  );
};
const Card = (props) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'white',
        // padding: 20,
        marginBottom: 10,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
      }}
      onPress={props.cardClick}>
      <View style={{display: 'flex', flex: 0.85, padding: 20}}>
        <Text style={{color: 'green', marginBottom: 10, fontWeight: 'bold'}}>
          {props.description}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',

            justifyContent: 'space-around',
          }}>
          <Circle title = "Percentage" text={`${props.percentage}%`} color="brown" />
          <Circle title = "Services" text={props.numberOfServices} color="purple" />
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          flex: 0.15,
          backgroundColor: '#87CEFA',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress = {()=>props.edit(props.index)}
          style={{
            padding: 10,
            borderRadius: 50,
            justifyContent: 'center',
            backgroundColor: 'white',
            // bottom:'50%
          }}>
          <Icon name="edit" size={15} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default class HomeScreen extends React.Component {
  state = {
    selectedId: '',
    discountList: [],
    isloading: true,
    token: '',
    isModalVisible: false,
  };

  setSelectedId = (ID) => {
    this.setState({
      selectedId: ID,
      isModalVisible: true,
    });
  };

  navigate = (index) => {
    this.props.navigation.navigate('Create', {
      action: 'update',
      payload: {discount: this.state.discountList[index] ,token:this.state.token ,  fetch:this.fetchDiscounts},
    });
  };

  toggleModal = () => {
    this.setState((prevState) => {
      return {
        ...this.state,
        isModalVisible: !prevState.isModalVisible,
      };
    });
  };
  fetchDiscounts = (token = this.state.token) => {
    fetch(BASE_URL + '/discounts/index?search=&orderby=created_at&order=desc', {
      method: 'GET',
      headers: {
        Accept: 'appliacation/json',
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('DATA IS', data);
        this.setState({discountList: data.data, token: token});
      });
  };
  componentDidMount() {
    AsyncStorage.getItem('userToken').then((token) => {
      this.fetchDiscounts(token);
    });
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
       <View style = {{  flex:1, flexDirection: 'column', padding:20 ,backgroundColor:'lightgrey'}}>
        <Text style={{marginBottom: 10, fontSize: 20}}>Discount List</Text>
        <FlatList
          keyExtractor={(item) => item.id}
          data={this.state.discountList}
          renderItem={({item, index}) => {
            return (
              <Card
                index = {index}
                edit = {this.navigate}
                cardClick={() => this.setSelectedId(item.id)}
                description={item.description}
                percentage={item.percentage}
                numberOfServices={item['no_of_services']}
              />
            );
          }}
        />
        <Modal
          navigation={this.props.navigation}
          token={this.state.token}
          visible={this.state.isModalVisible}
          ID={this.state.selectedId}
          toggleModal={this.toggleModal}
        />

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('Create', {
              action: 'create',
              payload: {token:this.state.token , fetch:this.fetchDiscounts},
            })
          }
          style={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#87CEFA',
            borderRadius: 50,
          }}>
          <Icon name="add" size={20} color={'white'} />
        </TouchableOpacity>
        </View> 
      </SafeAreaView>
    );
  }
}
