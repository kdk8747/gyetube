
var activities = [
  { id: 1, modifiedDate: new Date(2016, 5, 24, 11, 33, 30, 0), activityDate: new Date(2016, 5, 24, 11, 33, 30, 0), content: 'hahaha', parentPolicy: 1, childReceipts: [1] },
  { id: 2, modifiedDate: new Date(2016, 6, 2, 11, 33, 30, 0), activityDate: new Date(2016, 6, 2, 11, 33, 30, 0), content: 'hohoho', parentPolicy: 2, childReceipts: [2] },
  { id: 3, modifiedDate: new Date(2016, 6, 24, 11, 33, 30, 0), activityDate: new Date(2016, 6, 24, 11, 33, 30, 0), content: 'huhoho', parentPolicy: 3, childReceipts: [3] },
  { id: 4, modifiedDate: new Date(2016, 7, 4, 11, 33, 30, 0), activityDate: new Date(2016, 7, 4, 11, 33, 30, 0), content: 'hohuho', parentPolicy: 4, childReceipts: [4] },
  { id: 5, modifiedDate: new Date(2016, 7, 24, 11, 33, 30, 0), activityDate: new Date(2016, 7, 24, 11, 33, 30, 0), content: 'hohohu', parentPolicy: 4, childReceipts: [5] },
  { id: 6, modifiedDate: new Date(2016, 8, 2, 11, 33, 30, 0), activityDate: new Date(2016, 8, 2, 11, 33, 30, 0), content: 'huhuhu', parentPolicy: 1, childReceipts: [6] },
  { id: 7, modifiedDate: new Date(2016, 8, 24, 11, 33, 30, 0), activityDate: new Date(2016, 8, 24, 11, 33, 30, 0), content: 'hohuha', parentPolicy: 5, childReceipts: [7] },
  { id: 8, modifiedDate: new Date(2016, 9, 4, 11, 33, 30, 0), activityDate: new Date(2016, 9, 4, 11, 33, 30, 0), content: 'hohoha', parentPolicy: 2, childReceipts: [8] },
  { id: 9, modifiedDate: new Date(2016, 9, 24, 11, 33, 30, 0), activityDate: new Date(2016, 9, 24, 11, 33, 30, 0), content: 'hahoho', parentPolicy: 5, childReceipts: [9] },
  { id: 10, modifiedDate: new Date(2016, 10, 24, 11, 33, 30, 0), activityDate: new Date(2016, 10, 24, 11, 33, 30, 0), content: 'hahuhu', parentPolicy: 1, childReceipts: [10, 11] }
];
var activityID = 11;
exports.getAll = (req, res) => {
  res.json(activities);
}
exports.getByID = (req, res) => {
  res.json(activities.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  let i = activities.findIndex(item => item.id === +req.params.id);
  activities[i] = req.body;
  res.send();
}
exports.create = (req, res) => {
  let newHero = req.body;
  newHero['id'] = activityID++;
  activities.push(newHero);
  res.json(newHero);
}
exports.deleteByID = (req, res) => {
  activities = activities.filter(h => h.id !== +req.params.id);
  res.send();
}