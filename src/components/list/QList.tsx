/**
 * QList - Quasar の QList に相当するリストコンテナコンポーネント
 *
 * アイテムをまとめてリスト形式で表示するコンテナ。
 * bordered, separator, dense, dark, padding などのオプションをサポートする。
 *
 * @example
 * <QList bordered separator>
 *   <QItem clickable>...</QItem>
 * </QList>
 */

import { useMemo } from 'react'
import type { FC } from 'react'
import { clsx } from 'clsx'
import { ListContext } from './ListContext'
import type { QListProps } from './types'

/**
 * QList コンポーネント
 *
 * @param bordered    - ボーダーを表示する
 * @param separator   - アイテム間にセパレーターを追加する
 * @param dense       - コンパクトモード
 * @param dark        - ダークモードを強制する
 * @param padding     - 上下パディングを追加する
 * @param className   - 追加の CSS クラス
 * @param children    - 子要素
 */
const QList: FC<QListProps> = ({
  bordered = false,
  separator = false,
  dense = false,
  dark = false,
  padding = false,
  className,
  children,
  ...rest
}) => {
  /** コンテキスト値をメモ化して不要な再レンダリングを防ぐ */
  const contextValue = useMemo(
    () => ({ dense, dark, separator }),
    [dense, dark, separator]
  )

  const classes = clsx(
    // ベーススタイル
    'q-list relative',
    // ボーダー
    bordered && 'q-list--bordered border rounded-lg',
    // セパレーター（CSS で子 QItem に区切り線を付与）
    separator && 'q-list--separator',
    // パディング
    padding && 'py-2',
    // ダークモード
    dark ? 'q-list--dark' : '',
    // 追加クラス
    className
  )

  return (
    <ListContext.Provider value={contextValue}>
      {/* role="list" でスクリーンリーダーにリストとして認識させる */}
      <div role="list" className={classes} {...rest}>
        {children}
      </div>
    </ListContext.Provider>
  )
}

export default QList
