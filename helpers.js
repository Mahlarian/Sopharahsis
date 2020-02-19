module.exports = {
    mentionToUserID: mention => {
      const matches = mention.match(/^<@!?(\d+)>$/);
      if (!matches) return null;
      return matches[1];
    },
    addUserToDB: (userID, db) => {
      db.run("INSERT INTO `USERS` (`discordID`) VALUES (?)", userID);
      console.log("New user was created with the id:" + userID);
      const result = db.get("SELECT * FROM USERS WHERE discordID='" + userID + "'");
      return result;
    }
  };