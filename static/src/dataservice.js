export class DataService {
  fetchUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {name: 'Foo', points: 1, bonusPoints: 2},
          {name: 'Bar', points: 2, bonusPoints: 0}
        ]);
      }, 1500);
    })
    .then(users => {
      return users.map(user => {
        user.totalPoints = user.points + user.bonusPoints;
        return user
      }); // TODO sort
    });
  }
}