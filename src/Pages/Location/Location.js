import React from "react";
import Slide from "./Slide";
import "./Location.scss";
import LocationInfo from "./LocationInfo";
import LocationDetail from "./LocationDetail";

class Location extends React.Component {
  constructor() {
    super();
    this.state = {
      shopList: [],
      shopDetailList: [],
    };
  }

  componentDidMount() {
    fetch("/data/locationmock.json")
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          shopList: res.data,
          shopDetailList: res.detailData,
        });
      });
  }

  render() {
    return (
      <div className="location">
        <Slide />
        <div className="kakaoContent">
          <ul className="language">
            <li>한국어</li>
            <li>English</li>
            <li>日本語</li>
            <li>中文(简体)</li>
            <li>中文(繁體)</li>
          </ul>
        </div>
        {this.state.shopList.map((el, i) => {
          return <LocationInfo key={i} shop={el} />;
        })}
        <div className="kakakoDetail">
          <ul className="kakaoShop">
            <li>스토어 전체</li>
            <li>한국</li>
            <li>일본</li>
          </ul>
        </div>
        <div className="detailList">
          {this.state.shopDetailList.map((el, i) => {
            return <LocationDetail key={i} detailShop={el} />;
          })}
        </div>
        <div className="bottomBanner">
          <img
            alt="배너"
            src="https://t1.kakaocdn.net/friends/prod/info/banner_charInfo_kr_W.png"
          />
        </div>
      </div>
    );
  }
}

export default Location;
