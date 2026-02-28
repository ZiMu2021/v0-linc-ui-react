/**
 * Quasar List コンポーネント群の型定義
 *
 * Quasar の QList / QItem / QItemSection / QItemLabel に相当する
 * React + TypeScript 向けの型定義ファイル。
 */

import type { HTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// QList
// ─────────────────────────────────────────────────────────────────────────────

/** QList コンポーネントのプロパティ */
export interface QListProps extends HTMLAttributes<HTMLDivElement> {
  /** ボーダーを表示する */
  bordered?: boolean
  /** アイテム間にセパレーターを追加する */
  separator?: boolean
  /** コンパクト（Dense）モード：行の高さを縮小する */
  dense?: boolean
  /** ダークモードを強制する */
  dark?: boolean
  /** パディングを追加する */
  padding?: boolean
  /** 子要素 */
  children?: ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// QItem
// ─────────────────────────────────────────────────────────────────────────────

/** QItem コンポーネントのプロパティ */
export interface QItemProps extends HTMLAttributes<HTMLElement> {
  /** アクティブ状態（選択中） */
  active?: boolean
  /** アクティブ時のカスタムクラス */
  activeClass?: string
  /** クリック可能（ホバーエフェクトを付与） */
  clickable?: boolean
  /** コンパクト（Dense）モード */
  dense?: boolean
  /** 無効状態 */
  disable?: boolean
  /** ダークモードを強制する */
  dark?: boolean
  /** href を指定するとアンカー要素としてレンダリングされる */
  href?: string
  /** アンカー要素の target 属性 */
  target?: string
  /** インセット（左インデント）の倍数 */
  insetLevel?: number
  /** マニュアルフォーカスを付与する */
  manualFocus?: boolean
  /** タブインデックス */
  tabIndex?: number
  /** 子要素 */
  children?: ReactNode
}

/** アンカー要素としての QItem プロパティ */
export interface QItemAnchorProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
  activeClass?: string
  clickable?: boolean
  dense?: boolean
  disable?: boolean
  dark?: boolean
  insetLevel?: number
  children?: ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// QItemSection
// ─────────────────────────────────────────────────────────────────────────────

/** QItemSection のサイドタイプ */
export type QItemSectionSide = 'avatar' | 'thumbnail' | 'side'

/** QItemSection コンポーネントのプロパティ */
export interface QItemSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** アバターサイズのサイドセクション */
  avatar?: boolean
  /** サムネイルサイズのサイドセクション */
  thumbnail?: boolean
  /** 汎用サイドセクション */
  side?: boolean
  /** コンテンツを上揃えにする */
  top?: boolean
  /** テキストを省略せず折り返さない */
  noWrap?: boolean
  /** 子要素 */
  children?: ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// QItemLabel
// ─────────────────────────────────────────────────────────────────────────────

/** QItemLabel コンポーネントのプロパティ */
export interface QItemLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** ヘッダーラベル（リストのセクション見出し） */
  header?: boolean
  /** サブタイトルスタイル */
  caption?: boolean
  /** オーバーラインスタイル（上付き小テキスト） */
  overline?: boolean
  /** 最大表示行数（-webkit-line-clamp を使用） */
  lines?: number
  /** 子要素 */
  children?: ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// QSeparator
// ─────────────────────────────────────────────────────────────────────────────

/** QSeparator コンポーネントのプロパティ */
export interface QSeparatorProps extends HTMLAttributes<HTMLHRElement> {
  /** 水平方向（デフォルト） */
  horizontal?: boolean
  /** 垂直方向 */
  vertical?: boolean
  /** スパンクラスを使用してセクションインセットを適用する */
  inset?: boolean | 'item' | 'item-thumbnail'
  /** ダークモード */
  dark?: boolean
  /** スペーサーとして使用（高さ/幅を持つ透明なセパレーター） */
  spaced?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// テーマ・コンテキスト
// ─────────────────────────────────────────────────────────────────────────────

/** List コンポーネント共通のコンテキスト値 */
export interface ListContextValue {
  /** コンパクトモードが有効かどうか */
  dense: boolean
  /** ダークモードが有効かどうか */
  dark: boolean
  /** セパレーターが有効かどうか */
  separator: boolean
}
