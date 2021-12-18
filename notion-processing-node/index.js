const { Client } = require("@notionhq/client");

// Create a notion client
const notion = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});

(async () => {
  // Querying Gym Database
  const databaseId = "db876be35ad2484f8906d82517b5edd4";
  const dbResponse = await notion.databases.query({ database_id: databaseId });

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
        "name": childDbMetadata?.title[0].plain_text,
        "data": filteredDb
      }
      return new Promise((res, rej) => {res(data)});
    });
      // Viewing all processed data
      // TODO: Store somewhere
      Promise.all(promises).then((result) => {
        console.log(JSON.stringify({
          "workout": workoutPage.properties.Workout.select.name,
          "date": workoutPage.properties.Date.date.start,
          "exercises": result
        }));
      })
  });
})();
