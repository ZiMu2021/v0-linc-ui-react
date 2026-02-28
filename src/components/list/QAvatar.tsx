/**
 * QAvatar - シンプルなアバターコンポーネント
 *
 * QItem の QItemSection(avatar) 内で使用するアバター。
 * 画像・テキスト・アイコンをサポートする。
 */

import type { FC, ReactNode } from 'react'
import { clsx } from 'clsx'

/** アバターのサイズバリアント */
export type AvatarSize = 'sm' | 'md' | 'lg'

/** アバターのカラーバリアント */
export type AvatarColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'

export interface QAvatarProps {
  /** アバターのサイズ */
  size?: AvatarSize
  /** 背景カラーバリアント */
  color?: AvatarColor
  /** 画像 URL */
  src?: string
  /** 画像の代替テキスト */
  alt?: string
  /** 正方形にする（デフォルトは円形） */
  square?: boolean
  /** 角丸にする */
  rounded?: boolean
  /** 追加クラス */
  className?: string
  /** 子要素（テキスト・アイコンなど） */
  children?: ReactNode
}

/** サイズに応じた Tailwind クラスマップ */
const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

/** カラーバリアントに応じた Tailwind クラスマップ */
const colorClasses: Record<AvatarColor, string> = {
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
  success: 'bg-emerald-500 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-destructive text-destructive-foreground',
  neutral: 'bg-muted text-muted-foreground',
}

/**
 * QAvatar コンポーネント
 */
const QAvatar: FC<QAvatarProps> = ({
  size = 'md',
  color = 'primary',
  src,
  alt = '',
  square = false,
  rounded = false,
  className,
  children,
}) => {
  const classes = clsx(
    // ベーススタイル
    'q-avatar inline-flex items-center justify-center overflow-hidden shrink-0 font-medium',
    // サイズ
    sizeClasses[size],
    // 形状
    square ? 'rounded-none' : rounded ? 'rounded-lg' : 'rounded-full',
    // 画像がない場合のカラー
    !src && colorClasses[color],
    // 追加クラス
    className
  )

  if (src) {
    return (
      <div className={classes}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  return <div className={classes}>{children}</div>
}

export default QAvatar
