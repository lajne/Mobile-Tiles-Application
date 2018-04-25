import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column', 
    backgroundColor: '#4C566A',
  },
  content: {
    flex: 1, 
    flexDirection: 'column', 
    margin: 7,
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#4C566A',
  },
  menuRow: {
    flex: 12, 
    flexDirection: 'row',
  },
  menuTile: {
    margin: 8, 
    height: 90, 
    justifyContent: 'center', 
    borderRadius: 7,
  },
  tileText: {
    textAlign: 'center', 
    fontSize: 18, 
    fontWeight: 'bold'
  },
  loadingView: {
    flex: 1, 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#4C566A',
  },
});