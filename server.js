const axios = require("axios");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const morgan = require("morgan");
const apicache = require("apicache");

const app = express();
app.use(helmet({ poweredBy: false }));
app.use(morgan("dev"));
app.use(cors());

let cache = apicache.middleware;
app.use(cache("1 day"));

const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  let contents = [];

  axios
    .get(
      "https://prod-api-cached-2.viewlift.com/content/pages?site=prothomalo&path=%2F&includeContent=true&moduleOffset=0&moduleLimit=28&languageCode=bn&countryCode=BD&userState=bG9nZ2VkT3V0"
    )
    .then((response) => {
      let modules = response.data.modules;
      modules.forEach((module) => {
        if (module.moduleType == "CuratedTrayModule") {
          let moduleName = module.title ? module.title : "carousel";
          let moduleContents = [];
          module.contentData.forEach((content) => {
            let contentData = {
              title: content.gist.title,
              id: content.gist.originalObjectId,
              permalink: content.gist.permalink,
              description: content.gist.description,
              type: content.gist.contentType,
              images: content.gist.imageGist,
            };
            moduleContents.push(contentData);
          });
          let modulesorted = {
            module: moduleName,
            contents: moduleContents,
          };
          contents.push(modulesorted);
        }
      });

      res.json(contents);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/movies", async (req, res) => {
  let contents = [];

  axios
    .get(
      "https://prod-api-cached-2.viewlift.com/content/pages?path=%2Fmovies&site=prothomalo&includeContent=true&moduleOffset=3&moduleLimit=20&languageCode=bn&countryCode=BD&userState=bG9nZ2VkT3V0"
    )
    .then((response) => {
      let modules = response.data.modules;
      modules.forEach((module) => {
        if (module.moduleType == "CuratedTrayModule") {
          let moduleName = module.title ? module.title : "carousel";
          let moduleContents = [];
          module.contentData.forEach((content) => {
            let contentData = {
              title: content.gist.title,
              id: content.gist.originalObjectId,
              permalink: content.gist.permalink,
              description: content.gist.description,
              type: content.gist.contentType,
              images: content.gist.imageGist,
            };
            moduleContents.push(contentData);
          });
          let modulesorted = {
            module: moduleName,
            contents: moduleContents,
          };
          contents.push(modulesorted);
        }
      });

      res.json(contents);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/series", async (req, res) => {
  let contents = [];

  axios
    .get(
      "https://prod-api-cached-2.viewlift.com/content/pages?path=%2Fseries&site=prothomalo&includeContent=true&moduleOffset=0&moduleLimit=10&languageCode=bn&countryCode=BD&userState=bG9nZ2VkT3V0"
    )
    .then((response) => {
      let modules = response.data.modules;
      modules.forEach((module) => {
        if (module.moduleType == "CuratedTrayModule") {
          let moduleName = module.title ? module.title : "carousel";
          let moduleContents = [];
          module.contentData.forEach((content) => {
            let contentData = {
              title: content.gist.title,
              id: content.gist.originalObjectId,
              permalink: content.gist.permalink,
              description: content.gist.description,
              type: content.gist.contentType,
              images: content.gist.imageGist,
            };
            moduleContents.push(contentData);
          });
          let modulesorted = {
            module: moduleName,
            contents: moduleContents,
          };
          contents.push(modulesorted);
        }
      });

      res.json(contents);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/shows", async (req, res) => {
  let contents = [];

  axios
    .get(
      "https://prod-api-cached-2.viewlift.com/content/pages?site=prothomalo&path=%2Fshows&includeContent=true&moduleOffset=3&moduleLimit=10&languageCode=bn&countryCode=BD&userState=bG9nZ2VkT3V0"
    )
    .then((response) => {
      let modules = response.data.modules;
      modules.forEach((module) => {
        if (module.moduleType == "CuratedTrayModule") {
          let moduleName = module.title ? module.title : "carousel";
          let moduleContents = [];
          module.contentData.forEach((content) => {
            let contentData = {
              title: content.gist.title,
              id: content.gist.originalObjectId,
              permalink: content.gist.permalink,
              description: content.gist.description,
              type: content.gist.contentType,
              images: content.gist.imageGist,
            };
            moduleContents.push(contentData);
          });
          let modulesorted = {
            module: moduleName,
            contents: moduleContents,
          };
          contents.push(modulesorted);
        }
      });

      res.json(contents);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/search", async (req, res) => {
  let query = req.query.q;
  let contents = [];
  axios
    .get(
      `https://prod-api-cached-2.viewlift.com/search/v1?site=prothomalo&searchTerm=${query}&types=video,series,bundle,audio&languageCode=bn&relatedSearch=true`
    )
    .then((response) => {
      let results = response.data.records;
      results.forEach((result) => {
        let contentData = {
          title: result.gist.title,
          id: result.gist.originalObjectId,
          permalink: result.gist.permalink,
          description: result.gist.description,
          type: result.gist.mediaType,
          images: result.gist.imageGist,
        };
        contents.push(contentData);
      });
      res.json(contents);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/bn/videos/:movie", async (req, res) => {
  try {
    let response = await axios.get(
      `https://prod-api-cached-2.viewlift.com/content/pages?path=/bn/videos/${req.params.movie}&site=prothomalo&includeContent=true&moduleOffset=2&moduleLimit=1&languageCode=bn`
    );
    let movieData = response.data.modules[0].contentData[0].gist;
    let chorkiResponse = await axios.get(
      `https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?id=${movieData.originalObjectId}`
    );

    let { title, description, imageGist } = movieData;
    let { url, subtitles } = chorkiResponse.data;

    let contents = {
      title,
      description: description.replace(/(\r\n|\n|\r)/gm, null) ?? null,
      images: imageGist ?? null,
      src: url ?? null,
      subtitles: subtitles ?? null,
    };
    
    res.json(contents);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/bn/videos/:type/:name", async (req, res) => {
  try {
    let response = await axios.get(
      `https://prod-api-cached-2.viewlift.com/content/pages?path=/bn/videos/${req.params.type}/${req.params.name}&site=prothomalo&includeContent=true&moduleOffset=2&moduleLimit=1&languageCode=bn`
    );
    let videoData = response.data.modules[0].contentData[0].gist;
    let chorkiResponse = await axios.get(
      `https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?id=${videoData.originalObjectId}`
    );

    let { title, description, imageGist } = videoData;
    let { url, subtitles } = chorkiResponse.data;

    let contents = {
      title,
      description: description.replace(/(\r\n|\n|\r)/gm, null) ?? null,
      images: imageGist ?? null,
      src: url ?? null,
      subtitles: subtitles ?? null,
    };

    res.json(contents);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/bn/series/:series", async (req, res) => {
  try {
    let contents, seriesInfo;
    let response = await axios.get(
      `https://prod-api-cached-2.viewlift.com/content/pages?path=/bn/series/${req.params.series}&site=prothomalo&includeContent=true&moduleOffset=2&moduleLimit=1&languageCode=bn`
    );
    let seriesData = response.data.modules[0].contentData[0].gist;
    seriesInfo = {
      title: seriesData.title,
      description: seriesData.description.replace(/(\r\n|\n|\r)/gm, null) ?? null,
      images: seriesData.imageGist ?? null,
    };
    let seasonsArray = [];
    let SeasonsData = response.data.modules[0].contentData[0].seasons;
    for (let i = 0; i < SeasonsData.length; i++) {
      let episodesArray = [];
      let episodes = SeasonsData[i].episodes;
      for (let j = 0; j < episodes.length; j++) {
        let chorkiResponse = await axios.get(
          `https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?id=${episodes[j].gist.originalObjectId}`
        );
        let episodeData = {
          title: episodes[j].gist.title,
          description: episodes[j].gist.description.replace(/(\r\n|\n|\r)/gm, null) ?? null,
          images: episodes[j].gist.imageGist ?? null,
          src: chorkiResponse.data.url ?? null,
          subtitles: chorkiResponse.data.subtitles ?? null,
        };
        episodesArray.push(episodeData);
      }
      let seasonData = {
        season: SeasonsData[i].seasonName,
        episodes: episodesArray,
      };
      seasonsArray.push(seasonData);
    }
    contents = {
      info: seriesInfo,
      seasons: seasonsArray,
    };
    res.json(contents);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/bn/series/:series/:name", async (req, res) => {
  try {
    let contents, seriesInfo;
    let response = await axios.get(
      `https://prod-api-cached-2.viewlift.com/content/pages?path=/bn/series/${req.params.series}/${req.params.name}&site=prothomalo&includeContent=true&moduleOffset=2&moduleLimit=1&languageCode=bn`
    );
    let seriesData = response.data.modules[0].contentData[0].gist;
    seriesInfo = {
      title: seriesData.title,
      description: seriesData.description.replace(/(\r\n|\n|\r)/gm, null) ?? null,
      images: seriesData.imageGist ?? null,
    };
    let seasonsArray = [];
    let SeasonsData = response.data.modules[0].contentData[0].seasons;
    for (let i = 0; i < SeasonsData.length; i++) {
      let episodesArray = [];
      let episodes = SeasonsData[i].episodes;
      for (let j = 0; j < episodes.length; j++) {
        let chorkiResponse = await axios.get(
          `https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?id=${episodes[j].gist.originalObjectId}`
        );
        let episodeData = {
          title: episodes[j].gist.title,
          description: episodes[j].gist.description.replace(/(\r\n|\n|\r)/gm, null) ?? null,
          images: episodes[j].gist.imageGist ?? null,
          src: chorkiResponse.data.url ?? null,
          subtitles: chorkiResponse.data.subtitles ?? null,
        };
        episodesArray.push(episodeData);
      }
      let seasonData = {
        season: SeasonsData[i].seasonName,
        episodes: episodesArray,
      };
      seasonsArray.push(seasonData);
    }
    contents = {
      info: seriesInfo,
      seasons: seasonsArray,
    };
    res.json(contents);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
