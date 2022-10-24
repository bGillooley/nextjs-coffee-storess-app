import {
  table,
  findRecordsByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const favouriteCoffeeStorebyId = async (req, res) => {
  if (req.method === "PUT") {
    const { id } = req.body;
    try {
      if (id) {
        const records = await findRecordsByFilter(id);
        if (records.length !== 0) {
          const record = records[0];
          const votes = parseInt(record.voting) + parseInt(1);
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: votes,
              },
            },
          ]);
          if (updateRecord) {
            const updatedRecordResult = getMinifiedRecords(updateRecord);
            res.json(updatedRecordResult);
          }
        } else {
          res.json({ message: "No id found in database man", id });
        }
      } else {
        res.status(400);
        res.json({ message: "No id supplied" });
      }
    } catch (err) {
      res.status(500);
      res.json({ message: "Error upvoting coffee store", err });
    }
  }
};

export default favouriteCoffeeStorebyId;
