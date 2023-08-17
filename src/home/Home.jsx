import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, formatDistanceToNow, subMonths } from "date-fns";
import { getNews } from "../services/AppServices";
import { addNewsData, removeNewsData, togglePin } from "../store/slices/NewsSlice";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "../utils/StorageKeys";
import BackgroundTimer from 'react-native-background-timer';

export default function Home() {

  let flatListRef = useRef(null);
  const [index, setIndex] = useState(0);
  const news = useSelector(state => state.news.articles);
  const pageSize = 10;
  const [isRefreshing, setIsRefreshing] = useState(false);
  let category = useRef("tesla");
  const currentDate = new Date();
  const previousMonthDate = subMonths(currentDate, 1);
  let dateApi = useRef(format(previousMonthDate, "yyyy-MM-dd"));
  const [isLoading, setIsLoading] = useState(false);
  let page = useRef(0);
  const dispatch = useDispatch();


  const scrollToIndex = (index) => {
    flatListRef.current.scrollToIndex({ index, animated: true });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNews();
  };


  useEffect(() => {
   // fetchFromStorage()
    fetchNews();
    const intervalId = BackgroundTimer.setInterval(() => {
      fetchNews()
    }, 10000);
    return () => {
      BackgroundTimer.clearInterval(intervalId);
    };

  }, []);

  async function handleStorage() {
    // await AsyncStorage.setItem(StorageKeys.newsData, JSON.stringify(news));
  }

  // async function fetchFromStorage() {
  //   const items = await AsyncStorage.getItem(StorageKeys.newsData);
  //   if (items!==undefined){
  //     console.log("inside ")
  //     const jsonData = JSON.parse(items)
  //     dispatch(addNewsData(jsonData));
  //   }else {
  //     fetchNews()
  //   }
  // }


  function fetchNews() {
    setIsRefreshing(true);
    page.current = page.current + 1;
    console.log("page number " + page.current);
    console.log("date " + dateApi.current);
    console.log("Category " + category.current);

    getNews(category.current, dateApi.current, page.current, pageSize)
      .then(async function(response) {
        console.log("resss", response.data);
        const newItems = response.data.articles;
        const updatedItems = [...newItems, ...news];
        dispatch(addNewsData(updatedItems));
        setIsLoading(true);
        setIsRefreshing(false);
        handleStorage()
      })
      .catch(function(error) {
        setIsLoading(false);
        setIsRefreshing(false);

        if (error.response.data.code === 'rateLimited'){
          Alert.alert("Today Api Limit", "Please try again later, exceeds maximum limit !");
        }else {
          Alert.alert("Server error", "Please try again later!");

        }
        throw error;
      });
  }

  const dateKeyExtract = useCallback((item, index) => index);

  const onDateEndReach = () => {
    console.log("the end");
  };

  const itemSeparatorComponent = useCallback((item) => {
    return (
      <View style={{ marginBottom: 20 }} />
    );

  }, [news]);

  // @ts-ignore
  const renderRightActions = (
    progress,
    dragAnimatedValue,
    index, data,
  ) => {
    const opacity = dragAnimatedValue.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <View style={styles.swipedRow}>
        <View style={styles.swipedConfirmationContainer}>
          <Text style={styles.deleteConfirmationText}></Text>
        </View>
        <Animated.View style={[styles.deleteButton, { opacity }]}>
          <TouchableOpacity
            onPress={() => {
              dispatch(removeNewsData(data.publishedAt));
              handleStorage()
            }
            }
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.pinButton, { opacity }]}>
          <TouchableOpacity onPress={async () => {
            dispatch(togglePin(data.publishedAt));
            handleStorage()
          }
          }>
            <Text style={styles.pinButtonText}>{data.isPinned ? 'Unpin' : 'Pin'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderItem = useCallback(({ item, index }) => {

    return (
      <Swipeable
        key={item.publishedAt}
        renderRightActions={(progress, dragAnimatedValue) => renderRightActions(progress, dragAnimatedValue, index, item)}>
        {
          item.isPinned ? (<Image
            source={require('../../assets/images/pin.png')}
            style={styles.pinImage}

          />) :(<></>)
        }
        <TouchableOpacity style={styles.articleContainer}>
          <Image
            source={{ uri: item.urlToImage }}
            style={styles.articleImage}

          />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.articleDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
            <Text
              style={styles.articlePublishedAt}>Published: {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</Text>
          </View>
        </TouchableOpacity>

      </Swipeable>

    );

  }, [news]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView>
        <View>
          {/*<Image*/}
          {/*  source={{ uri: '' }}*/}
          {/*  style={styles.PinnedImage}*/}
          {/*/>*/}
        </View>

        <FlatList
          ref={flatListRef}
          initialScrollIndex={index}
          data={news}
          renderItem={
            renderItem
          }
          style={{ marginTop: 20 }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={dateKeyExtract}
          ItemSeparatorComponent={itemSeparatorComponent}
          onEndReached={onDateEndReach}
          getItemLayout={(data, index) => (
            { length: RFValue(0), offset: RFValue(0) * index, index }
          )}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        />
      </SafeAreaView>

    </GestureHandlerRootView>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  articleContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#fff",
    alignContent: "space-between",
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  pinImage:{
    width:RFValue(15),
    height:RFValue(20),
    alignSelf:'flex-end',
    marginRight:RFValue(20)
  },
  articleContent: {
    marginLeft: 10,
  },
  articleTitle: {
    fontWeight: "bold",
    color:'#000',
    fontSize: 16,
    marginRight: RFValue(60),
  },
  articleDescription: {
    marginTop: 5,
    color:'#000',
    marginRight: RFValue(60),
  },
  articlePublishedAt: {
    fontStyle: "italic",
    marginTop: 5,
    color: "#00308F",
  },
  articleContentText: {
    marginTop: 10,
  },
  swipedRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingLeft: 5,
    backgroundColor: "#818181",
    margin: 20,
    minHeight: 50,
  },
  swipedConfirmationContainer: {
    flex: 1,
  },
  deleteConfirmationText: {
    color: "#fcfcfc",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#b60000",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    width: RFValue(50),
  },
  deleteButtonText: {
    color: "#fcfcfc",
    fontWeight: "bold",
    padding: 3,
    alignSelf: "center",
  },
  pinButton: {
    backgroundColor: "#00308F",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    width: RFValue(50),
  },
  pinButtonText: {
    color: "#fcfcfc",
    fontWeight: "bold",
    padding: 3,
    alignSelf: "center",
  },

  //pinned style

  PinnedImage: {
    borderRadius: 10,
    height:RFValue(130)
  },
  PinnedContent: {
    marginLeft: 10,
  },
  PinnedTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: RFValue(60),
  },
  PinnedDescription: {
    marginTop: 5,
    marginRight: RFValue(60),
  },
  pinnedContainer:{
    marginHorizontal:RFValue(30),
  }
});
