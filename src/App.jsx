import { useMemo, useState } from 'react'
import './App.css'

const postKey = 'rc-course-finder.ugc'
const saveKey = 'rc-course-finder.saved'

const courses = [
  {
    id: 'nagoya-rc-indoor',
    name: '名古屋インドアRCサーキット',
    area: '愛知',
    station: '名古屋',
    category: 'RCサーキット',
    surface: 'カーペット',
    indoor: true,
    rental: true,
    beginner: true,
    race: true,
    price: 1800,
    rating: 4.5,
    status: '営業中',
    checked: '2026-07-18',
    tags: ['屋内', '初心者向け', 'レンタル', '月例レース'],
    note: '天候に左右されず走れる屋内RCコース。初心者レンタルと大会告知で送客しやすい。',
  },
  {
    id: 'saitama-offroad',
    name: '埼玉オフロードRCパーク',
    area: '埼玉',
    station: '郊外',
    category: 'RCサーキット',
    surface: '土',
    indoor: false,
    rental: false,
    beginner: false,
    race: true,
    price: 2200,
    rating: 4.3,
    status: '営業中',
    checked: '2026-07-18',
    tags: ['屋外', 'オフロード', '大会', '駐車場'],
    note: '路面状態と天候のUGCが重要。タイヤ、バッテリー、宿泊、駐車場導線に広げられる。',
  },
  {
    id: 'osaka-mini4wd',
    name: '大阪ミニ四駆ステーション',
    area: '大阪',
    station: '日本橋',
    category: 'ミニ四駆',
    surface: '3レーン',
    indoor: true,
    rental: false,
    beginner: true,
    race: true,
    price: 500,
    rating: 4.2,
    status: '営業中',
    checked: '2026-07-18',
    tags: ['常設コース', '大会', 'パーツ販売', '初心者歓迎'],
    note: 'コースレイアウト変更、タイム投稿、パーツ販売への収益導線を作りやすい。',
  },
  {
    id: 'shizuoka-kart',
    name: '静岡レンタルカートリンク',
    area: '静岡',
    station: '静岡',
    category: 'ゴーカート',
    surface: 'アスファルト',
    indoor: false,
    rental: true,
    beginner: true,
    race: true,
    price: 3500,
    rating: 4.1,
    status: '営業中',
    checked: '2026-07-18',
    tags: ['レンタルカート', '団体予約', 'タイム計測', '観光導線'],
    note: 'じゃらん系の体験予約、団体利用、観光ルートと相性がよい。',
  },
  {
    id: 'tokyo-slot-mini',
    name: '東京スロットカー&ミニ四駆ラボ',
    area: '東京',
    station: '秋葉原',
    category: 'ミニ四駆',
    surface: '複合',
    indoor: true,
    rental: true,
    beginner: true,
    race: false,
    price: 900,
    rating: 4.0,
    status: '要確認',
    checked: '2026-07-18',
    tags: ['屋内', 'レンタル', '工作スペース', '要営業確認'],
    note: '営業時間やレイアウト変更をUGCで補完し、近隣ショップ回遊へつなげる。',
  },
  {
    id: 'closed-rc',
    name: '閉店アーカイブ: 駅前RCコース',
    area: '神奈川',
    station: '横浜',
    category: '閉店アーカイブ',
    surface: '不明',
    indoor: true,
    rental: false,
    beginner: false,
    race: false,
    price: 0,
    rating: 3.8,
    status: '閉店',
    checked: '2026-07-18',
    tags: ['閉店情報', '思い出投稿', '代替コース'],
    note: 'リンク切れや閉店情報を残し、近隣の代替コースへ送客する。',
  },
]

const revenuePlans = [
  ['走行予約・体験予約', 'RC走行枠、レンタルカート、初心者体験、団体利用へ送客。'],
  ['用品アフィリエイト', 'タイヤ、バッテリー、工具、ミニ四駆パーツ、プロポ、充電器を記事から案内。'],
  ['大会・イベント告知', '月例レース、タイムアタック、初心者講習、親子イベントを有料告知枠にする。'],
  ['確認済み掲載', '店舗が営業日、路面状態、レイアウト、料金、閉店情報を更新できる有料枠。'],
  ['周辺送客', '宿泊、駐車場、飲食、観光、温浴を遠征ルートとして掲載。'],
]

const buzzIdeas = [
  '都道府県別「今走れるRCサーキット」ランキング',
  'ミニ四駆コースレイアウト変更速報',
  '初心者が手ぶらで行けるレンタルRC・カート特集',
  '閉店したRCコースの思い出レビュー募集',
  '雨の日でも走れる屋内コースまとめ',
]

const faq = [
  ['AIに引用されやすい情報は？', '施設名、地域、カテゴリ、屋内外、路面、料金、営業状況、確認日、UGCステータスです。'],
  ['UGCで何を投稿できますか？', '営業確認、閉店、路面、レイアウト変更、大会、レンタル、初心者向け情報、口コミを投稿できます。'],
  ['収益化の中心は？', '走行予約、体験予約、用品アフィリエイト、大会告知、確認済み掲載、遠征送客です。'],
]

function readArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? []
  } catch {
    return []
  }
}

function yen(value) {
  return value === 0
    ? '無料'
    : new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(value)
}

function App() {
  const [query, setQuery] = useState('名古屋')
  const [category, setCategory] = useState('すべて')
  const [filters, setFilters] = useState({ indoor: false, rental: false, beginner: true, race: false })
  const [posts, setPosts] = useState(() => readArray(postKey))
  const [saved, setSaved] = useState(() => readArray(saveKey))
  const [form, setForm] = useState({ name: '', area: '', type: '営業確認', memo: '' })

  const categories = ['すべて', ...new Set(courses.map((course) => course.category))]
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    return courses
      .filter((course) => category === 'すべて' || course.category === category)
      .filter((course) => !filters.indoor || course.indoor)
      .filter((course) => !filters.rental || course.rental)
      .filter((course) => !filters.beginner || course.beginner)
      .filter((course) => !filters.race || course.race)
      .filter((course) => !text || `${course.name} ${course.area} ${course.station} ${course.category} ${course.surface} ${course.tags.join(' ')} ${course.note}`.toLowerCase().includes(text))
      .sort((a, b) => Number(b.status === '営業中') - Number(a.status === '営業中') || b.rating - a.rating)
  }, [category, filters, query])
  const display = filtered.length ? filtered : courses

  const submitPost = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.memo.trim()) return
    const next = [{ ...form, id: crypto.randomUUID(), status: '確認待ち', date: new Date().toLocaleDateString('ja-JP') }, ...posts].slice(0, 8)
    setPosts(next)
    localStorage.setItem(postKey, JSON.stringify(next))
    setForm({ name: '', area: '', type: '営業確認', memo: '' })
  }

  const toggleSaved = (id) => {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(saveKey, JSON.stringify(next))
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <span className="brand">RC Course Finder</span>
          <h1>ラジコン、ミニ四駆、ゴーカート。走れる場所を営業確認つきで探す。</h1>
          <p>
            RCサーキット、ミニ四駆コース、ゴーカート場を屋内外・路面・レンタル・大会・口コミで比較。UGCで閉店や路面状態を更新し、予約、用品、遠征導線へつなげます。
          </p>
        </div>
        <aside className="answer-box">
          <span>AI向け即答</span>
          <strong>施設名、地域、屋内外、路面、料金、営業状況、確認日を1カードで提示</strong>
          <p>検索とAI回答に引用されやすいよう、走れる条件とUGCステータスを短く構造化します。</p>
        </aside>
      </section>

      <section className="search-panel" aria-label="コース検索">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="地域・駅・路面・用途で検索" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>

      <section className="filter-row" aria-label="条件フィルター">
        {Object.entries({ indoor: '屋内', rental: 'レンタルあり', beginner: '初心者向け', race: '大会あり' }).map(([key, label]) => (
          <button key={key} type="button" className={filters[key] ? 'active' : ''} onClick={() => setFilters({ ...filters, [key]: !filters[key] })}>
            {label}
          </button>
        ))}
      </section>

      <section className="summary-grid">
        <article><span>掲載候補</span><strong>{courses.length}</strong><p>営業中・要確認・閉店を管理</p></article>
        <article><span>検索結果</span><strong>{display.length}</strong><p>条件とUGCで絞り込み</p></article>
        <article><span>保存済み</span><strong>{saved.length}</strong><p>遠征前の候補に保存</p></article>
      </section>

      <section className="content-grid">
        {display.map((course) => (
          <article className={course.status === '閉店' ? 'card closed' : 'card'} key={course.id}>
            <div className="card-topline">
              <span>{course.area} / {course.station}</span>
              <span>{course.status}</span>
            </div>
            <h2>{course.name}</h2>
            <p>{course.note}</p>
            <div className="tag-row">{course.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="metric-row">
              <span>{course.surface}</span>
              <span>{yen(course.price)}</span>
              <strong>{course.rating}</strong>
            </div>
            <small>確認日: {course.checked}</small>
            <button type="button" onClick={() => toggleSaved(course.id)}>{saved.includes(course.id) ? '保存済み' : '候補に保存'}</button>
          </article>
        ))}
      </section>

      <section className="ugc-section">
        <div>
          <span className="brand">UGC</span>
          <h2>営業確認・路面状態・大会・閉店情報を投稿</h2>
          <p>投稿をランキング、路面速報、レイアウト変更、確認済み掲載枠へ展開します。</p>
        </div>
        <form className="ugc-form" onSubmit={submitPost}>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="施設名" />
          <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="都道府県・駅" />
          <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option>営業確認</option>
            <option>路面状態</option>
            <option>レイアウト変更</option>
            <option>大会・イベント</option>
            <option>閉店情報</option>
          </select>
          <input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} placeholder="路面・混雑・料金・レンタル・大会情報" />
          <button type="submit">投稿する</button>
        </form>
        <div className="post-grid">
          {posts.length === 0 && <p className="empty-text">まだ投稿はありません。最初の営業確認を投稿できます。</p>}
          {posts.map((post) => (
            <article key={post.id}>
              <span>{post.type} / {post.status}</span>
              <h3>{post.name}</h3>
              <p>{post.memo}</p>
              <small>{post.area || 'エリア未入力'} / {post.date}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="growth-grid">
        <div className="revenue-panel">
          <h2>収益導線</h2>
          {revenuePlans.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}
        </div>
        <div className="buzz-panel">
          <h2>バズ施策</h2>
          <ul>{buzzIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul>
        </div>
      </section>

      <section className="seo-section">
        <div className="answer-box">
          <span className="brand">SEO / AIO / LLMO</span>
          <h2>RC・ミニ四駆・カート施設は、営業確認とコース状態を更新できるUGCが検索価値になります。</h2>
          <p>施設名、地域、屋内外、路面、料金、営業状況、確認日、投稿状態をそろえ、AIが引用しやすい情報単位にしています。</p>
        </div>
        <div className="faq-grid">
          {faq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}
        </div>
      </section>
    </main>
  )
}

export default App
