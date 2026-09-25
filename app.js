const articleData = {
  scholarship: {
    category: 'ACTION / 大学',
    title: '後期授業料減免の申請受付が始まりました',
    lead: '家計基準に該当する学生は、後期授業料の一部が減免される可能性があります。',
    why: '「大学生」「一人暮らし」「今年度の収入情報」に該当するためです。',
    facts: [['受け取れる可能性', '最大 ¥48,000'], ['申請期限', '9月29日（火）'], ['必要書類', '3点'] ],
    source: '〇〇大学 学生支援課',
    verified: '最終確認：2026年9月23日',
    action: '手続きに追加する',
  },
  city: {
    category: 'NEWS / 自治体',
    title: '10月から、若者向け家賃補助の対象地域が広がります',
    lead: '家賃補助の対象地域が拡大されます。現在登録されている住所が対象地域に含まれます。',
    why: '登録住所が対象地域にあり、年齢条件にも該当するためです。',
    facts: [['変更開始', '10月1日'], ['対象', '18〜29歳'], ['確認すること', '所得条件'] ],
    source: '〇〇市 住宅政策課',
    verified: '最終確認：2026年9月22日',
    action: '詳しい条件を確認する',
  },
  internship: {
    category: 'CHANCE / 勤務先',
    title: '秋のスキルアップ講座',
    lead: '業務に役立つ講座を、会社の補助で受講できます。興味のある講座があるか確認してみましょう。',
    why: '登録されている職種と、対象講座のテーマが一致するためです。',
    facts: [['補助', '受講料全額'], ['申込期限', '9月30日'], ['対象', '全社員'] ],
    source: '〇〇株式会社 人材開発室',
    verified: '最終確認：2026年9月23日',
    action: '講座一覧を見る',
  },
  event: {
    category: 'CHANCE / 自治体',
    title: '地域の防災ワークショップ',
    lead: '一人暮らしの方向けに、家具の固定や災害時の備えを学べるイベントが開催されます。',
    why: '登録住所の近隣で開催され、一人暮らしの方向けだからです。',
    facts: [['開催日', '10月10日'], ['参加費', '無料'], ['会場', '市民センター'] ],
    source: '〇〇市 防災安全課',
    verified: '最終確認：2026年9月21日',
    action: '参加を申し込む',
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const detailModal = $('#detailModal');
const scanModal = $('#scanModal');
const profileModal = $('#profileModal');
const proceduresModal = $('#proceduresModal');
let currentArticle = null;
let toastTimer;

function openModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.hidden = true;
  if (!document.querySelector('.modal-backdrop:not([hidden])')) document.body.style.overflow = '';
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderFacts(facts) {
  $('#detailFacts').innerHTML = facts.map(([label, value]) => `<div class="fact"><span>${label}</span><strong>${value}</strong></div>`).join('');
}

function openDetail(key) {
  currentArticle = articleData[key];
  $('#detailCategory').textContent = currentArticle.category;
  $('#detailTitle').textContent = currentArticle.title;
  $('#detailLead').textContent = currentArticle.lead;
  $('#detailWhy').textContent = currentArticle.why;
  $('#detailSource').textContent = currentArticle.source;
  $('#detailVerified').textContent = currentArticle.verified;
  $('#detailAction').innerHTML = `${currentArticle.action} <span>→</span>`;
  renderFacts(currentArticle.facts);
  openModal(detailModal);
}

$$('.open-detail').forEach((button) => {
  button.addEventListener('click', (event) => openDetail(event.currentTarget.closest('[data-article]').dataset.article));
});

$$('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.modal-backdrop')));
});

$$('.modal-backdrop').forEach((backdrop) => {
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal(backdrop);
  });
});

$('#detailAction').addEventListener('click', () => {
  closeModal(detailModal);
  showToast(currentArticle?.category.startsWith('ACTION') ? '手続き一覧に追加しました' : '確認リストに追加しました');
  const procedureBadge = document.querySelector('.nav-item[data-view="procedures"] b');
  if (procedureBadge) procedureBadge.textContent = '2';
});

$('#scanButton').addEventListener('click', () => {
  $('#scanStage').hidden = false;
  $('#scanResult').hidden = true;
  $('#registeredResult').hidden = true;
  openModal(scanModal);
});

$('#chooseFileButton').addEventListener('click', () => $('#fileInput').click());
$('#sampleScanButton').addEventListener('click', showScanResult);
$('#fileInput').addEventListener('change', (event) => {
  if (event.target.files.length) showScanResult();
});

function showScanResult() {
  $('#scanStage').hidden = true;
  $('#scanResult').hidden = false;
  $('#registeredResult').hidden = true;
}

$('#registerProcedureButton').addEventListener('click', () => {
  $('#scanResult').hidden = true;
  $('#registeredResult').hidden = false;
  const procedureBadge = document.querySelector('.nav-item[data-view="procedures"] b');
  if (procedureBadge) procedureBadge.textContent = '2';
  showToast(`${$('#reminderSelect').value}のリマインダーを設定しました`);
});

$('#profileButton').addEventListener('click', () => {
  openModal(profileModal);
});

$$('.profile-chip').forEach((chip) => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

$('#saveProfileButton').addEventListener('click', () => {
  const name = $('#nameInput').value.trim() || 'あおい';
  $('#userGreeting').textContent = `${name}さん`;
  closeModal(profileModal);
  showToast('プロフィールを保存しました');
});

$$('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    $$('.nav-item').forEach((nav) => nav.classList.remove('active'));
    item.classList.add('active');
    const view = item.dataset.view;
    if (view === 'procedures') openModal(proceduresModal);
    if (view === 'settings') showToast('プロフィール設定はデモ準備中です');
  });
});

$('#completeProcedureButton').addEventListener('click', () => {
  const item = $('#insuranceProcedure');
  item.classList.add('done');
  item.querySelector('.procedure-status').textContent = '✓';
  item.querySelector('.complete-button').remove();
  item.insertAdjacentHTML('beforeend', '<span class="done-label">完了</span>');
  showToast('手続きを完了にしました');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    $$('.modal-backdrop:not([hidden])').forEach(closeModal);
  }
});
