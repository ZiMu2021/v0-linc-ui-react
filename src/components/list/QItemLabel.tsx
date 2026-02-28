/**
 * QItemLabel - Quasar の QItemLabel に相当するラベルコンポーネント
 *
 * QItemSection 内でテキストコンテンツを表示するために使用する。
 * 通常テキスト・キャプション・オーバーライン・ヘッダーの
 * 4 種類のスタイルバリアントをサポートする。
 *
 * @example
 * <QItemSection>
 *   <QItemLabel overline>カテゴリ</QItemLabel>
 *   <QItemLabel>メインテキスト</QItemLabel>
 *   <QItemLabel caption lines={2}>
 *     説明テキストが長い場合は2行で省略されます
 *   </QItemLabel>
 * </QItemSection>
 */

import type { FC, CSSProperties } from 'react'
import { clsx } from 'clsx'
import type { QItemLabelProps } from './types'

/**
 * QItemLabel コンポーネント
 *
 * @param header    - リストのセクション見出しスタイル
 * @param caption   - サブタイトル（小さめのグレーテキスト）
 * @param overline  - オーバーライン（上付き小テキスト・大文字）
 * @param lines     - 最大表示行数（超過分は省略記号で切り捨て）
 */
const QItemLabel: FC<QItemLabelProps> = ({
  header = false,
  caption = false,
  overline = false,
  lines,
  className,
  children,
  style,
  ...rest
}) => {
  /**
   * lines プロパティが指定された場合、-webkit-line-clamp で行数制限する
   * CSS を生成する（Webkit 系ブラウザ対応）
   */
  const lineClampStyle: CSSProperties =
    lines !== undefined
      ? {
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }
      : {}

  const classes = clsx(
    // ベーススタイル
    'q-item__label leading-snug',
    // ヘッダー：セクション見出し用の上部パディング付き大文字スタイル
    header && [
      'q-item__label--header',
      'pt-4 pb-1 px-4',
      'text-xs font-semibold tracking-wider uppercase',
      'text-primary',
    ],
    // キャプション：説明文・サブタイトル用の小さいグレーテキスト
    caption && [
      'q-item__label--caption',
      'text-xs text-muted-foreground leading-relaxed',
    ],
    // オーバーライン：アイテムの上部に表示する小さい強調テキスト
    overline && [
      'q-item__label--overline',
      'text-[10px] font-medium tracking-widest uppercase text-muted-foreground',
    ],
    // 通常ラベル（header / caption / overline のいずれでもない）
    !header && !caption && !overline && ['text-sm font-normal text-foreground'],
    // 省略なし設定
    !lines && 'truncate',
    // 追加クラス
    className
  )

  /** ヘッダーは div、通常ラベルは span で意味論的に使い分ける */
  if (header) {
    return (
      <div
        className={classes}
        style={{ ...lineClampStyle, ...style }}
        {...rest}
      >
        {children}
      </div>
    )
  }

  return (
    <span
      className={classes}
      style={{ ...lineClampStyle, ...style }}
      {...rest}
    >
      {children}
    </span>
  )
}

export default QItemLabel
