
import React, { useState , useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  SafeAreaView , 
  TouchableOpacity,
  ActivityIndicator , 
  View
} from "react-native";

import {BASE_URL }from './config'

const Description = (props)=>
{
    return(<View style = {{display:'flex' , flexDirection:'column' , marginBottom: 5}}>
        <Text style = {{color:'black' , fontSize:14 , marginBottom:2}}>{props.title}</Text>
        <Text style = {{fontSize:12 , color:'grey' }}>{props.value}</Text>
    </View>)
}

const MyModal= (props) => {

  const fetchDiscount=()=>
  {
    setLoading(true)
    fetch(BASE_URL + `/discounts/${props.ID}/view` ,  {
        method: 'GET',
        headers: {
          Accept: 'appliacation/json',
          Authorization: `Bearer ${props.token}`,
        },
      }).then(response=>response.json()).then(data=>{
          console.log("DATA FOR DISCOUNT" , data)
          if(data.data)
          setDiscount(data.data)
          setLoading(false)
      })
  }  
  useEffect(()=>{
      console.log("INCOMMING ID" , props.ID)
       fetchDiscount()
  } , [  props.ID])  

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading , setLoading] = useState(false)
  const [test  ,  setTest] =  useState(true)
  const [discount , setDiscount] = useState({
      description:'default' , 
      name: '' , 
      discount:'' , 
      percentage: ''
  })
  return (
    
    <SafeAreaView>
    <Modal
        animationType="slide"
      
        transparent={true}
        visible={props.visible}
        onRequestClose={()=>{
           
            props.toggleModal()}}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
           
           <Text style = {{fontSize:16 , fontWeight:'bold' , marginBottom: 10}}>Discount</Text>
            {
                isLoading  ? <ActivityIndicator color = "red"/> : <> 
                <Description title = "Description" value = {discount.description} />
                <Description title = "Name" value = {discount.name} />
                <Description title = "No Of services" value = {discount["no_of_services"]} />
                <Description title = "Description" value = {discount.percentage} />
                <View style = {{display:'flex' , flexDirection:'row'  , justifyContent:'flex-end'}}>
                    <TouchableOpacity onPress = {props.toggleModal} style = {{
                        padding:10 , 
                        borderRadius:20 , 
                        backgroundColor:'purple'
                    }}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
                
                </>
            }

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  

   
   
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor:'rgba(255 , 255 ,255 ,0.8)' ,
  //  alignItems: "center",
   
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    minHeight: 200 ,
   // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default MyModal;