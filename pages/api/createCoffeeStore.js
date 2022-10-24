import {
  table,
  getMinifiedRecords,
  findRecordsByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, address, voting, imgUrl } = req.body;
    if (id) {
      try {
        const records = await findRecordsByFilter(id);

        if (records.length !== 0) {
          res.json(records);
        } else {
          if (name) {
            const createRecord = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const results = getMinifiedRecords(createRecord);
            res.json({ message: "Created a record", results });
          } else {
            res.status(400);
            res.json({ message: "Name or ID missing" });
          }
        }
      } catch (err) {
        console.error("Error creating or finding store. You fucked up.", err);
        res.status(500);
        res.json({
          message: "Error creating or finding store. You fucked up.",
          err,
        });
      }
    } else {
      res.status(400);
      res.json({ message: "Id is missing" });
    }
  }
};

export default createCoffeeStore;
