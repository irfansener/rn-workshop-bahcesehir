//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList
} from "react-native";
import API from "../utils/api";
import CharacterCard from "../components/characterCard";
import SearchHeader from "../components/searchHeader";

// create a component
class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      error: null,
      characters: []
    };
  }

  componentDidMount() {
    this.getAllCharacters();
  }

  handleToDetailPage=(character)=>{
    const { navigation } = this.props;
    navigation.navigate('DetailScreen', {character:character})  
  }

  getAllCharacters = () => {
    API.getCharacters({ orderBy:'-modified' } )
      .then(response => {
        this.setState({ loading: false, characters: response.data.results });
      })
      .catch(err => {
        this.setState({ loading: false, error: err });
      });
  };

  handleSearchSubmit = text => {
    API.getCharacters({ nameStartsWith: text })
      .then(response => {
        this.setState({ loading: false, characters: response.data.results });
      })
      .catch(err => {
        this.setState({ loading: false, error: err });
      });
  };

  renderHeader = () => {
    return (
      <SearchHeader
        onSubmit={this.handleSearchSubmit}
        cancelSearch={() => this.getAllCharacters()}
      />
    );
  };

  renderCharacters = () => {
    return (
      <FlatList
        data={this.state.characters}
        renderItem={({ item }) => <CharacterCard character={item} goToDetail={this.handleToDetailPage} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={this.renderHeader}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? <ActivityIndicator /> : this.renderCharacters()}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FfFfFf"
  }
});

//make this component available to the app
export default Home;
