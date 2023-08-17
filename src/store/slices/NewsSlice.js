import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  articles: [
  ],
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    addNewsData(state, action) {
      const newsDataWithPinned = action.payload.map(item => ({
        ...item,
        isPinned: false, // Manually set isPinned to false for all items
      }));
      state.articles.push(...newsDataWithPinned);
      state.articles.reverse()
      state.articles.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1; // Pinned items go first
        if (!a.isPinned && b.isPinned) return 1; // Non-pinned items come after
        return 0; // Leave other items unchanged
      });

    },
    removeNewsData(state, action) {
      const itemIdToRemove = action.payload;
      state.articles = state.articles.filter(item => item.publishedAt !== itemIdToRemove);
    },
    togglePin: (state, action) => {
      const itemId = action.payload;
      const newsItem = state.articles.find(item => item.publishedAt === itemId);
      if (newsItem) {
        newsItem.isPinned = !newsItem.isPinned;
      }
      state.articles.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1; // Pinned items go first
        if (!a.isPinned && b.isPinned) return 1; // Non-pinned items come after
        return 0; // Leave other items unchanged
      });
    },

  },
});

export const { addNewsData, removeNewsData,togglePin } = newsSlice.actions;
export default newsSlice.reducer;

// {
//   source: {
//     id: null,
//       name: "Barron's",
//   },
//   author: "Adam Clark",
//     title: "Tesla Stock Falls as Prices Cut Again in China",
//   description: "Tesla reduces the price of its Model S luxury sedan and Model X SUV in China, extending price cuts across its range.",
//   url: "https://www.barrons.com/articles/tesla-stock-china-price-cuts-e501b0c7",
//   urlToImage: "https://images.barrons.com/im-422838/social",
//   publishedAt: "2023-08-16T10:21:43Z",
//   content: "Tesla\r\n has cut prices in China for the second time in less than a week. The electric-vehicle maker looks intent on pressuring its competition in the worlds largest car market. \r\nTesla\r\n (ticker: TSL… [+969 chars]",
// },



//const updatedItems = [...existingItems, ...newItems];
