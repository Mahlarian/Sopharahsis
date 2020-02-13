module.exports = {
    mentionToUserID: mention => {
      const matches = mention.match(/^<@!?(\d+)>$/);
      if (!matches) return null;
      return matches[1];
    }
  };