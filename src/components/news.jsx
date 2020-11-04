import React, { Component } from "react";
import config from "../config";
import Card from "./Card";
import "../App.css";
import "../App.scss";
import SearchBox from "../common/searchbox";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

let Parser = require("rss-parser");
let parser = new Parser();

class News extends Component {
  state = {
    newsItems: [],
    searchQuery: "",
    newsItem: []
  };

  nextNews = () => {
    const newsItems = this.getFilteredArray();
    const newIndex = this.state.newsItem.index + 1;
    this.setState({
      newsItem: newsItems[newIndex]
    });
  };

  prevNews = () => {
    const newsItems = this.getFilteredArray();
    const newIndex = this.state.newsItem.index - 1;
    this.setState({
      newsItem: newsItems[newIndex]
    });
  };

  handleLike = news => {
    const newsItems = this.getFilteredArray();
    const index = newsItems.indexOf(news);
    newsItems[index] = { ...newsItems[index] };
    newsItems[index].liked = !newsItems[index].liked;
    this.setState({ newsItems });
    console.log("Liked Clicked");
  };

  handleSearch = query => {
    this.setState({ searchQuery: query });
    let filteredArray = this.getFilteredArray();
    if (filteredArray === undefined || filteredArray.length === 0) {
      toast.error("Ingen nyhetsartikel finns");
    }
    else {
      this.setState({ newsItem: filteredArray[0] });
      console.log(this.getFilteredArray().length);
    }

  };

  async componentDidMount() {
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    const { items: newsItems } = await parser.parseURL(
      CORS_PROXY + config.apiEndpoint
    );

    let firstIndex = 0;
    newsItems.forEach(function(element) {
      element.index = firstIndex++;
    });
    this.setState({ newsItems });
    const temp = newsItems[0];
    this.setState({ newsItem: temp });
    toast.info("Fetching of news succeeded!");
  }

  getFilteredArray() {
    const { newsItems: allNews, searchQuery } = this.state;
    //filteredNews kan bli null

    let filteredNews = allNews.filter(news => {
      return news.title.toLowerCase().startsWith(searchQuery.toLowerCase());
    });

    filteredNews.forEach(function (element) {
      delete element.index;
    });
    let firstIndex = 0;
    filteredNews.forEach(function (element) {
      element.index = firstIndex++;
    });

    return filteredNews;
  }

  render() {
    const { newsItem, searchQuery } = this.state;
    let allNews = this.getFilteredArray();

    return (
      <React.Fragment>
        <ToastContainer />
        <div className="App">
          <section>
            <h1>News</h1>
          </section>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.prevNews()}
            disabled={newsItem.index === 0}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.nextNews()}
            disabled={newsItem.index === allNews.length - 1}
          >
            Next
          </button>

          <div className="page">
            <SearchBox value={searchQuery} onChange={this.handleSearch} />

            <div className={`cards-slider active-slide-${newsItem.index}`}>
              <div
                className="cards-slider-wrapper"
                style={{
                  transform: `translateX(-${newsItem.index *
                    (100 / allNews.length)}%)`
                }}
              >
                {this.getFilteredArray().map(newsItem => (
                  <Card
                    onLike={this.handleLike}
                    key={newsItem.index}
                    newsItem={newsItem}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default News;
