import React from "react";
import Icon from "../../components/icon/Icon";

const News = () => {
  return (
    <div className="nk-news-list">
      <a className="nk-news-item" href="#news" onClick={(ev) => ev.preventDefault()}>
        <div className="nk-news-icon">
          <Icon name="card-view" />
        </div>
        <div className="nk-news-text">
          <p>
            Doing away with quack Valuers <span> Your Reports are signed and temper proof</span>
          </p>
          <Icon name="external" />
        </div>
      </a>
    </div>
  );
};

export default News;
