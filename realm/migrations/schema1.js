import moment from 'moment';
import update from 'immutability-helper';

class Employee {}
Employee.schema = {
  name: 'Employee',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    title: 'string',
  },
};

class Sequence {
  next() {
    this.value = this.value + 1;
    return this.value;
  }
}
Sequence.schema = {
  name: 'Sequence',
  primaryKey: 'name',
  properties: {
    name: 'string',
    value: 'int',
  },
};

class EmployeeTitle {}
EmployeeTitle.schema = {
  name: 'EmployeeTitle',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string',
    createDate: 'date',
    updateDate: { type: 'date', optional: true },
  },
};

const migration = (oldRealm, newRealm) => {
  // only apply this change if upgrading to schemaVersion 1
  if (oldRealm.schemaVersion < 1) {
    const oldObjects = oldRealm.objects('Employee');
    const now = moment().utc().toDate();

    const oldFood = oldObjects.map((oldFoodItem) => {
      const object = {};
      Object.keys(Employee.schema.properties).forEach((property) => {
        object[property] = oldFoodItem[property];
      });

      return object;
    });

    for (let index = 0; index < oldFood.length; index += 1) {
      const oldFoodItem = oldFood[index];

      // Defaults MUST be set.
      const item = update(oldFoodItem, {
        $unset: ['name'],
        createDate: {
          $set: now,
        },
        updateDate: {
          $set: now,
        },
      });
      newRealm.create('EmployeeTitle', item);
    }
    newRealm.create('Sequence', { name: 'EmployeeTitle', value: oldFood.length });
  }
};

export default {
  schema: [Employee, Sequence, EmployeeTitle],
  schemaVersion: 1,
  migration,
};
