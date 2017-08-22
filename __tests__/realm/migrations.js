import Realm from 'realm';
import update from 'immutability-helper';
import path from 'path';
import Promise from 'bluebird';
import schema0 from '../../realm/migrations/schema0';
import schema1 from '../../realm/migrations/schema1';
import sequencer from '../../realm/sequencer';
import schema0TestData from './fixtures/schema0.json';

describe('migrations', () => {
  const TEST_PATH = path.join(process.cwd(), '__tests__/databases/migrationTest');
  let realm;

  describe('schema 0', () => {
    beforeAll(() =>
      Realm.open({
        path: TEST_PATH,
        ...schema0,
      }).then((r) => {
        realm = r;
      }),
    );

    afterAll(() => {
      realm.close();
    });

    it('should sequence fixtures', () => {
      expect(realm.objects('Sequence').length).toEqual(0);
      expect(realm.objects('Employee').length).toEqual(0);

      const promise = schema0TestData.reduce((p, fixture, index) => {
        const schemaName = fixture.$schema;
        const data = update(fixture, {
          $unset: ['$schema'],
        });

        return p.then(() => sequencer(realm, schemaName, data));
      }, Promise.resolve(null));

      return promise.then(() => {
        const foodItemSequence = realm.objects('Sequence').filtered('name = "Employee"')[0];
        expect(foodItemSequence.value).toEqual(3);

        expect(realm.objects('Employee').length).toEqual(3);
      });
    });
  });

  describe('schema 1', () => {
    beforeAll(() =>
      Realm.open({
        path: TEST_PATH,
        ...schema1,
      }).then((r) => {
        realm = r;
      }),
    );

    afterAll(() => {
      realm.close();
    });

    it('should duplicate food items', () => {
      const foodItemSequence = realm.objects('Sequence').filtered('name = "Employee"')[0];
      const foodTemplateSequence = realm.objects('Sequence').filtered('name = "EmployeeTitle"')[0];

      expect(realm.objects('EmployeeTitle').length).toEqual(3);
      expect(foodItemSequence.value).toEqual(3);
      expect(foodTemplateSequence.value).toEqual(3);
      expect(realm.objects('EmployeeTitle').length).toEqual(3);
    });

    it('should create the titles', () => {
      const titles = realm.objects('EmployeeTitle').map(employee => employee.title);
      expect(titles).toEqual(["CEO", "COO", "Co-founder"]);
    });
  });
});
