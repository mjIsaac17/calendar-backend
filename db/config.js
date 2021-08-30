const { connect } = require("mongoose");

const dbConnection = async () => {
  try {
    await connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error when connecting to the database");
  }
};

module.exports = {
  dbConnection,
};
