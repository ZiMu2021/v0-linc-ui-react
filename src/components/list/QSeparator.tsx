/**
 * QSeparator - Quasar の QSeparator に相当するセパレーターコンポーネント
 *
 * リストのセクション間や任意の場所にセパレーター（区切り線）を
 * 挿入するために使用する。水平・垂直方向、インセットオプションをサポートする。
 *
 * @example
 * <QSeparator />
 * <QSeparator inset="item" />
 * <QSeparator spaced />
 */

import type { FC } from 'react'
import { clsx } from 'clsx'
import type { QSeparatorProps } from './types'

/**
 * QSeparator コンポーネント
 *
 * @param horizontal  - 水平方向（デフォルト true）
 * @param vertical    - 垂直方向
 * @param inset       - インセット設定（true: 72px, "item": 16px, "item-thumbnail": 116px）
 * @param dark        - ダークモード
 * @param spaced      - 上下にスペースを追加する
 */
const QSeparator: FC<QSeparatorProps> = ({
  horizontal = true,
  vertical = false,
  inset = false,
  dark = false,
  spaced = false,
  className,
  style,
  ...rest
}) => {
  /** インセットの左マージンを計算する */
  const getInsetMargin = (): string | undefined => {
    if (!inset) return undefined
    if (inset === 'item') return '16px'
    if (inset === 'item-thumbnail') return '116px'
    // inset === true の場合
    return '72px'
  }

  const insetMargin = getInsetMargin()

  const classes = clsx(
    'q-separator',
    // 水平・垂直の切り替え
    !vertical
      ? // 水平セパレーター
        'block w-full h-px border-0'
      : // 垂直セパレーター
        'inline-block h-full w-px border-0 mx-2',
    // カラー
    dark ? 'bg-white/20' : 'bg-border',
    // スペース付き
    spaced && !vertical && 'my-2',
    spaced && vertical && 'mx-2',
    // 追加クラス
    className
  )

  const inlineStyle = insetMargin
    ? { marginLeft: insetMargin, ...style }
    : style

  return (
    <hr
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      className={classes}
      style={inlineStyle}
      {...rest}
    />
  )
}

export default QSeparator
