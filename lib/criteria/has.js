module.exports = function () {
  const brie = this;
  const getType = this.diagnostics().getType;
  const has = function (data_in, c_data) {
    let hasProp = false;
    if (c_data.hasOwnProperty('trait') && data_in.hasOwnProperty(c_data['trait'])) {
      hasProp = true;
      if (c_data.hasOwnProperty('comparison') && c_data.hasOwnProperty('value')) {
        const type = getType(data_in[c_data['trait']]).toLowerCase();
        try {
          return brie.determine[type][c_data['comparison']].apply(brie, [data_in[c_data['trait']], c_data['value']]);
        } catch (e) {
          console.error('********** Exception handled in "has" method. **********');
          console.error('Unrecognized type or comparator:\n       ', e.message);
          console.error("Data Trait: ", c_data['trait']);
          console.error("Trait Value: ", data_in[c_data['trait']]);
          console.error("type: ", type);
          console.error("comparator: ", c_data['comparison']);
          console.error("Sorry.  brie does not have a method called brie.determine." + type + "." + c_data['comparison'] + "()");
          console.error("Returning boolean::false, by default.");
          console.error('********** Exception handled in "has" method. **********');
          return false;
        }
      }
    }
    return hasProp;
  };
  Object.assign(brie.criteria, { has: has });
};
