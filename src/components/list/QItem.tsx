/**
 * QItem - Quasar の QItem に相当するリストアイテムコンポーネント
 *
 * リストの各行を表すコンポーネント。クリック可能・無効・アクティブ・
 * リンクなどの状態をサポートする。親 QList の dense/dark を継承する。
 *
 * @example
 * <QItem clickable onClick={() => console.log('clicked')}>
 *   <QItemSection>テキスト</QItemSection>
 * </QItem>
 */

import { forwardRef, useRef, useImperativeHandle } from 'react'
import type { KeyboardEvent } from 'react'
import { clsx } from 'clsx'
import { useListContext } from './ListContext'
import type { QItemProps } from './types'

/**
 * QItem コンポーネント
 *
 * href が指定された場合はアンカー要素、それ以外は div でレンダリングされる。
 *
 * @param active       - アクティブ状態
 * @param activeClass  - アクティブ時のカスタムクラス
 * @param clickable    - クリック可能（ホバーエフェクトを付与）
 * @param dense        - コンパクトモード（省略時は親 QList から継承）
 * @param disable      - 無効状態
 * @param dark         - ダークモードを強制する（省略時は親 QList から継承）
 * @param href         - リンク先 URL（指定時は <a> 要素としてレンダリング）
 * @param target       - アンカーの target 属性
 * @param insetLevel   - 左インデントの倍数（1 = 56px）
 * @param tabIndex     - タブインデックス
 */
const QItem = forwardRef<HTMLElement, QItemProps>(
  (
    {
      active = false,
      activeClass,
      clickable = false,
      dense: denseProp,
      disable = false,
      dark: darkProp,
      href,
      target,
      insetLevel,
      tabIndex,
      className,
      children,
      onClick,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    /** 親 QList のコンテキストから dense / dark を取得 */
    const { dense: contextDense, dark: contextDark } = useListContext()

    /** prop が明示的に渡された場合はそちらを優先する */
    const isDense = denseProp ?? contextDense
    const isDark = darkProp ?? contextDark

    /** isClickable: href があるか clickable が指定されている場合 */
    const isClickable = !disable && (clickable || !!href)

    /** 内部 DOM 参照（forwardRef との統合用） */
    const innerRef = useRef<HTMLElement>(null)
    useImperativeHandle(ref, () => innerRef.current as HTMLElement)

    /**
     * Enter / Space キーでクリックをエミュレートする
     * （role="button" の場合のアクセシビリティ対応）
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        ;(e.currentTarget as HTMLElement).click()
      }
      onKeyDown?.(e as never)
    }

    /** インセットレベルに応じた左パディング */
    const insetStyle =
      insetLevel !== undefined
        ? { paddingLeft: `${insetLevel * 56}px` }
        : undefined

    /** デフォルトのアクティブクラス */
    const defaultActiveClass = isDark
      ? 'bg-white/10 text-white'
      : 'bg-primary/10 text-primary'

    const classes = clsx(
      // ベーススタイル
      'q-item relative flex items-center w-full text-left outline-none',
      // 高さ：dense か通常か
      isDense ? 'min-h-[32px] py-1 px-4' : 'min-h-[48px] py-3 px-4',
      // クリック可能
      isClickable && [
        'cursor-pointer select-none',
        'transition-colors duration-200',
        isDark
          ? 'hover:bg-white/10 focus-visible:bg-white/15'
          : 'hover:bg-accent focus-visible:bg-accent/80',
      ],
      // 無効状態
      disable && 'opacity-40 cursor-not-allowed pointer-events-none',
      // アクティブ状態
      active && (activeClass ?? defaultActiveClass),
      // ダークモード
      isDark && 'text-foreground',
      // 追加クラス
      className
    )

    /** 共通プロパティ */
    const commonProps = {
      className: classes,
      style: insetStyle,
      'aria-disabled': disable ? true : undefined,
      role: isClickable ? 'button' : 'listitem',
      tabIndex: disable ? -1 : (tabIndex ?? (isClickable ? 0 : undefined)),
      onKeyDown: handleKeyDown,
      onClick: !disable ? (onClick as never) : undefined,
      ...rest,
    }

    /** href が指定されている場合はアンカー要素としてレンダリング */
    if (href) {
      return (
        <a
          ref={innerRef as React.RefObject<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          {...(commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      )
    }

    return (
      <div
        ref={innerRef as React.RefObject<HTMLDivElement>}
        {...(commonProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    )
  }
)

QItem.displayName = 'QItem'

export default QItem
