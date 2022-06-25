import {
  View,
  TouchableOpacity,
  Text, StyleSheet,
  TouchableOpacityProps
} from 'react-native'

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
interface ListCardProps extends TouchableOpacityProps {
  item: ListInVoiceProps;
}

export function ListCard({ item, ...rest}: ListCardProps) {
  

  return (
     <View style={styles.container}>
       <TouchableOpacity
         style={styles.buttonCard}
         key={item.id}
         {...rest}>


         <View style={styles.separator} />

         <Text style={styles.titleCard}>Dados da NF</Text>
         <Text style={styles.textCard}>Nota Fiscal: {item.invoice} </Text>
         <Text style={styles.textCard}>Cliente: {item.client} </Text>
         <Text style={styles.textCard}>Valor da NF: {item.invoice_value} </Text>
         <Text style={styles.textCard}>Valor do Pis: {item.pis} </Text>
         <Text style={styles.textCard}>Valor do Cofins: {item.cofins} </Text>
         <Text style={styles.textCard}>Valor do Csll: {item.csll} </Text>
         <Text style={styles.textCard}>Valor do Iss: {item.iss} </Text>
        <Text style={styles.textCard}>Valor Liquido da NF: {item.valorLiquido}</Text>
       </TouchableOpacity>
     </View>
   )
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  buttonCard: {
    width: '100%',
    padding: 6,
    backgroundColor: '#969CB2',
    borderRadius: 10
  },
  textCard: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  titleCard: {
    color: '#ff872c',
    fontSize: 26,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  separator: {
    marginTop: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  }
})




