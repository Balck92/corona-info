import React, { Component } from "react";
import config from "../config";
import Card from "./card";
import Transition from "./transition";
import "../App.css";
import "../App.scss";
import SearchBox from "../common/searchbox";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTextTransition, { presets } from "react-text-transition";
import { toast } from "react-toastify";

let Parser = require("rss-parser");
let parser = new Parser();

const randomNumber = () => Math.floor(Math.random() * 9999999999 + 10000000000);

class News extends Component {
  state = {
    newsItems: [],
    titleArray: [],
    searchQuery: "",
    newsItem: [],
    textIndex: 0,
    textFastIndex: 0,
    paragraphIndex: 0,
    number: randomNumber(),
    hasLoadedNews: false,
    initialLoad: true
  };



  // displayFirstNewsTitle = () => {

  //   const newsItems = this.getFilteredArray();
  //   console.log("NEWS ITEM: ", newsItems);
  //   return newsItems[0].title;
  // }

  firstNews = () => {
    const newsItems = this.getFilteredArray();
    // const newIndex = this.state.newsItem.index + 1;
    this.setState({
      newsItem: newsItems[0]
    });
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

  fetchLoadedNews() {
    if (this.state.hasLoadedNews) {
      return this.state.newsItems
    } else {
      return "NOT LOADED";
    }
  }

  async componentDidMount() {
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    const { items: newsItems } = await parser.parseURL(
      CORS_PROXY + config.apiEndpoint
    );
    setInterval(() => {
      this.setState({
        number: randomNumber(),
        textIndex: this.state.textIndex + 1,
        paragraphIndex: this.state.paragraphIndex + 1
      });
    }, 4000);
    setInterval(() => {
      this.setState({
        textFastIndex: this.state.textFastIndex + 1
      });
    }, 150);

    let firstIndex = 0;
    newsItems.forEach(function (element) {
      element.index = firstIndex++;
    });
    this.setState({ newsItems });
    const temp = newsItems[0];
    this.setState({ newsItem: temp });
    this.setState({ hasLoadedNews: true })
    let allNews = this.getFilteredArray();
    let result = allNews.map(a => a.title);
    this.setState({ titleArray: result })


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
    const { newsItem, searchQuery, hasLoadedNews, titleArray } = this.state;
    let allNews = this.getFilteredArray();

    return (
      <React.Fragment>
        <ToastContainer />
        <div className="App">
          <section className="big">
            {hasLoadedNews ? (
              <ReactTextTransition
                text={titleArray[this.state.textIndex % titleArray.length]}
                spring={presets.gentle}
                delay={300}
                inline
              />
            ) : (
                <h1>NO NEWS LOADED</h1>
              )}

          </section>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.firstNews()}
            disabled={newsItem.index === allNews.length - 1}
          >
            Go to start
          </button>

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
      </React.Fragment >
    );
  }
}

export default News;
