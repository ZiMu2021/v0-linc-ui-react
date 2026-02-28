/**
 * DemoSection - デモセクションのラッパーコンポーネント
 *
 * 各デモを見出し・説明文とともにカード形式で表示する汎用コンテナ。
 */

import type { FC, ReactNode } from 'react'

export interface DemoSectionProps {
  /** セクションタイトル */
  title: string
  /** セクションの説明文 */
  description?: string
  /** デモコンテンツ */
  children: ReactNode
  /** コードタグとして表示するコンポーネント名のリスト */
  tags?: string[]
}

const DemoSection: FC<DemoSectionProps> = ({
  title,
  description,
  children,
  tags,
}) => {
  return (
    <section className="mb-12">
      {/* ヘッダー */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            {title}
          </h2>
          {tags?.map((tag) => (
            <code
              key={tag}
              className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-md"
            >
              {tag}
            </code>
          ))}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* デモコンテンツ */}
      <div>{children}</div>
    </section>
  )
}

export default DemoSection
