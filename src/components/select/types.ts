/**
 * LSelect コンポーネントの型定義モジュール
 * Quasar の QSelect コンポーネントを参考に設計された
 * React + TypeScript 向けセレクトコンポーネントの型定義
 */

// ============================================================
// 基本オプション型
// ============================================================

/**
 * セレクトオプションの基本インターフェース
 * オブジェクト形式のオプションに使用する
 */
export interface SelectOption {
  /** 表示ラベル */
  label: string
  /** 実際の値 */
  value: string | number | boolean | null
  /** 無効化フラグ */
  disable?: boolean
  /** アバター・アイコン URL（カスタムレンダリング用） */
  avatar?: string
  /** カスタムデータ（任意の追加情報） */
  [key: string]: unknown
}

/**
 * セレクトで使用できる値の型
 * 文字列・数値・ブール値・null・オブジェクトを受け付ける
 */
export type SelectValue = string | number | boolean | null | SelectOption

// ============================================================
// バリアント・外観型
// ============================================================

/**
 * フィールドのデザインバリアント
 * Quasar の QInput/QSelect のデザインバリアントに対応
 * - filled:     背景色付き（薄いグレー）
 * - outlined:   アウトライン枠線
 * - standout:   フォーカス時に強調表示
 * - borderless: 枠線なし
 */
export type SelectVariant = 'filled' | 'outlined' | 'standout' | 'borderless'

/**
 * カラーテーマ
 */
export type SelectColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'positive'
  | 'negative'
  | 'warning'
  | 'info'

// ============================================================
// コンポーネント Props 型
// ============================================================

/**
 * LSelect コンポーネントの Props インターフェース
 */
export interface LSelectProps<TMultiple extends boolean = false> {
  // ----------------------------------------------------------
  // モデル・データ関連
  // ----------------------------------------------------------

  /**
   * 現在の選択値
   * - 単一選択: SelectValue
   * - 複数選択: SelectValue[]
   */
  value: TMultiple extends true ? SelectValue[] : SelectValue

  /**
   * 選択変更時のコールバック
   */
  onChange: (value: TMultiple extends true ? SelectValue[] : SelectValue) => void

  /**
   * 選択肢の配列
   * 文字列配列またはオブジェクト配列を受け付ける
   */
  options: SelectOption[] | string[] | number[]

  // ----------------------------------------------------------
  // 外観・レイアウト関連
  // ----------------------------------------------------------

  /**
   * フィールドラベル
   */
  label?: string

  /**
   * プレースホルダーテキスト
   */
  placeholder?: string

  /**
   * ヒントテキスト（フィールド下部に表示）
   */
  hint?: string

  /**
   * エラーメッセージ（表示時はエラー状態になる）
   */
  error?: string

  /**
   * デザインバリアント
   * @default 'outlined'
   */
  variant?: SelectVariant

  /**
   * アクセントカラー
   * @default 'primary'
   */
  color?: SelectColor

  /**
   * ラベルのカラー（指定なしは color と同じ）
   */
  labelColor?: SelectColor

  /**
   * 前置アイコン名（lucide-react のアイコンコンポーネント）
   */
  prependIcon?: React.ReactNode

  /**
   * 後置アイコン名（lucide-react のアイコンコンポーネント）
   */
  appendIcon?: React.ReactNode

  /**
   * フィールド幅をコンテナいっぱいに広げる
   * @default false
   */
  fullWidth?: boolean

  /**
   * 角丸を適用する
   * @default false
   */
  rounded?: boolean

  /**
   * スタック状態のラベル（常に上部に浮かせる）
   * @default false
   */
  stackLabel?: boolean

  // ----------------------------------------------------------
  // 機能・振る舞い関連
  // ----------------------------------------------------------

  /**
   * 複数選択を有効にする
   * @default false
   */
  multiple?: TMultiple

  /**
   * 入力フィルター機能を有効にする
   * @default false
   */
  useInput?: boolean

  /**
   * 選択済み項目をチップ（タグ）表示する
   * multiple が true の場合に有効
   * @default false
   */
  useChips?: boolean

  /**
   * クリアボタンを表示する
   * @default false
   */
  clearable?: boolean

  /**
   * 無効化状態
   * @default false
   */
  disabled?: boolean

  /**
   * 読み取り専用状態
   * @default false
   */
  readonly?: boolean

  /**
   * ローディング状態を表示
   * @default false
   */
  loading?: boolean

  /**
   * emit-value モード
   * true の場合、オブジェクトオプションの value プロパティのみを emit する
   * @default false
   */
  emitValue?: boolean

  /**
   * map-options モード
   * true の場合、値からオプションオブジェクトへのマッピングを行う
   * @default false
   */
  mapOptions?: boolean

  /**
   * 複数選択時の最大選択数
   */
  maxValues?: number

  /**
   * 複数選択時に選択数バッジを表示
   * @default false
   */
  counter?: boolean

  /**
   * ドロップダウンの表示モード
   * - menu:   デスクトップ風メニュー
   * - dialog: モーダルダイアログ
   * @default 'menu'
   */
  behavior?: 'menu' | 'dialog'

  /**
   * ドロップダウンの最大高さ（px または CSS 値）
   * @default '60vh'
   */
  dropdownMaxHeight?: string | number

  /**
   * オプションリストのカスタムレンダラー
   */
  renderOption?: (option: SelectOption, selected: boolean) => React.ReactNode

  /**
   * 選択済み値の表示カスタマイズ
   */
  renderSelected?: (value: SelectValue) => React.ReactNode

  // ----------------------------------------------------------
  // オプションのカスタムフィールド名
  // ----------------------------------------------------------

  /**
   * ラベルに使用するフィールド名
   * @default 'label'
   */
  optionLabel?: string | ((opt: SelectOption) => string)

  /**
   * 値に使用するフィールド名
   * @default 'value'
   */
  optionValue?: string | ((opt: SelectOption) => SelectValue)

  /**
   * 無効フラグに使用するフィールド名
   * @default 'disable'
   */
  optionDisable?: string | ((opt: SelectOption) => boolean)

  // ----------------------------------------------------------
  // フィルター関連
  // ----------------------------------------------------------

  /**
   * カスタムフィルター関数
   * useInput が true の場合に使用
   */
  filterFn?: (inputVal: string, update: (fn: () => void) => void) => void

  /**
   * 検索入力値変更時のコールバック
   */
  onFilter?: (inputVal: string) => void

  // ----------------------------------------------------------
  // イベント関連
  // ----------------------------------------------------------

  /**
   * ドロップダウンが開いた時のコールバック
   */
  onPopupShow?: () => void

  /**
   * ドロップダウンが閉じた時のコールバック
   */
  onPopupHide?: () => void

  /**
   * フォーカス時のコールバック
   */
  onFocus?: () => void

  /**
   * ブラー時のコールバック
   */
  onBlur?: () => void

  // ----------------------------------------------------------
  // アクセシビリティ・その他
  // ----------------------------------------------------------

  /**
   * カスタム CSS クラス
   */
  className?: string

  /**
   * aria-label 属性
   */
  ariaLabel?: string

  /**
   * コンポーネント ID
   */
  id?: string

  /**
   * フォームの name 属性
   */
  name?: string
}

// ============================================================
// 内部ユーティリティ型
// ============================================================

/**
 * 正規化済みオプション型（内部処理用）
 */
export interface NormalizedOption {
  /** 表示ラベル */
  label: string
  /** 実際の値 */
  value: SelectValue
  /** 無効化フラグ */
  disable: boolean
  /** 元のオプションデータ */
  original: SelectOption | string | number
}

/**
 * セレクトの内部状態インターフェース
 */
export interface SelectState {
  /** ドロップダウンの開閉状態 */
  isOpen: boolean
  /** フォーカス状態 */
  isFocused: boolean
  /** 検索入力値 */
  inputValue: string
  /** フィルター後のオプション一覧 */
  filteredOptions: NormalizedOption[]
  /** ハイライト中のオプションインデックス */
  highlightedIndex: number
}
