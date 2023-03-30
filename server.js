const axios = require("axios");
const express = require("express");
const cors = require("cors");

const morgan = require("morgan");
const apicache = require("apicache");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors());

app.use(morgan('dev'));
let cache = apicache.middleware;
app.use(cache('1 day'))

const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
    let contents = [];

    axios.get("https://prod-api-cached-2.viewlift.com/content/pages?site=prothomalo&path=%2F&includeContent=true&moduleOffset=0&moduleLimit=28&languageCode=bn&countryCode=BD&userState=bG9nZ2VkT3V0").then((response) => {
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
    }).catch((error) => {
        console.log(error);
    });
});

app.get("/movies", async (req, res) => {
    let contents = [];

    axios.get("https://prod-api-cached-2.viewlift.com/content/pages?path=%2Fmovies&site=prothomalo&includeContent=true&moduleOffset=3&moduleLimit=20&languageCode=bn&countryCode=BD&userState=bG9nZ2VkT3V0").then((response) => {
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
    }).catch((error) => {
        console.log(error);
    });
});

app.get("/series", async (req, res) => {
    let contents = [];

    axios.get("https://prod-api-cached-2.viewlift.com/content/pages?path=%2Fseries&site=prothomalo&includeContent=true&moduleOffset=0&moduleLimit=10&languageCode=bn&countryCode=BD&userState=bG9nZ2VkT3V0").then((response) => {
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
    }).catch((error) => {
        console.log(error);
    });
});

app.get("/shows", async (req, res) => {
    let contents = [];

    axios.get("https://prod-api-cached-2.viewlift.com/content/pages?site=prothomalo&path=%2Fshows&includeContent=true&moduleOffset=3&moduleLimit=10&languageCode=bn&countryCode=BD&userState=bG9nZ2VkT3V0").then((response) => {
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
    }).catch((error) => {
        console.log(error);
    });
});

app.get("/search", async (req, res) => {
    let query = req.query.q
    let contents = [];
  axios.get(`https://prod-api-cached-2.viewlift.com/search/v1?site=prothomalo&searchTerm=${query}&types=video,series,bundle,audio&languageCode=bn&relatedSearch=true`).then((response) => {
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
    }).catch((error) => {
        console.log(error);
    });
});

app.get("/bn/videos/:movie", async (req, res) => {
  let contents = {};
  
  let movie = req.params.movie;
  await axios.get(`https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?url=/bn/videos/${movie}`).then(async (res) => {
    try {
      await axios.get(`https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?id=${res.data.videometaid}`).then((res) => {
        contents = {
        title: res.data.contentDetails.title,
        description: res.data.contentDetails.description,
        images: res.data.contentDetails.image,
        m3u8: res.data.url,
        subtitles: res.data.subtitles,
      }
      });
    } catch (err) {
      console.log(err);
    }
  });
  res.json(contents);
});

app.get("/bn/series/:series", async (req, res) => {
  let contents;
  let series = req.params.series;

  let seriesInfo;

  await axios
    .get(
      `https://prod-api-cached-2.viewlift.com/content/pages?path=%2Fbn%2Fseries%2F${series}&site=prothomalo&includeContent=true&moduleOffset=2&moduleLimit=1&languageCode=bn&countryCode=BD`
    )
    .then(async (res) => {
      try {
        let seriesData = res.data.modules[0].contentData[0].gist;
        seriesInfo = {
          title: seriesData.title,
          description: seriesData.description.replace(/(\r\n|\n|\r)/gm, ""),
          images: seriesData.imageGist,
        };

        let seasonsArray = [];

        let SeasonsData = res.data.modules[0].contentData[0].seasons;

        for (let i = 0; i < SeasonsData.length; i++) {
          let episodesArray = [];
          let episodes = SeasonsData[i].episodes;
          for (let j = 0; j < episodes.length; j++) {
            let fileId = episodes[j].gist.originalObjectId;
            let title = episodes[j].gist.title;
            let description = episodes[j].gist.description.replace(/(\r\n|\n|\r)/gm, "");
            let images = episodes[j].gist.imageGist;
            let response = await axios.get(
              `https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?id=${fileId}`
            );
            let episodeData = {
              src: response.data.url,
              title: title,
              description: description ?? "",
              images: images ?? "",
              subtitles: response.data.subtitles ?? "",
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
      } catch (err) {
        console.log(err);
      }
    });
  res.json(contents);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
