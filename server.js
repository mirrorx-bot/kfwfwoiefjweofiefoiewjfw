require("dotenv").config();

const axios = require("axios");
const express = require("express");
const cors = require("cors");
const { urlencoded } = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  axios
    .get("https://chorki-api.onrender.com")
    .then((response) => {
      res.render("./pages/index", {
        title: "Home",
        modules: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/movies", async (req, res) => {
  axios
    .get("https://chorki-api.onrender.com/movies")
    .then((response) => {
      res.render("./pages/movies", {
        title: "Movies",
        modules: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/series", async (req, res) => {
  axios
    .get("https://chorki-api.onrender.com/series")
    .then((response) => {
      res.render("./pages/series", {
        title: "Series",
        modules: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/shows", async (req, res) => {
  axios
    .get("https://chorki-api.onrender.com/shows")
    .then((response) => {
      res.render("./pages/shows", {
        title: "Shows",
        modules: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/bn/videos/:movie", async (req, res) => {
  let movie = req.params.movie;
  await axios
    .get(`https://chorki-api.onrender.com/bn/videos/${movie}`)
    .then((res) => {
      try {
        title = res.data.title;
        description = res.data.description;
        m3u8 = res.data.m3u8;
        images = res.data.images;
        subtitle = res.data.subtitle;
      } catch (err) {
        console.log(err);
      }
    });
  res.render("./pages/watchMovie", {
    title: title,
    description: description,
    url: m3u8,
    images: images,
    subtitles: subtitle,
  });
});

// app.get("/bn/series/:series", async (req, res) => {
//   let series = req.params.series;
//   let title, description, images, m3u8, subtitle;
//   await axios
//     .get(
//       `https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?url=/bn/videos/${series}`
//     )
//     .then(async (res) => {
//       try {
//         await axios
//           .get(
//             `https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?id=${res.data.videometaid}`
//           )
//           .then((res) => {
//             contents = {
//               title: res.data.contentDetails.title,
//               description: res.data.contentDetails.description,
//               images: res.data.contentDetails.image,
//               m3u8: res.data.url,
//               subtitles: res.data.subtitles,
//             };
//           });
//       } catch (err) {
//         console.log(err);
//       }
//     });
//   res.render("./pages/watchSeries", {
//     title: title,
//     description: description,
//     url: m3u8,
//     images: images,
//     subtitles: subtitle,
//   });
// });

app.get("/bn/series/:series", async (req, res) => {
  let contents;
  let series = req.params.series;
  await axios
    .get(
      `https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?url=/bn/series/${series}`
    )
    .then(async (res) => {
      try {
        let SeriesData = JSON.parse(res.data.contentdetails);

        let seriesInfoArray = [];
        let seasonsArray = [];

        seriesInfo = {
          title: SeriesData.title,
          images: SeriesData.image,
        };
        seriesInfoArray.push(seriesInfo);

        let SeasonsData = JSON.parse(res.data.season);
        console.log(SeasonsData[0].episodes);

        for (let i = 0; i < SeasonsData.length; i++) {
          let episodesArray = [];
          let episodes = SeasonsData[i].episodes;
          for (let j = 0; j < episodes.length; j++) {
            let fileId = episodes[j].fileid;
            let response = await axios.get(
              `https://api.raihanmiraj.com/hoichoichorki/chorkiapi.php/?id=${fileId}`
            );
            let episodeData = {
              title: episodes[j].title,
              description: response.data.contentDetails
                ? response.data.contentDetails.description
                : "",
              images: response.data.contentDetails
                ? response.data.contentDetails.image
                : "",
              m3u8: response.data.url,
              subtitles: response.data.subtitles,
            };
            episodesArray.push(episodeData);
            console.log(episodeData);
          }

          let seasonData = {
            season: SeasonsData[i].seasonName,
            episodes: episodesArray,
          };
          seasonsArray.push(seasonData);
        }

        contents = {
          info: seriesInfoArray,
          seasons: seasonsArray,
        };
      } catch (err) {
        console.log(err);
      }
    });
  res.json(contents);
});

// app.get('/profile', (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
