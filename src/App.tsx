/**
 * LSelect デモショーケースページ
 * 全バリアント・全機能のインタラクティブデモを提供する
 */

import { useState } from 'react'
import { Globe, MapPin, User } from 'lucide-react'
import { LSelect } from './components/select'
import type { SelectOption, SelectValue } from './components/select'

// ============================================================
// デモ用データ定義
// ============================================================

/** 都道府県一覧 */
const PREFECTURES: SelectOption[] = [
  { label: '北海道', value: 'hokkaido' },
  { label: '青森県', value: 'aomori' },
  { label: '岩手県', value: 'iwate' },
  { label: '宮城県', value: 'miyagi' },
  { label: '秋田県', value: 'akita' },
  { label: '山形県', value: 'yamagata' },
  { label: '福島県', value: 'fukushima' },
  { label: '茨城県', value: 'ibaraki' },
  { label: '栃木県', value: 'tochigi' },
  { label: '群馬県', value: 'gunma' },
  { label: '埼玉県', value: 'saitama' },
  { label: '千葉県', value: 'chiba' },
  { label: '東京都', value: 'tokyo' },
  { label: '神奈川県', value: 'kanagawa' },
  { label: '新潟県', value: 'niigata' },
  { label: '富山県', value: 'toyama' },
  { label: '石川県', value: 'ishikawa' },
  { label: '福井県', value: 'fukui' },
  { label: '山梨県', value: 'yamanashi' },
  { label: '長野県', value: 'nagano' },
  { label: '岐阜県', value: 'gifu' },
  { label: '静岡県', value: 'shizuoka' },
  { label: '愛知県', value: 'aichi' },
  { label: '三重県', value: 'mie' },
  { label: '滋賀県', value: 'shiga' },
  { label: '京都府', value: 'kyoto' },
  { label: '大阪府', value: 'osaka' },
  { label: '兵庫県', value: 'hyogo' },
  { label: '奈良県', value: 'nara' },
  { label: '和歌山県', value: 'wakayama' },
  { label: '沖縄県', value: 'okinawa' },
]

/** プログラミング言語一覧 */
const LANGUAGES: SelectOption[] = [
  { label: 'TypeScript', value: 'ts' },
  { label: 'JavaScript', value: 'js' },
  { label: 'Python', value: 'py' },
  { label: 'Rust', value: 'rust' },
  { label: 'Go', value: 'go' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp', disable: true },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
]

/** フルーツ一覧（文字列） */
const FRUITS = ['リンゴ', 'バナナ', 'オレンジ', 'ブドウ', 'スイカ', 'メロン', 'イチゴ', 'モモ']

/** チームメンバー（カスタムラベル/値フィールド） */
const TEAM_MEMBERS: Array<{ name: string; id: number; role: string }> = [
  { name: '田中 太郎', id: 1, role: 'フロントエンド' },
  { name: '佐藤 花子', id: 2, role: 'バックエンド' },
  { name: '鈴木 一郎', id: 3, role: 'デザイナー' },
  { name: '高橋 美咲', id: 4, role: 'PM' },
  { name: '伊藤 健太', id: 5, role: 'DevOps' },
]

// ============================================================
// デモセクションラッパー
// ============================================================

/**
 * デモセクションのレイアウトラッパーコンポーネント
 */
function DemoSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-6 items-start">{children}</div>
    </section>
  )
}

/**
 * 状態表示バッジ
 */
function ValueBadge({ label, value }: { label: string; value: unknown }) {
  const display =
    value === null || value === undefined
      ? '(未選択)'
      : Array.isArray(value)
        ? value.length === 0
          ? '(未選択)'
          : JSON.stringify(value)
        : JSON.stringify(value)

  return (
    <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2">
      <span className="font-medium text-foreground/60 shrink-0">{label}:</span>
      <code className="break-all bg-muted/60 px-1.5 py-0.5 rounded text-foreground/80 max-w-xs">
        {display}
      </code>
    </div>
  )
}

// ============================================================
// メインアプリコンポーネント
// ============================================================

/**
 * LSelect コンポーネントのインタラクティブデモページ
 */
export default function App() {
  // ----------------------------------------------------------
  // デモ状態管理
  // ----------------------------------------------------------

  /** バリアントデモ */
  const [filledVal, setFilledVal] = useState<SelectValue>(null)
  const [outlinedVal, setOutlinedVal] = useState<SelectValue>(null)
  const [standoutVal, setStandoutVal] = useState<SelectValue>(null)
  const [borderlessVal, setBorderlessVal] = useState<SelectValue>(null)

  /** 複数選択 */
  const [multiVal, setMultiVal] = useState<SelectValue[]>([])
  const [chipsVal, setChipsVal] = useState<SelectValue[]>([])

  /** 検索・フィルター */
  const [searchVal, setSearchVal] = useState<SelectValue>(null)
  const [filterOpts, setFilterOpts] = useState<SelectOption[]>(PREFECTURES)

  /** カラーテーマ */
  const [colorPrimary, setColorPrimary] = useState<SelectValue>(null)
  const [colorPositive, setColorPositive] = useState<SelectValue>(null)
  const [colorNegative, setColorNegative] = useState<SelectValue>(null)
  const [colorWarning, setColorWarning] = useState<SelectValue>(null)

  /** 機能デモ */
  const [clearableVal, setClearableVal] = useState<SelectValue>(null)
  const [disabledVal] = useState<SelectValue>('ts')
  const [readonlyVal] = useState<SelectValue>('py')
  const [loadingVal, setLoadingVal] = useState<SelectValue>(null)
  const [errorVal, setErrorVal] = useState<SelectValue>(null)
  const [roundedVal, setRoundedVal] = useState<SelectValue>(null)

  /** カスタムフィールド */
  const [memberVal, setMemberVal] = useState<SelectValue>(null)

  /** ダイアログモード */
  const [dialogVal, setDialogVal] = useState<SelectValue>(null)
  const [dialogMultiVal, setDialogMultiVal] = useState<SelectValue[]>([])

  /** emit-value */
  const [emitVal, setEmitVal] = useState<SelectValue>(null)

  /** カウンター */
  const [counterVal, setCounterVal] = useState<SelectValue[]>([])

  // ----------------------------------------------------------
  // カスタムフィルターハンドラー
  // ----------------------------------------------------------

  /**
   * 都道府県のインクリメンタル検索ハンドラー
   */
  const handlePrefectureFilter = (inputVal: string) => {
    const filtered = inputVal
      ? PREFECTURES.filter((p) => p.label.includes(inputVal))
      : PREFECTURES
    setFilterOpts(filtered)
  }

  // ----------------------------------------------------------
  // レンダリング
  // ----------------------------------------------------------

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ヘッダー */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">L</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground tracking-tight">LSelect</h1>
              <p className="text-xs text-muted-foreground">React + TypeScript Select Component</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
              Quasar QSelect インスパイア
            </span>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ===================================================
            1. デザインバリアント
            =================================================== */}
        <DemoSection
          title="デザインバリアント"
          description="Quasar の QSelect と同様に 4 種類のデザインバリアントをサポートします。"
        >
          <div className="flex flex-col gap-2 w-64">
            <LSelect
              id="filled-demo"
              label="Filled"
              variant="filled"
              options={FRUITS}
              value={filledVal}
              onChange={setFilledVal}
              placeholder="選択してください"
            />
            <ValueBadge label="値" value={filledVal} />
          </div>

          <div className="flex flex-col gap-2 w-64">
            <LSelect
              id="outlined-demo"
              label="Outlined（デフォルト）"
              variant="outlined"
              options={FRUITS}
              value={outlinedVal}
              onChange={setOutlinedVal}
              placeholder="選択してください"
            />
            <ValueBadge label="値" value={outlinedVal} />
          </div>

          <div className="flex flex-col gap-2 w-64">
            <LSelect
              id="standout-demo"
              label="Standout"
              variant="standout"
              options={FRUITS}
              value={standoutVal}
              onChange={setStandoutVal}
              placeholder="選択してください"
            />
            <ValueBadge label="値" value={standoutVal} />
          </div>

          <div className="flex flex-col gap-2 w-64">
            <LSelect
              id="borderless-demo"
              label="Borderless"
              variant="borderless"
              options={FRUITS}
              value={borderlessVal}
              onChange={setBorderlessVal}
              placeholder="選択してください"
            />
            <ValueBadge label="値" value={borderlessVal} />
          </div>
        </DemoSection>

        {/* ===================================================
            2. カラーテーマ
            =================================================== */}
        <DemoSection
          title="カラーテーマ"
          description="primary / positive / negative / warning など複数のカラーテーマに対応しています。"
        >
          <LSelect
            label="Primary（青）"
            color="primary"
            options={LANGUAGES}
            value={colorPrimary}
            onChange={setColorPrimary}
            className="w-56"
          />
          <LSelect
            label="Positive（緑）"
            color="positive"
            options={LANGUAGES}
            value={colorPositive}
            onChange={setColorPositive}
            className="w-56"
          />
          <LSelect
            label="Negative（赤）"
            color="negative"
            options={LANGUAGES}
            value={colorNegative}
            onChange={setColorNegative}
            className="w-56"
          />
          <LSelect
            label="Warning（黄）"
            color="warning"
            options={LANGUAGES}
            value={colorWarning}
            onChange={setColorWarning}
            className="w-56"
          />
        </DemoSection>

        {/* ===================================================
            3. 複数選択
            =================================================== */}
        <DemoSection
          title="複数選択"
          description="multiple プロパティで複数選択を有効化します。useChips でチップ（タグ）表示に切り替わります。"
        >
          <div className="flex flex-col gap-2 w-72">
            <LSelect
              label="複数選択（テキスト表示）"
              options={LANGUAGES}
              value={multiVal}
              onChange={(v) => setMultiVal(v as SelectValue[])}
              multiple
              clearable
              counter
              placeholder="言語を選択"
            />
            <ValueBadge label="値" value={multiVal} />
          </div>

          <div className="flex flex-col gap-2 w-72">
            <LSelect
              label="複数選択 + チップ表示"
              options={LANGUAGES}
              value={chipsVal}
              onChange={(v) => setChipsVal(v as SelectValue[])}
              multiple
              useChips
              clearable
              maxValues={4}
              placeholder="最大4つまで選択"
              hint="最大4言語まで選択できます"
            />
            <ValueBadge label="値" value={chipsVal} />
          </div>
        </DemoSection>

        {/* ===================================================
            4. 検索・フィルター
            =================================================== */}
        <DemoSection
          title="検索・フィルター（useInput）"
          description="useInput プロパティで入力フィールドが有効化され、リアルタイムフィルタリングが可能になります。"
        >
          <div className="flex flex-col gap-2 w-64">
            <LSelect
              label="都道府県を検索"
              options={filterOpts}
              value={searchVal}
              onChange={setSearchVal}
              useInput
              clearable
              placeholder="名前を入力..."
              onFilter={handlePrefectureFilter}
              prependIcon={<MapPin size={16} />}
            />
            <ValueBadge label="値" value={searchVal} />
          </div>

          <div className="flex flex-col gap-2 w-64">
            <LSelect
              label="言語を検索（複数）"
              options={LANGUAGES}
              value={chipsVal}
              onChange={(v) => setChipsVal(v as SelectValue[])}
              multiple
              useInput
              useChips
              clearable
              placeholder="検索または選択..."
              prependIcon={<Globe size={16} />}
            />
          </div>
        </DemoSection>

        {/* ===================================================
            5. アイコン・デコレーター
            =================================================== */}
        <DemoSection
          title="アイコン・デコレーター"
          description="prependIcon / appendIcon で前後にアイコンを配置できます。"
        >
          <LSelect
            label="ユーザー"
            options={FRUITS}
            value={filledVal}
            onChange={setFilledVal}
            prependIcon={<User size={16} />}
            className="w-56"
          />
          <LSelect
            label="場所"
            options={PREFECTURES}
            value={searchVal}
            onChange={setSearchVal}
            prependIcon={<MapPin size={16} />}
            className="w-56"
          />
          <LSelect
            label="言語"
            options={LANGUAGES}
            value={colorPrimary}
            onChange={setColorPrimary}
            prependIcon={<Globe size={16} />}
            className="w-56"
          />
        </DemoSection>

        {/* ===================================================
            6. クリアボタン / 無効 / 読み取り専用
            =================================================== */}
        <DemoSection
          title="Clearable / Disabled / Readonly"
          description="clearable でクリアボタンを表示。disabled で無効化、readonly で読み取り専用にできます。"
        >
          <div className="flex flex-col gap-2 w-56">
            <LSelect
              label="Clearable"
              options={LANGUAGES}
              value={clearableVal}
              onChange={setClearableVal}
              clearable
              placeholder="選択してください"
            />
            <ValueBadge label="値" value={clearableVal} />
          </div>

          <div className="flex flex-col gap-2 w-56">
            <LSelect
              label="Disabled"
              options={LANGUAGES}
              value={disabledVal}
              onChange={() => {}}
              disabled
            />
            <span className="text-xs text-muted-foreground">操作不可</span>
          </div>

          <div className="flex flex-col gap-2 w-56">
            <LSelect
              label="Readonly"
              options={LANGUAGES}
              value={readonlyVal}
              onChange={() => {}}
              readonly
            />
            <span className="text-xs text-muted-foreground">読み取り専用</span>
          </div>
        </DemoSection>

        {/* ===================================================
            7. ヒント / エラー / ローディング
            =================================================== */}
        <DemoSection
          title="ヒント・エラー・ローディング"
          description="hint でヒントテキスト、error でエラー状態、loading でローディング状態を表示します。"
        >
          <LSelect
            label="ヒントあり"
            options={FRUITS}
            value={filledVal}
            onChange={setFilledVal}
            hint="好きなフルーツを1つ選択してください"
            className="w-56"
          />

          <LSelect
            label="エラー状態"
            options={FRUITS}
            value={errorVal}
            onChange={setErrorVal}
            error="必須項目です"
            className="w-56"
          />

          <LSelect
            label="ローディング中"
            options={FRUITS}
            value={loadingVal}
            onChange={setLoadingVal}
            loading
            className="w-56"
          />
        </DemoSection>

        {/* ===================================================
            8. 角丸スタイル
            =================================================== */}
        <DemoSection
          title="角丸（Rounded）"
          description="rounded プロパティで pill 形状のスタイルを適用します。"
        >
          <LSelect
            label="Rounded Outlined"
            variant="outlined"
            options={FRUITS}
            value={roundedVal}
            onChange={setRoundedVal}
            rounded
            clearable
            className="w-64"
          />
          <LSelect
            label="Rounded Filled"
            variant="filled"
            options={FRUITS}
            value={roundedVal}
            onChange={setRoundedVal}
            rounded
            clearable
            className="w-64"
          />
        </DemoSection>

        {/* ===================================================
            9. カスタムフィールド名
            =================================================== */}
        <DemoSection
          title="カスタムフィールド名（optionLabel / optionValue）"
          description="オプションオブジェクトのフィールド名をカスタマイズできます。"
        >
          <div className="flex flex-col gap-2 w-72">
            <LSelect
              label="チームメンバー"
              options={TEAM_MEMBERS as unknown as SelectOption[]}
              optionLabel="name"
              optionValue="id"
              value={memberVal}
              onChange={setMemberVal}
              prependIcon={<User size={16} />}
              placeholder="メンバーを選択"
            />
            <ValueBadge label="選択ID" value={memberVal} />
          </div>
        </DemoSection>

        {/* ===================================================
            10. emit-value モード
            =================================================== */}
        <DemoSection
          title="Emit Value モード"
          description="emitValue を有効にすると、オブジェクトの value プロパティのみが onChange に渡されます。"
        >
          <div className="flex flex-col gap-2 w-64">
            <LSelect
              label="言語（emit-value）"
              options={LANGUAGES}
              value={emitVal}
              onChange={setEmitVal}
              emitValue
            />
            <ValueBadge label="値（プリミティブ）" value={emitVal} />
          </div>
        </DemoSection>

        {/* ===================================================
            11. カウンター（最大選択数）
            =================================================== */}
        <DemoSection
          title="カウンター・最大選択数"
          description="counter で選択数を表示、maxValues で最大選択数を制限します。"
        >
          <div className="flex flex-col gap-2 w-72">
            <LSelect
              label="最大3つまで選択"
              options={LANGUAGES}
              value={counterVal}
              onChange={(v) => setCounterVal(v as SelectValue[])}
              multiple
              counter
              maxValues={3}
              useChips
              clearable
              color="positive"
            />
            <ValueBadge label="選択数" value={counterVal.length} />
          </div>
        </DemoSection>

        {/* ===================================================
            12. ダイアログモード
            =================================================== */}
        <DemoSection
          title="ダイアログモード（behavior=dialog）"
          description="behavior='dialog' でモバイルフレンドリーなモーダルダイアログとして表示します。"
        >
          <div className="flex flex-col gap-2 w-64">
            <LSelect
              label="都道府県（ダイアログ）"
              options={PREFECTURES}
              value={dialogVal}
              onChange={setDialogVal}
              behavior="dialog"
              useInput
              clearable
              placeholder="選択してください"
            />
            <ValueBadge label="値" value={dialogVal} />
          </div>

          <div className="flex flex-col gap-2 w-64">
            <LSelect
              label="言語複数選択（ダイアログ）"
              options={LANGUAGES}
              value={dialogMultiVal}
              onChange={(v) => setDialogMultiVal(v as SelectValue[])}
              behavior="dialog"
              multiple
              useChips
              clearable
              placeholder="言語を選択"
            />
            <ValueBadge label="値" value={dialogMultiVal} />
          </div>
        </DemoSection>

        {/* ===================================================
            13. stack-label
            =================================================== */}
        <DemoSection
          title="Stack Label"
          description="stackLabel でラベルを常に上部に固定表示します。"
        >
          <LSelect
            label="常にラベル表示"
            options={FRUITS}
            value={filledVal}
            onChange={setFilledVal}
            stackLabel
            placeholder="フルーツを選択"
            className="w-56"
          />
          <LSelect
            label="Filled + Stack Label"
            variant="filled"
            options={FRUITS}
            value={standoutVal}
            onChange={setStandoutVal}
            stackLabel
            placeholder="フルーツを選択"
            className="w-56"
          />
        </DemoSection>

      </main>

      {/* フッター */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-muted-foreground">
          LSelect — Quasar QSelect インスパイアの React + TypeScript セレクトコンポーネント
        </div>
      </footer>
    </div>
  )
}
