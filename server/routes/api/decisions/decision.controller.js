
var decisions = [
  {
    id: 1, prevId: 0,
    state: 0,
    title: '(과거 활동 기록의 근거 유실됨)',
    createdDate: new Date("2017-10-06T19:30:00+09:00"),
    expiryDate: new Date("2017-10-13T19:30:00+09:00"),
    content: 'GrassCube를 이용하기 전에는 누가 어떤 회의에서 결정을 내렸는지 기록하지 않았습니다.',
    abstainers:[], accepters:[], rejecters:[],
    //parentProceeding: 1,
    childActivities: [1],
    totalElapsedTime: 0,
    totalDifference: 0
  },
  {
    id: 2, prevId: 0,
    state: 0,
    title: '새 운영위원 선출',
    createdDate: new Date("2016-03-07T19:30:00+09:00"),
    expiryDate: new Date("2016-11-28T19:30:00+09:00"),
    content:
'새운영위원 선출\n\
김동규(연락담당), 고성준, 신지연(경기운영위참석), 한태연(친환경급식담당), 최연두(모임장소섭외/회계담당)',
    abstainers:[], accepters:['yd','sj','dk','jy','ty','jh'], rejecters:[],
    parentProceeding: 1,
    childActivities: [],
    totalElapsedTime: 0,
    totalDifference: 0
  },
  {
    id: 3, prevId: 0,
    state: 0,
    title: '전년도 활동지원이월금 2016 총선기금 전용',
    createdDate: new Date("2016-03-07T19:30:00+09:00"),
    expiryDate: new Date("2016-04-13T19:30:00+09:00"),
    content:
'- 경기녹색당 예결산위원회 권고에 따라 2015년 수원녹색당 활동지원 이월금 1,229,000원을 2016년 총선 선거기금으로 전용 건으로\n\
임시총회에서 표결에 붙였고 그 결과 이월금액을 총선기금으로 전용하기로 하였음.',
    abstainers:['sj'], accepters:['dk','jy','jh'], rejecters:['yd','ty'],
    parentProceeding: 1,
    childActivities: [],
    totalElapsedTime: 0,
    totalDifference: 0
  },
  {
    id: 4, prevId: 0,
    state: 0,
    title: '3월 정당연설회 & 현수막 게시',
    createdDate: new Date("2016-03-07T19:30:00+09:00"),
    expiryDate: new Date("2016-04-13T19:30:00+09:00"),
    content:
'3월 한달간 매주 일요일 마다 정당연설회와 현수막을 설치하기로 결정함.\n\
\n\
1. 정당연설회 일정\n\
  3/13(일)-오후1시 수원역, 오후3시 행궁동광장\n\
  3/20(일)-오후1시 북수원홈플러스, 오후3시 영통홈플러스\n\
  3/27(일)-오후1시 수원역\n\
 * 상황에 따라 장소 추가 및 변동사항이 있을 수 있음.\n\
\n\
2. 현수막 게시\n\
  총 20장 게시\n\
  정당연설회 전 정당연설회 인근 장소에 게시 예정.',
    abstainers:[], accepters:['yd','sj','dk','jy','ty','jh'], rejecters:[],
    parentProceeding: 1,
    childActivities: [],
    totalElapsedTime: 0,
    totalDifference: 0
  },
];
var decisionID = 6;

var decisions2 = [
  { id: 1, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 5, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 1,   totalElapsedTime: 30, totalDifference: +4080000, childActivities: [1, 6, 10], title: '설문조사' },
  { id: 2, prevId: 0, state: 0, content: 'dummy content', abstainers:[], accepters:['1','2','3'], rejecters:['4','5'], createdDate: new Date(2016, 6, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 2,  totalElapsedTime: 20, totalDifference: +340000, childActivities: [2, 8], title: '홍보 - 현수막' },
  { id: 3, prevId: 0, state: 0, content: 'dummy content', abstainers:[], accepters:['1','2','3','4','5'], rejecters:[], createdDate: new Date(2016, 7, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 3, totalElapsedTime: 10, totalDifference: -150000, childActivities: [3], title: '한달에 한번 회의' },
  { id: 4, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 8, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 4,   totalElapsedTime: 20, totalDifference: +352500, childActivities: [4, 5], title: '지역구 별 통계 조사' },
  { id: 5, prevId: 0, state: 0, content: 'dummy content', abstainers:['1'], accepters:['2','3'], rejecters:['4','5'], createdDate: new Date(2016, 9, 24, 11, 33, 30, 0), expiryDate: new Date(2018, 5, 24, 11, 33, 30, 0), parentProceeding: 5,   totalElapsedTime: 20, totalDifference: -40000, childActivities: [7, 9], title: '시민사회 연대' }
];
var decisionID2 = 6;

exports.getAll = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(decisions);
  else
    res.json(decisions2);
}
exports.getByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    res.json(decisions.find(item => item.id === +req.params.id));
  else
    res.json(decisions2.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  if (req.params.group === 'suwongreenparty') {
    let i = decisions.findIndex(item => item.id === +req.params.id);
    decisions[i] = req.body;
  }
  else {
    let i = decisions2.findIndex(item => item.id === +req.params.id);
    decisions2[i] = req.body;
  }
  res.send();
}
exports.create = (req, res) => {
  let newDecision = req.body;
  if (req.params.group === 'suwongreenparty') {
    newDecision['id'] = decisionID++;
    decisions.push(newDecision);
  }
  else {
    newDecision['id'] = decisionID2++;
    decisions2.push(newDecision);
  }
  res.json(newDecision);
}
exports.deleteByID = (req, res) => {
  if (req.params.group === 'suwongreenparty')
    decisions = decisions.filter(h => h.id !== +req.params.id);
  else
    decisions2 = decisions2.filter(h => h.id !== +req.params.id);
  res.send();
}
