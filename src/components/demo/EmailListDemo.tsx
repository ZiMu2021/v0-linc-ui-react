/**
 * EmailListDemo - メールリストのデモ
 *
 * QItemLabel の lines プロパティ（行数制限）と overline・caption を
 * 組み合わせたメール一覧画面の例。Quasar ドキュメントの "Emails" サンプルに相当する。
 */

import { useState } from 'react'
import type { FC } from 'react'
import { Star, Paperclip } from 'lucide-react'
import { QList, QItem, QItemSection, QItemLabel, QSeparator } from '../list'
import QAvatar from '../list/QAvatar'

/** メールデータの型 */
interface Email {
  id: number
  /** 送信者名 */
  from: string
  /** 件名 */
  subject: string
  /** 本文プレビュー */
  preview: string
  /** 受信日時 */
  time: string
  /** 未読かどうか */
  unread: boolean
  /** スター付きかどうか */
  starred: boolean
  /** 添付ファイルがあるかどうか */
  hasAttachment: boolean
  /** アバターの頭文字 */
  initials: string
  /** アバターカラー */
  color: 'primary' | 'success' | 'warning' | 'error' | 'accent' | 'neutral'
}

/** デモ用のメールデータ */
const emails: Email[] = [
  {
    id: 1,
    from: '山田 太郎',
    subject: '来週のミーティングについて',
    preview:
      'お疲れ様です。来週月曜日の午後2時からのミーティングについてご確認いただけますでしょうか。議題は新しいプロジェクトの進捗報告です。',
    time: '10:42',
    unread: true,
    starred: true,
    hasAttachment: true,
    initials: '山',
    color: 'primary',
  },
  {
    id: 2,
    from: 'GitHub',
    subject: '[v0-linc-ui] Pull request #42: List component',
    preview:
      'ZiMu2021 opened a pull request: Add Quasar-inspired list component with TypeScript support...',
    time: '9:15',
    unread: true,
    starred: false,
    hasAttachment: false,
    initials: 'G',
    color: 'neutral',
  },
  {
    id: 3,
    from: '佐藤 花子',
    subject: 'デザインレビューのフィードバック',
    preview:
      'ご確認いただきありがとうございます。いくつかの修正点についてコメントをまとめましたので、ご確認ください。',
    time: '昨日',
    unread: false,
    starred: false,
    hasAttachment: true,
    initials: '佐',
    color: 'success',
  },
  {
    id: 4,
    from: 'Vercel',
    subject: 'Your deployment is ready',
    preview:
      'Your latest deployment to production is live. Visit your project dashboard to view the deployment details and analytics.',
    time: '昨日',
    unread: false,
    starred: true,
    hasAttachment: false,
    initials: 'V',
    color: 'accent',
  },
  {
    id: 5,
    from: '鈴木 一郎',
    subject: '月次レポート送付',
    preview:
      '先月分の月次レポートを添付いたします。売上は前月比12%増となっており、特にモバイル部門の成長が目立ちます。',
    time: '月曜日',
    unread: false,
    starred: false,
    hasAttachment: true,
    initials: '鈴',
    color: 'warning',
  },
]

const EmailListDemo: FC = () => {
  /** スター状態を管理する */
  const [starredIds, setStarredIds] = useState<Set<number>>(
    new Set(emails.filter((e) => e.starred).map((e) => e.id))
  )

  const toggleStar = (id: number) => {
    setStarredIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <QList bordered>
      {emails.map((email, index) => (
        <div key={email.id}>
          <QItem
            clickable
            className={email.unread ? 'bg-primary/5 hover:bg-primary/10' : undefined}
          >
            {/* アバター */}
            <QItemSection avatar>
              <QAvatar color={email.color} size="md">
                {email.initials}
              </QAvatar>
            </QItemSection>

            {/* メイン：件名・プレビュー */}
            <QItemSection>
              <div className="flex items-center gap-2">
                {email.unread && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" aria-label="未読" />
                )}
                <QItemLabel
                  className={email.unread ? 'font-semibold' : 'font-normal'}
                >
                  {email.subject}
                </QItemLabel>
              </div>
              <QItemLabel caption>{email.from}</QItemLabel>
              <QItemLabel caption lines={1}>
                {email.preview}
              </QItemLabel>
            </QItemSection>

            {/* サイド：時刻・スター・添付 */}
            <QItemSection side top>
              <div className="flex flex-col items-end gap-1">
                <QItemLabel caption>{email.time}</QItemLabel>
                <div className="flex items-center gap-1">
                  {email.hasAttachment && (
                    <Paperclip
                      size={13}
                      className="text-muted-foreground"
                      aria-label="添付ファイルあり"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStar(email.id)
                    }}
                    className="p-0.5 rounded hover:bg-accent transition-colors"
                    aria-label={
                      starredIds.has(email.id) ? 'スターを外す' : 'スターを付ける'
                    }
                  >
                    <Star
                      size={14}
                      className={
                        starredIds.has(email.id)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-muted-foreground'
                      }
                    />
                  </button>
                </div>
              </div>
            </QItemSection>
          </QItem>

          {index < emails.length - 1 && <QSeparator inset="item" />}
        </div>
      ))}
    </QList>
  )
}

export default EmailListDemo
