class Employee {
}
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

export default {
  schema: [Employee, Sequence],
  schemaVersion: 0,
};
