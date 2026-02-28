/**
 * QItemSection - Quasar の QItemSection に相当するセクションコンポーネント
 *
 * QItem 内でコンテンツを構造化するために使用する。
 * プロパティなし（メインセクション）、avatar、thumbnail、side の
 * 4 種類のモードをサポートする。
 *
 * @example
 * <QItem>
 *   <QItemSection avatar>
 *     <QAvatar />
 *   </QItemSection>
 *   <QItemSection>
 *     <QItemLabel>メインテキスト</QItemLabel>
 *     <QItemLabel caption>サブテキスト</QItemLabel>
 *   </QItemSection>
 *   <QItemSection side>
 *     <QIcon name="info" />
 *   </QItemSection>
 * </QItem>
 */

import type { FC } from 'react'
import { clsx } from 'clsx'
import type { QItemSectionProps } from './types'

/**
 * QItemSection コンポーネント
 *
 * @param avatar    - アバターサイズの左/右セクション（最小幅 56px）
 * @param thumbnail - サムネイルサイズの左/右セクション（最小幅 100px）
 * @param side      - 汎用サイドセクション（コンテンツ幅に合わせる）
 * @param top       - コンテンツを上揃えにする
 * @param noWrap    - テキストの折り返しを無効にする
 */
const QItemSection: FC<QItemSectionProps> = ({
  avatar = false,
  thumbnail = false,
  side = false,
  top = false,
  noWrap = false,
  className,
  children,
  ...rest
}) => {
  /** サイドセクション（avatar, thumbnail, side のいずれか）かどうか */
  const isSide = avatar || thumbnail || side

  const classes = clsx(
    // ベーススタイル
    'q-item__section flex flex-col justify-center',
    // メインセクション：利用可能な幅いっぱいに広がる
    !isSide && 'flex-1 min-w-0',
    // アバターセクション：固定幅 + 中央揃え
    avatar && 'q-item__section--avatar min-w-[56px] max-w-[56px] items-center',
    // サムネイルセクション：固定幅（画像向け）
    thumbnail &&
      'q-item__section--thumbnail min-w-[100px] max-w-[100px] items-center',
    // サイドセクション：コンテンツ幅に合わせる + テキストを右揃え
    side &&
      !avatar &&
      !thumbnail &&
      'q-item__section--side min-w-0 items-end text-muted-foreground text-sm',
    // 上揃え
    top && 'justify-start pt-3',
    // 折り返し無効
    noWrap && 'whitespace-nowrap',
    // 追加クラス
    className
  )

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}

export default QItemSection
