module.exports = {
    mentionToUserID: mention => {
      const matches = mention.match(/^<@!?(\d+)>$/);
      if (!matches) return null;
      return matches[1];
    },
    addUserToDB: (userID, db) => {
      db.run("INSERT INTO `USERS` (`discordID`) VALUES (?)", userID);
      console.log(`New user was created with the id: ${userID}`);
      const result = db.get("SELECT * FROM USERS WHERE discordID= ?", userID);
      return result;
    },
    addServerToDB: (serverID, db) => {
      db.run("INSERT INTO `SERVERS` (`discordID`) VALUES (?)", serverID);
      console.log(`New server was created with the id: ${serverID}`);
      const result = db.get("SELECT * FROM SERVERS WHERE discordID= ?", serverID);
      return result;
    }
  };