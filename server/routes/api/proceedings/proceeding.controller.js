var proceedings = [
  {
    id: 1, prevId: 0,
    state: 0,
    createdDate: new Date("2017-10-06T11:30:00+09:00"),
    meetingDate: new Date("2016-03-07T19:30:00+09:00"),
    title: '수원녹색당 임시총회',
    attendees: ['yd','sj','dk','jy','ty','jh'],
    content:
'1. 새운영위원 선출\n\
  김동규(연락담당), 고성준, 신지연(경기운영위참석), 한태연(친환경급식담당), 최연두(모임장소섭외/회계담당)\n\
\n\
2. 전년도 수원녹색당 활동지원이월금 2016 총선 선거기금 전용\n\
  - 경기녹색당 예결산위원회 권고에 따라 2015년 수원녹색당 활동지원 이월금 1,229,000원을 2016년 총선 선거기금으로 전용 건으로\n\
  임시총회에서 표결에 붙였고 그 결과 이월금액을 총선기금으로 전용하기로 하였음.\n\
  \n\
3. 3월 정당연설회 & 현수막 게시 - 3월 한달간 매주 일요일 마다 정당연설회와 현수막을 설치하기로 결정함.\n\
\n\
3.1. 정당연설회 일정\n\
  3/13(일)-오후1시 수원역, 오후3시 행궁동광장\n\
  3/20(일)-오후1시 북수원홈플러스, 오후3시 영통홈플러스\n\
  3/27(일)-오후1시 수원역\n\
 * 상황에 따라 장소 추가 및 변동사항이 있을 수 있음.\n\
\n\
3.2. 현수막 게시\n\
  총 20장 게시\n\
  정당연설회 전 정당연설회 인근 장소에 게시 예정.',
    childDecisions: [2,3,4]
  }
];
var proceedingID = 6;

var proceedings2 = [
  { id: 1, prevId: 0, state: 0, createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 5, 24, 11, 33, 30, 0), title: '5월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [1] },
  { id: 2, prevId: 0, state: 0, createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 6, 24, 11, 33, 30, 0), title: '6월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [2] },
  { id: 3, prevId: 0, state: 0, createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 7, 24, 11, 33, 30, 0), title: '7월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [3] },
  { id: 4, prevId: 0, state: 0, createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 8, 24, 11, 33, 30, 0), title: '8월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [4] },
  { id: 5, prevId: 0, state: 0, createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), meetingDate: new Date(2016, 9, 24, 11, 33, 30, 0), title: '9월 정기 회의', attendees: ['1','2','3','4','5'], content: 'blah blah', childDecisions: [5] }
];
var proceedingID2 = 6;

exports.getAll = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(proceedings);
  else
    res.json(proceedings2);
}
exports.getByID =  (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(proceedings.find(item => item.id === +req.params.id));
  else
    res.json(proceedings2.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  if (req.params.group === 'suwongreenparty'){
    let i = proceedings.findIndex(item => item.id === +req.params.id);
    proceedings[i] = req.body;
  }
  else {
    let i = proceedings2.findIndex(item => item.id === +req.params.id);
    proceedings2[i] = req.body;
  }
  res.send();
}
exports.create = (req, res) => {
  let newProceeding = req.body;
  if (req.params.group === 'suwongreenparty'){
    newProceeding['id'] = proceedingID++;
    proceedings.push(newProceeding);
  }
  else{
    newProceeding['id'] = proceedingID2++;
    proceedings2.push(newProceeding);
  }
  res.json(newProceeding);
}
exports.deleteByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    proceedings = proceedings.filter(h => h.id !== +req.params.id);
  else
    proceedings2 = proceedings2.filter(h => h.id !== +req.params.id);
  res.send();
}
