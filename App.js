import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  AsyncStorage,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { List, ListItem, Icon } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import OpenFile from 'react-native-doc-viewer';
import RNFS from 'react-native-fs';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(
  ['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']
);
import docImage from './file.png';

var SavePath = Platform.OS === 'ios' ?
  RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  };

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      title: params ? params.id : 'Ledningssystem',
    };
  };

//-----: Fetches data from api and saves it, if it isn't possible to fetch:
//-----: we try to get cached data.
  getTilesFromAPI(id) {
    let me = this;
    let url = 'https://apple-bar.glitch.me/?id=' + id
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        me.setState({ jsonData: responseJson });
        let value = JSON.stringify(this.state.jsonData);
        try {
          AsyncStorage.setItem(id, value);
          console.log("Saved successfully:", value);
        } catch (error) {
          console.log("Couldn't save the data");
        }
      })
      .catch((error) => {
        console.log("Couldn't fetch, getting cache data...");
        me.getCache(id);
      });
  };
  // ----------------------------
  // TODO:
  // Ska fixa så att det finns ett versionsnummer på glitch som blir vår key
  // i AsyncStorage.
  // ----------------------------
  getCache(id) {
    AsyncStorage.getItem(id, (error, result) => {
      let jsonStr = result;
      if(!jsonStr) {
        console.log("getting data from server");
        me.getTilesFromAPI(id);
      } else {
        console.log("jsonstr: ", jsonStr);
        let jsonValue = JSON.parse(jsonStr);
        console.log("jsonvalue: ", jsonValue);
        me.setState({jsonData: jsonValue});
      }
    });
  };

  componentDidMount() {
    let me = this;
    let id = me.props.navigation.state.params ?
      me.props.navigation.state.params.id : "Home";

    me.getTilesFromAPI(id);
  };

  //-----: As it says, render tiles OR in some cases:
  //-----: renderDocument() or doc-list content.
  renderTile(tile, i) {
    let me = this
    console.log("tile vad är", tile);
    let onPress = function() {
      if(tile.URL) {
        me.renderDocument(tile.URL)
      }
      else if(tile.flag) {
        me.props.navigation.navigate('Home', {id: tile.title});
      }
      else {
        me.props.navigation.navigate('Home', {id: tile.title});
      }
    }

    return (
      <TouchableOpacity key={"mytile" + i}
        onPress={() => onPress()}
        style={[styles.menuTile, {
          backgroundColor: tile.color
        }]}
      >
        <Text style={styles.tileText}>
          {tile.title}
        </Text>
      </TouchableOpacity>
    );
  };

//-----: As it says, renders a row, that will contain tiles.  
  renderRow(row, rowIndex) {
    return (
      <View key={'row' + rowIndex} style={styles.menuRow}>
        {row.tiles.map((tile, index) => this.renderTile(tile, index))}
      </View>
    )
  };

//-----: As it says, renders a document.
  renderDocument(url){
    this.setState({animating: true});
    OpenFile.openDoc([{
      url:url
    }], (error, url) => {
    if (error) {
      this.setState({animating: false});
    } else {
      this.setState({animating: false});
      console.log(url)
    }
   })
  };

  //-----: As it says, a separator for the Flatlist.
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  render() {
    console.log("Render1", this.state.jsonData);
    if(!this.state.jsonData){
      return (
        <View style={styles.loadingView}>
            <ActivityIndicator size="large" color="black" />
            />
        </View>
      );
    }
    console.log("Render2", this.state.jsonData);
    let rows = this.state.jsonData.rows;
    console.log("rows:", rows);

//-----: If the jsonData contains .documents it'll return doc-list,
//-----: else it will return the tile-content.
    if(this.state.jsonData.documents) {
      let docs = this.state.jsonData.documents;
      let data = this.state.jsonData;
      console.log("im in doclister!", data);
      return (
        <List containerStyle={{ borderTopWidth: 1, borderBottomWidth: 1 }}>
          <FlatList
            data={docs}
            renderItem={({ item }) => (
              <ListItem
              title={item.title}
              subtitle={item.date}
              avatar={docImage}
              containerStyle={{ borderBottomWidth: 0 }}
              onPress={() => this.renderDocument(item.URL)}
              />
            )}
            keyExtractor={item => item.title}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </List>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content"  />
  
          {/* Scrollbar */}
          <ScrollView>
  
            {/* Content */}
            <View style={styles.content}>
              {/* Number of tiles to print (all aviable atm)*/}
              {rows.map((row, index) => this.renderRow(row, index))}
            </View>
  
          </ScrollView>
  
        </View>
      );
    }
  }
}

const RootStack = StackNavigator(
  {
    "Home": {
      screen: HomeScreen,
    },
  },
  {
    initialRouteName: 'Home',

    navigationOptions: {
      headerTintColor: 'white',
      headerBackTitle: 'Back',
      headerStyle: {
        backgroundColor: '#2E3440',
        borderBottomWidth: 0,
        height: 80,
      },
      headerTitleStyle: {
        color: "white",
        fontSize: 25,
      },
    }
  }
);

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    let me = this;
    me.state = {};
  }
  render() {
      return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'column', backgroundColor: '#4C566A',
  },
  content: {
    flex: 1, flexDirection: 'column', margin: 7,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#4C566A'
  },
  menuRow: {
    flex: 12, flexDirection: 'row',
  },
  menuTile: {
    flex: 1, margin: 8, height: 90, justifyContent: 'center', borderRadius: 7,
  },
  tileText: {
    textAlign: 'center', fontSize: 18, fontWeight: 'bold'
  },
  loadingView: {
    flex: 1, flexDirection: 'column', alignItems: 'center', 
    justifyContent: 'center', backgroundColor: '#4C566A',
  },
});
