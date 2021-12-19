const { Client } = require("@notionhq/client");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Workout = require("./models/workout");
// Create a notion client
const notion = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});

const app = express();
const dbURI = process.env.MONGO_CONNECTION_STRING;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    (result) => app.listen(3000) && console.log("App started on port: 3000")
  )
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/add-blog", (req, res) => {
  res.send("Working");
});

app.get("/process", (req, res) => {
  (async () => {
    // Querying Gym Database
    const databaseId = "db876be35ad2484f8906d82517b5edd4";
    const dbResponse = await notion.databases.query({
      database_id: databaseId,
    });

    // Getting a page for each of the records of the 'GYM' database
    // TODO: Adjust so only new / updated records are queried
    dbResponse.results.forEach(async (workout) => {
      // Getting metadata about each workout
      const workoutPage = await notion.pages.retrieve({ page_id: workout.id });
      // Getting page content for each workout
      const workoutBlocks = await notion.blocks.children.list({
        block_id: workout.id,
      });

      // child_database = workouts to be tracked
      let childDatabases = workoutBlocks.results.filter((result) => {
        if (result.type == "child_database") {
          return result;
        }
      });

      let promises = childDatabases.map(async (database) => {
        // Get DB metadata (name)
        const childDbMetadata = await notion.databases.retrieve({
          database_id: database.id,
        });
        // Get DB contents
        const childDbResponse = await notion.databases.query({
          database_id: database.id,
        });

        // Tranforming data into desired format
        let filteredDb = childDbResponse.results
          .filter((prop) => prop.properties.Heading.title.length > 0)
          .map((prop) => {
            return {
              Heading: prop.properties.Heading?.title[0].text.content,
              1: prop.properties[1].number,
              2: prop.properties[2].number,
              3: prop.properties[3].number,
            };
          });

        // Getting earlier metadata / transformed data in a more digestable format
        let data = {
          name: childDbMetadata?.title[0].plain_text,
          data: filteredDb,
        };
        return new Promise((res, rej) => {
          res(data);
        });
      });
      // Storing all processed data
      Promise.all(promises).then((result) => {
        const workout = new Workout({
          workout: workoutPage.properties.Workout.select.name,
          date: workoutPage.properties.Date.date.start,
          exercises: result,
        });

        workout
          .save()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
    res.send("Processed");
  })();
});
