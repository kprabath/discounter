import React from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {BASE_URL} from '../components/config';

const Input = (props) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={{marginBottom: 10, fontWeight: 'bold', marginLeft: 10}}>
        {props.title}
      </Text>
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

const Loader = (props) => {
  return (
    <Modal visible={props.loading} transparent={true}>
      <View
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255 , 255 , 255 , 0.5)',
        }}>
        <ActivityIndicator size={30} color="red" />
      </View>
    </Modal>
  );
};

export default class CreateDiscount extends React.Component {
  update = () => {
    fetch(BASE_URL + `/discounts/${this.state.id}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: `Bearer ${this.state.token}`,
      },
      body: this.createFormData(),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['status_code'])
          if (data['status_code']) {
            this.setState({isLoading: false});
            this.props.route.params.payload.fetch();
          }
        console.log('DATA AFTER UPDATE', data);
      });
  };

  createFormData = () => {
    var details = {
      name: this.state.formFields.name,
      description: this.state.formFields.description,
      percentage: this.state.formFields.percentage,
      no_of_services: this.state.formFields.no_of_services,
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    return formBody;
  };
  create = () => {
    console.log('Token', this.state.token);
    fetch(BASE_URL + '/discounts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        Authorization: `Bearer ${this.state.token}`,
      },
      body: this.createFormData(),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['status_code'])
          if (data['status_code']) {
            this.setState({isLoading: false});
            this.props.route.params.payload.fetch();
          }
        console.log('DATA AFTER Create', data);
      });
  };

  updateOrCreate = () => {
    this.setState({
      isLoading: true,
    });
    const {action, payload} = this.props.route.params;
    if (action == 'update') this.update();
    else this.create();
  };

  closure = (keyName) => {
    return (text) => {
      console.log('text', text);
      this.setState({
        formFields: {
          ...this.state.formFields,
          [keyName]: text,
        },
      });
    };
  };

  validate = () => {
    let isValid = true;
    let object = {
      hasNameError: false,
      hasDescriptionError: false,
      hasPercentageError: false,
      hasServiceError: false,
    };

    let stateObject = Object.keys(this.state.formFields).reduce(
      (acc, current) => {
        let truthy = false;
        if (this.state.formFields[current]) truthy = false;
        else {
          truthy = true;
          isValid = false;
        }

        return {
          ...acc,
          [current]: truthy,
        };
      },
      {},
    );

    console.log('ValidatedObject', stateObject);
    this.setState({
      error: {
        ...this.state.error,
        ...stateObject,
      },
    });
    if (!isValid) return;

    this.updateOrCreate();
  };

  componentDidMount() {
    const {action, payload} = this.props.route.params;
    console.log('ACTION IS ', action);
    console.log('PayLoad is', payload);

    this.obj = {
      token: payload.token,
    };

    if (action == 'update') {
      this.obj = {
        ...this.obj,
        id: payload.discount.id,
        formFields: {
          ...this.state.formFields,
          name: payload.discount.name,
          description: payload.discount.description,
          no_of_services: payload.discount['no_of_services'],
          percentage: payload.discount.percentage,
        },
      };
      console.log('object To be Merged', this.obj);
      this.setState({
        ...this.obj,
      });
    } else
      this.setState({
        ...this.obj,
      });
  }
  componentDidUpdate(prevProps, prevState) {
    //   console.log("STATE FROM Update" , this.state)
    //   if(this.state.id != prevState.id)
    //   {
    //     this.setState({
    //         ...this.state ,
    //         ...this.obj
    //      } ,console.log("state" , this.state))
    //   }
  }

  state = {
    id: ' ',
    token: '',
    isLoading: false,
    formFields: {
      name: '',
      description: '',
      percentage: '',
      no_of_services: '',
    },
    error: {
      name: false,
      description: false,
      percentage: false,
      no_of_services: false,
    },
  };
  render() {
    return (
      <SafeAreaView style = {{flex:1}}>
      <ScrollView style={{flex: 1, backgroundColor: 'lightgrey'}}>
        <View style={{padding: 20}}>
          <Loader loading = {this.state.isLoading}/>  
          <Input
            title="Enter Name"
            value={this.state.formFields.name}
            change={this.closure('name')}
            hasError={this.state.error.name}
            errorDescription="This field is required"
          />
          <Input
            title="Enter Description"
            value={this.state.formFields.description}
            change={this.closure('description')}
            hasError={this.state.error.description}
            errorDescription="This field is required"
          />
          <Input
            title="Enter Percentage"
            value={this.state.formFields.percentage.toString()}
            change={this.closure('percentage')}
            hasError={this.state.error.percentage}
            errorDescription="This field is required"
          />
          <Input
            value={this.state.formFields.no_of_services.toString()}
            title="Enter  Number of Services"
            change={this.closure('no_of_services')}
            hasError={this.state.error.no_of_services}
            errorDescription="This field is required"
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={this.validate}
              style={{
                backgroundColor: 'purple',
                padding: 15,
                borderRadius: 25,
              }}>
              <Text>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>  
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
