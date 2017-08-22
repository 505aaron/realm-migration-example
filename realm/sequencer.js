/**
 * 
 * @param {Realm} realmInstance The realm instance.
 * @param {String} schema The realm schema to create or update. 
 * @param {Object} props The updated or new row data.
 */
const sequencer = (realmInstance, schema, props) => new Promise((resolve, reject) => {
  let saved;

  try {
    realmInstance.write(() => {
      const obj = { ...props };

      if (typeof obj.id === 'undefined') {
        let seq = realmInstance.objects('Sequence').filtered(`name = "${schema}"`)[0];
        if (typeof seq === 'undefined') {
          seq = realmInstance.create('Sequence', { name: schema, value: 0 });
        }
        obj.id = seq.next();
      }
      saved = realmInstance.create(schema, obj, true);

      resolve({ ...saved });
    });
  } catch (e) {
    reject(e);
  }
});

export default sequencer;
