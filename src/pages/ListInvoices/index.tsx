import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, FlatList, Alert, Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Header } from "../../components/Header";
import { ListCard } from '../../components/ListCard';

interface IListInvoices {
  id: string,
  invoice: string,
  client: string,
  invoice_value: number;
}
interface ListInVoiceProps {
  id: string;
  invoice: string; //nota fiscal
  client: string;
  invoice_value: number; //valor nota fiscal
  cofins: number;
  pis: number;
  iss: number;
  csll: number;
  valorLiquido: number;
}

export function ListInvoices() {
  const [status, setStatus] = useState('')
  const [invoiceData, setInvoiceData] = useState<ListInVoiceProps[]>([])
  let inVoiceAll: ListInVoiceProps[] = []
  let inVoice: IListInvoices[] = []

  function handleDeleteInvoice(id: string) {
    Alert.alert("Exclusão", 'Tem certeza?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', onPress: () => {
          setStatus('E')
          setInvoiceData(invoiceData =>
             invoiceData.filter(inv => inv.id !== id))
        },
      }
    ])
  }

  async function loadDataInvoice() {
    const data = await AsyncStorage.getItem('@si:invoice')
    if (data) {
      inVoice = JSON.parse(data)
      inVoiceAll = inVoice.map((invoice) => {
        const data = {
          id: invoice.id,
          invoice: invoice.invoice,
          client: invoice.client,
          invoice_value: invoice.invoice_value,
          cofins: calculateCofins(invoice.invoice_value),
          pis: calculatePis(invoice.invoice_value),
          iss: calculateIss(invoice.invoice_value),
          csll: calculateCsll(invoice.invoice_value),
          valorLiquido: calculateValorLiquidoNf(invoice.invoice_value)
        }
        return data;
      })
      setInvoiceData(inVoiceAll)
    }
  }  

  function calculatePis(invoice_value: number) {
   return parseFloat((invoice_value * 0.65 / 100).toFixed(2))
  }

  function calculateCofins(invoice_value: number) {
    return parseFloat((invoice_value * 3 / 100).toFixed(2))
  }

  function calculateIss(invoice_value: number) {
    return parseFloat((invoice_value * 4 / 100).toFixed(2))
  }
  
  function calculateCsll(invoice_value: number) {
    return parseFloat((invoice_value * 1 / 100).toFixed(2))
  }

  function calculateValorLiquidoNf(invoice_value: number) {
    return parseFloat((invoice_value - calculatePis(invoice_value) - calculateCofins(invoice_value) - calculateIss(invoice_value)).toFixed(2))
  }

  function totalNf() {
    return parseFloat((invoiceData.reduce((total, iv) => total += iv.invoice_value,0)).toFixed(2))
  }

  function totalPis() {
    return parseFloat((invoiceData.reduce((total, iv) => total += iv.pis,0)).toFixed(2))
  }

  function totalCofins() {
    return parseFloat((invoiceData.reduce((total, iv) => total += iv.cofins,0)).toFixed(2))
  }

  function totalIss() {
    return parseFloat((invoiceData.reduce((total, iv) => total += iv.iss,0)).toFixed(2))
  }

  function totalCsll() {
    return parseFloat((invoiceData.reduce((total, iv) => total += iv.csll,0)).toFixed(2))
  }

  function totalValorLiquido() {
    return parseFloat((invoiceData.reduce((total, iv) => total += iv.valorLiquido,0)).toFixed(2))
  }



useEffect(() => {
  loadDataInvoice()
}, [])

useFocusEffect(useCallback(() => {
  loadDataInvoice()
}, []))

useEffect(() => {
  async function saveInvoices() {
    await AsyncStorage.setItem('@si:invoice', JSON.stringify(invoiceData))
  }
  saveInvoices()
}, [invoiceData])

return (
  <View style={styles.container}>
    <Header title='Listam de NF Serviço' />

    <View style={styles.content}>
      <Text style={styles.textCard}>Total do valor da NF: {totalNf()} </Text>
      <Text style={styles.textCard}>Total do valor do Pis: {totalPis()} </Text>
      <Text style={styles.textCard}>Total do valor do Cofins: {totalCofins()}</Text>
      <Text style={styles.textCard}>Total do valor do Csll: {totalCsll()}</Text>
      <Text style={styles.textCard}>Total do valor do Iss: {totalIss()}</Text>
      <Text style={styles.textCard}>Total do valor líquido da NF: {totalValorLiquido()} </Text>
    </View>


    <FlatList
        data={invoiceData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListCard
            item={item}
            onPress={() => handleDeleteInvoice(item.id)}
          />
        )}
      />
  </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f0f2f5'
  },
  content: {
    marginTop: 5,
    marginLeft: 5,
    padding: 6,
  },
  textCard: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
    marginBottom: 4
  },
})

